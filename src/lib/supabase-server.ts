import { createClient } from '@supabase/supabase-js'

// Server-only Supabase client — no auth, used for public data fetching in Server Components
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { auth: { persistSession: false } }
)
