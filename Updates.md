# Updates Log

## 2025-02-13 – README Problems & Solutions, Realtime Replication

**Changes:**
- Added "Problems Encountered & Solutions" section to README.md (401 auth, provider not enabled, realtime, router error)
- Added `ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks` to SETUP.md SQL for Realtime cross-tab updates

---

## 2025-02-13 – Fix 401 on Bookmarks API (Cookie-Based Auth)

**Issue:** After Google sign-in, `/api/bookmarks` returned 401 and "Failed to fetch/add bookmark" because the API routes had no access to the session. The auth callback used a basic Supabase client that did not persist the session to cookies.

**Changes:**
- Installed `@supabase/ssr` for cookie-based session handling
- Created `lib/supabase/client.ts` – browser client using `createBrowserClient` (stores session in cookies)
- Created `lib/supabase/server.ts` – server client using `createServerClient` (reads session from cookies)
- Updated `app/auth/callback/route.ts` – uses `createServerClient` to set session cookies on the redirect response
- Updated `app/api/bookmarks/route.ts` and `app/api/bookmarks/[id]/route.ts` – use server client to read session from cookies
- Updated `lib/supabase.ts` – switched to `createBrowserClient` so client components use cookies
- Added `middleware.ts` – refreshes auth session on each request
- Added `credentials: 'include'` to fetch calls for bookmarks API to ensure cookies are sent
