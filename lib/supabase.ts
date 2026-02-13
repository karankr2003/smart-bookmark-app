import { createBrowserClient } from '@supabase/ssr'

export type Bookmark = {
  id: string
  user_id: string
  url: string
  title: string
  created_at: string
  updated_at: string
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

// Browser client - uses cookies for session so API routes can read it
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null
if (supabaseUrl && supabaseKey) {
  supabaseClient = createBrowserClient(supabaseUrl, supabaseKey)
}

export const supabase = supabaseClient

// Check if we're using demo mode (no real Supabase configured)
export const isDemoMode = !supabaseClient
