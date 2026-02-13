# Deployment Guide - Smart Bookmark App

## Prerequisites
- GitHub account
- Vercel account
- Supabase account (already configured)
- Google OAuth credentials (already configured)

## Step 1: Push to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: Smart Bookmark App"

# Create a repository on GitHub and push
git remote add origin https://github.com/yourusername/smart-bookmark-app.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. In the "Configure Project" step:
   - Framework Preset: Next.js
   - Root Directory: ./ (default)
5. Click "Environment Variables" and add:
   - `NEXT_PUBLIC_SUPABASE_URL` = Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your Supabase anon key
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID` = Your Google Client ID
   - `GOOGLE_CLIENT_SECRET` = Your Google Client Secret

6. Click "Deploy"

## Step 3: Update Google OAuth Redirect URL

After deployment:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth 2.0 Client ID
3. Add your Vercel URL to the authorized redirect URIs:
   - `https://your-vercel-url.vercel.app/auth/callback`

## Step 4: Update Supabase Auth Settings (Optional but Recommended)

1. Go to Supabase Project > Authentication > URL Configuration
2. Set Site URL to your Vercel URL
3. Add Redirect URL: `https://your-vercel-url.vercel.app/auth/callback`

## Troubleshooting

### Login not working
- Check that Google Client ID is correct in Vercel env vars
- Verify the redirect URL is added to Google OAuth credentials
- Clear browser cookies and try again

### Bookmarks not appearing
- Check that Supabase credentials are correct in Vercel env vars
- Verify RLS policies are enabled in Supabase
- Check database tables exist with correct schema

### Real-time updates not working
- Ensure Realtime is enabled in Supabase project settings
- Verify database subscriptions are not blocked by firewall

## Monitoring

Once deployed, you can:
- View logs: Vercel Dashboard > Project > Analytics > Logs
- Check performance: Vercel Dashboard > Analytics > Web Vitals
- Monitor errors: Vercel Dashboard > Monitoring > Functions

## Security Notes

- Never commit `.env.local` to GitHub
- Always use environment variables for secrets
- Keep Supabase RLS policies enabled
- Regularly update dependencies with `pnpm update`

## Performance Optimization

The app uses:
- Server-side rendering for initial page load
- Real-time database subscriptions for live updates
- Optimized images and minimal CSS
- Edge caching where applicable

For better performance, consider:
- Using Vercel's Image Optimization
- Adding a CDN for static assets
- Implementing caching strategies
