/**
 * Browser Supabase client for use in Client Components.
 * Uses cookies for session storage so the session is available to API routes.
 * @see https://supabase.com/docs/guides/auth/server-side/nextjs
 */
import { createBrowserClient } from '@supabase/ssr'

/**
 * Creates a Supabase client for the browser.
 * Returns null if env vars are missing (demo mode).
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  if (!url || !key) return null
  return createBrowserClient(url, key)
}
