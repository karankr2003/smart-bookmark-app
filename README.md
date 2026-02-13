# Smart Bookmark App

A modern, secure, and real-time bookmark manager built with Next.js, Supabase, and Tailwind CSS.

## Features

- **Google OAuth Authentication**: Sign in securely with your Google account
- **Private Bookmarks**: Your bookmarks are completely private and only visible to you
- **Real-time Updates**: See new bookmarks appear instantly across all your devices without page refresh
- **Easy to Use**: Simple and intuitive interface to add, view, and delete bookmarks
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Fully Deployed**: Ready to deploy on Vercel with a live URL

## Tech Stack

- **Frontend**: Next.js 16 (App Router) + React 19
- **Styling**: Tailwind CSS + Shadcn UI Components
- **Authentication**: Supabase Auth (Google OAuth)
- **Database**: Supabase PostgreSQL
- **Real-time**: Supabase Real-time Subscriptions
- **Deployment**: Vercel

## Quick Start

### Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Supabase account
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-bookmark-app
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Setup environment variables**
   - Copy `.env.local.example` to `.env.local`
   - Follow the instructions in `SETUP.md` to configure Supabase and Google OAuth

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
smart-bookmark-app/
├── app/
│   ├── api/
│   │   └── bookmarks/          # API routes for bookmark operations
│   ├── auth/
│   │   └── callback/           # OAuth callback handler
│   ├── layout.tsx              # Root layout with AuthProvider
│   ├── page.tsx                # Main dashboard page
│   ├── globals.css             # Global styles
│   └── providers.tsx           # Auth context provider
├── components/
│   ├── add-bookmark-form.tsx   # Form to add new bookmarks
│   ├── bookmark-card.tsx       # Individual bookmark display
│   ├── bookmarks-list.tsx      # List of bookmarks with real-time updates
│   ├── login-button.tsx        # Google OAuth login button
│   └── user-menu.tsx           # User profile and logout menu
├── lib/
│   ├── supabase.ts             # Supabase client initialization
│   └── utils.ts                # Utility functions
├── SETUP.md                    # Local development setup guide
├── DEPLOYMENT.md               # Deployment instructions
└── README.md                   # This file
```

## How It Works

### Authentication Flow
1. User clicks "Sign in with Google"
2. Google OAuth redirects to Supabase
3. Supabase exchanges the code for a session
4. User is redirected back to the app and authenticated

### Bookmark Management
1. **Add**: User fills in title and URL, clicks "Add Bookmark"
2. **API**: POST request to `/api/bookmarks` creates a new entry in the database
3. **Real-time**: Supabase broadcasts the change to all connected clients
4. **Display**: BookmarksList component automatically updates without page refresh
5. **Delete**: User clicks delete, bookmark is removed from database and UI

### Security
- **Row Level Security (RLS)**: Database policies ensure users can only access their own bookmarks
- **Authentication**: Supabase handles secure session management
- **OAuth**: Google OAuth prevents password management complexity
- **HTTPS**: All communications are encrypted in production

## Usage

### Adding a Bookmark
1. Enter the page title (e.g., "My Favorite Blog")
2. Enter the full URL (e.g., "https://example.com")
3. Click "Add Bookmark"
4. The bookmark appears instantly in your list

### Viewing Bookmarks
- All bookmarks are displayed with their title and domain
- Click the external link icon to open the bookmark in a new tab
- Bookmarks are sorted by most recent first

### Deleting a Bookmark
1. Click the trash icon on any bookmark
2. Confirm the deletion
3. The bookmark is removed instantly

### Logging Out
- Click your email in the top-right corner
- Click "Logout"
- You'll be redirected to the login page

## API Endpoints

### GET /api/bookmarks
Retrieves all bookmarks for the authenticated user.
- **Auth**: Required
- **Returns**: Array of bookmarks sorted by creation date (newest first)

### POST /api/bookmarks
Creates a new bookmark.
- **Auth**: Required
- **Body**: `{ "url": "string", "title": "string" }`
- **Returns**: Created bookmark object

### DELETE /api/bookmarks/[id]
Deletes a bookmark by ID.
- **Auth**: Required
- **Params**: `id` - Bookmark UUID
- **Returns**: `{ "success": true }`

## Development

### Running Tests
```bash
pnpm test
```

### Building for Production
```bash
pnpm build
pnpm start
```

### Linting
```bash
pnpm lint
```

## Deployment

For detailed deployment instructions, see `DEPLOYMENT.md`.

Quick deployment:
1. Push to GitHub
2. Import repository on Vercel
3. Add environment variables
4. Deploy!

## Contributing

Feel free to fork this project and submit pull requests with improvements.

## License

MIT License - feel free to use this project for your own purposes.

## Problems Encountered & Solutions

### 1. 401 Unauthorized on Bookmarks API After Google Sign-in
**Problem:** After successfully logging in with Google, the app showed "Failed to fetch bookmarks" and "Failed to add bookmark". The API routes returned 401.

**Cause:** The auth callback used the standard `createClient` from `@supabase/supabase-js`, which stores the session in localStorage. API routes run on the server and have no access to localStorage, so they could not read the session.

**Solution:** Switched to `@supabase/ssr` for cookie-based sessions:
- Auth callback now uses `createServerClient` and sets session cookies on the redirect response
- API routes use `createServerClient` to read the session from request cookies
- Added middleware to refresh the session on each request
- Browser client uses `createBrowserClient` (stores session in cookies)
- Added `credentials: 'include'` to fetch calls so cookies are sent with API requests

### 2. "Unsupported provider: provider is not enabled"
**Problem:** Clicking "Sign in with Google" returned a 400 error: `validation_failed - Unsupported provider`.

**Cause:** Google OAuth was configured in Google Cloud Console, but the Google provider was not enabled in Supabase.

**Solution:** Enable the provider in **Supabase Dashboard → Authentication → Providers → Google**. Turn it on and paste your Google Client ID and Client Secret. The OAuth Apps section is different—you need the **Providers** section.

### 3. Real-time Updates Not Working Across Tabs
**Problem:** Adding a bookmark in one tab did not appear in another open tab.

**Cause:** The `bookmarks` table was not added to Supabase's Realtime publication. Realtime subscriptions require the table to be included in the publication.

**Solution:** Run the SQL in SETUP.md Step 2 to add the table to the Realtime publication, or enable replication for the `bookmarks` table in **Supabase Dashboard → Database → Replication**.

### 4. Next.js "Router action dispatched before initialization"
**Problem:** Occasional runtime error during development.

**Cause:** Race condition with Hot Module Replacement (HMR) when the dev server restarts.

**Solution:** Stop the dev server, delete the `.next` folder, run `pnpm dev` again. A hard refresh (Ctrl+Shift+R) can also help.

---

## Support

For issues or questions:
1. Check the `SETUP.md` and `DEPLOYMENT.md` files
2. Review Supabase and Next.js documentation
3. Open an issue in the repository

## Future Enhancements

Possible features for future versions:
- Categories/Tags for bookmarks
- Search functionality
- Export bookmarks
- Bookmark sharing
- Dark mode
- Mobile app
- Browser extensions

---

Built with ❤️ using Next.js, Supabase, and Tailwind CSS
