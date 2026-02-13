# Smart Bookmark App - Setup Guide

## Prerequisites
- Node.js 18+ installed
- pnpm package manager
- Supabase account (free tier works)
- Google OAuth credentials

## Step 1: Install Dependencies
```bash
pnpm install
```

## Step 2: Setup Supabase

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In your project, go to SQL Editor and run the following SQL to create the tables:

```sql
-- Create users table (Supabase Auth will handle this)
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  url VARCHAR(2048) NOT NULL,
  title VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable Row Level Security (RLS)
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only see their own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only insert their own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);

-- Enable Realtime for cross-tab updates (bookmark added in one tab appears in others)
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

**Already created the table?** Run this in SQL Editor to enable Realtime:
```sql
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

3. Go to Authentication > Providers and enable Google OAuth
4. Add your Google OAuth credentials (see Step 4 below)
5. Copy your Supabase URL and anon key from Settings > API

## Step 3: Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable the Google+ API
4. Go to Credentials > Create OAuth 2.0 Client ID
5. Set Application type to "Web application"
6. Add authorized redirect URIs:
   - http://localhost:3000/auth/callback
   - https://yourdomain.vercel.app/auth/callback (for production)
7. Copy the Client ID and Client Secret

## Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`
2. Fill in the values:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`: Your Google Client ID
   - `GOOGLE_CLIENT_SECRET`: Your Google Client Secret

## Step 5: Run the Application

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Deployment to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add the environment variables in Project Settings > Environment Variables
4. Deploy!

## Features

- ✅ Google OAuth authentication
- ✅ Add, view, and delete bookmarks
- ✅ Private bookmarks (only visible to the user)
- ✅ Real-time updates (no page refresh needed)
- ✅ Responsive design
