create extension if not exists pgcrypto;

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  email text not null,
  role text not null check (role in ('admin','editor','viewer')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, email)
);

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

create or replace function public.member_role(ws uuid)
returns text language sql stable security definer set search_path = public
as $$
  select role from public.workspace_members
  where workspace_id = ws and lower(email) = lower(auth.jwt()->>'email') limit 1
$$;

create or replace function public.bootstrap_workspace(workspace_name text)
returns uuid language plpgsql security definer set search_path = public
as $$
declare new_id uuid; user_email text;
begin
  user_email := lower(auth.jwt()->>'email');
  if user_email is null then raise exception 'You must be signed in'; end if;
  insert into public.workspaces(name) values (workspace_name) returning id into new_id;
  insert into public.workspace_members(workspace_id,email,role) values (new_id,user_email,'admin');
  return new_id;
end $$;

revoke execute on function public.bootstrap_workspace(text) from public, anon;
revoke execute on function public.member_role(uuid) from public, anon;
grant execute on function public.bootstrap_workspace(text) to authenticated;
grant execute on function public.member_role(uuid) to authenticated;

drop policy if exists "members read workspace" on public.workspaces;
create policy "members read workspace" on public.workspaces for select to authenticated
using (public.member_role(id) is not null);
drop policy if exists "editors update workspace" on public.workspaces;
create policy "editors update workspace" on public.workspaces for update to authenticated
using (public.member_role(id) in ('admin','editor'))
with check (public.member_role(id) in ('admin','editor'));

drop policy if exists "members read members" on public.workspace_members;
create policy "members read members" on public.workspace_members for select to authenticated
using (public.member_role(workspace_id) is not null);
drop policy if exists "admins add members" on public.workspace_members;
create policy "admins add members" on public.workspace_members for insert to authenticated
with check (public.member_role(workspace_id) = 'admin');
drop policy if exists "admins update members" on public.workspace_members;
create policy "admins update members" on public.workspace_members for update to authenticated
using (public.member_role(workspace_id) = 'admin') with check (public.member_role(workspace_id) = 'admin');
drop policy if exists "admins remove members" on public.workspace_members;
create policy "admins remove members" on public.workspace_members for delete to authenticated
using (public.member_role(workspace_id) = 'admin');

do $$ begin
  if not exists (select 1 from pg_publication_tables where pubname='supabase_realtime' and schemaname='public' and tablename='workspaces') then
    alter publication supabase_realtime add table public.workspaces;
  end if;
end $$;
