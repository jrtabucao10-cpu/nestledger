# Connect NestLedger for shared editing

1. Create a Supabase project at supabase.com.
2. Open **SQL Editor**, paste the contents of `supabase-schema.sql`, and run it once.
3. Open **Project Settings → API** and copy the Project URL and anon/public key.
4. Paste those two values into `config.js`.
5. Upload this `rental-manager` folder to a static host such as Netlify or Vercel.
6. Open the hosted site, create your account, and create the first workspace. You become Admin automatically.
7. In **Users & access**, add another person's email as Editor or View-only. They can then create/sign in with that same email.

Never put a Supabase service-role key in `config.js`. Only use the anon/public key.
