window.NestCloud = {
  client: null,
  workspaceId: null,
  configured() {
    const c = window.NESTLEDGER_CONFIG || {};
    return Boolean(c.supabaseUrl && c.supabaseAnonKey);
  },
  async connect() {
    if (!this.configured()) return null;
    const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm');
    const c = window.NESTLEDGER_CONFIG;
    this.client = createClient(c.supabaseUrl, c.supabaseAnonKey);
    const { data, error } = await this.client.auth.getSession();
    if (error) throw error;
    return data.session;
  },
  async signIn(email, password) {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data.session;
  },
  async signUp(email, password) {
    const { data, error } = await this.client.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },
  async signOut() { await this.client.auth.signOut(); location.reload(); },
  async getMembership() {
    const { data, error } = await this.client.from('workspace_members').select('workspace_id,role,email,workspaces(name)').limit(1).maybeSingle();
    if (error) throw error;
    return data;
  },
  async createWorkspace(name) {
    const { data, error } = await this.client.rpc('bootstrap_workspace', { workspace_name: name });
    if (error) throw error;
    return data;
  },
  async loadWorkspace(id) {
    this.workspaceId = id;
    const { data, error } = await this.client.from('workspaces').select('data,name').eq('id', id).single();
    if (error) throw error;
    return data;
  },
  async saveWorkspace(data) {
    if (!this.workspaceId) return;
    const { error } = await this.client.from('workspaces').update({ data, updated_at: new Date().toISOString() }).eq('id', this.workspaceId);
    if (error) throw error;
  },
  async listMembers() {
    const { data, error } = await this.client.from('workspace_members').select('email,role,created_at').eq('workspace_id', this.workspaceId).order('created_at');
    if (error) throw error;
    return data;
  },
  async addMember(email, role) {
    const { error } = await this.client.from('workspace_members').upsert({ workspace_id: this.workspaceId, email: email.toLowerCase().trim(), role }, { onConflict: 'workspace_id,email' });
    if (error) throw error;
  },
  async removeMember(email) {
    const { error } = await this.client.from('workspace_members').delete().eq('workspace_id', this.workspaceId).eq('email', email);
    if (error) throw error;
  },
  subscribe(onChange) {
    return this.client.channel('workspace-' + this.workspaceId)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'workspaces', filter: `id=eq.${this.workspaceId}` }, p => onChange(p.new.data))
      .subscribe();
  }
};
