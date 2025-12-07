# Like, Comment & Share Feature Setup Guide

This guide explains how to complete the setup for the engagement features (likes, comments, shares) with Google OAuth.

## Current Status

The frontend components for likes, comments, and shares have been implemented. However, **Supabase's API (PostgREST) needs to reload its schema cache** to recognize the new database tables and functions.

## Step 1: Reload Supabase Schema Cache

### Option A: Restart PostgREST (Recommended)

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `tvwfrxndpxxdrtlaemak`
3. Go to **Settings** → **Project Settings**
4. Scroll down to **Restart project** section
5. Click **Restart project**
6. Wait 1-2 minutes for the project to restart

### Option B: Wait for Automatic Refresh

Supabase PostgREST automatically refreshes its schema cache periodically (every ~5 minutes). You can wait for this to happen automatically.

## Step 2: Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Go to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth 2.0 Client IDs**
5. Configure the OAuth consent screen if prompted
6. Select **Web application** as the application type
7. Add these authorized URLs:
   - **Authorized JavaScript origins**: 
     - `http://localhost:5173` (development)
     - `https://your-domain.com` (production)
   - **Authorized redirect URIs**:
     - `https://tvwfrxndpxxdrtlaemak.supabase.co/auth/v1/callback`

8. Copy the **Client ID** and **Client Secret**

9. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
10. Navigate to **Authentication** → **Providers**
11. Find **Google** and click to enable
12. Paste your Google **Client ID** and **Client Secret**
13. Click **Save**

## Step 3: Configure Site URL (Production)

1. In Supabase Dashboard, go to **Authentication** → **URL Configuration**
2. Update **Site URL** to your production URL (e.g., `https://your-vercel-domain.vercel.app`)
3. Add redirect URLs:
   - `https://your-vercel-domain.vercel.app/blogs`
   - `http://localhost:5173/blogs` (for local development)

## Database Tables Created

The following tables have been created in your Supabase database:

### `likes` Table
- `id` (UUID, Primary Key)
- `blog_id` (UUID, Foreign Key → blogs)
- `user_id` (UUID, Foreign Key → auth.users)
- `created_at` (Timestamp)
- Unique constraint on (blog_id, user_id)

### `comments` Table
- `id` (UUID, Primary Key)
- `blog_id` (UUID, Foreign Key → blogs)
- `user_id` (UUID, Foreign Key → auth.users)
- `content` (Text)
- `parent_id` (UUID, Self-referential for replies)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

### Row Level Security (RLS) Policies
- **Likes**: Anyone can read, authenticated users can create/delete their own
- **Comments**: Anyone can read, authenticated users can create/update/delete their own

### Real-time Enabled
Both `likes` and `comments` tables have real-time subscriptions enabled.

## Testing the Features

1. Start the development server: `npm run dev`
2. Navigate to a blog post
3. Click **Sign in** to authenticate with Google
4. Try liking the post (heart icon should toggle)
5. Try adding a comment
6. Open the same page in another browser tab to see real-time updates

## Troubleshooting

### 404 Errors in Console
This indicates PostgREST hasn't reloaded its schema cache. Follow Step 1 above.

### Google Sign-in Not Working
- Check Google OAuth credentials are correctly configured
- Verify redirect URLs match exactly
- Check browser console for specific error messages

### Comments Not Appearing
- Ensure you're signed in
- Check browser console for errors
- Verify RLS policies are correctly set up

## Features Implemented

### Like Button
- Shows like count
- Heart icon animation when liked
- Real-time updates across all users
- Requires authentication to like

### Comments Section
- View all comments with user avatars
- Add new comments
- Edit/delete your own comments
- Real-time updates

### Share Buttons
- Share to Twitter
- Share to LinkedIn
- Share to Facebook
- Copy link to clipboard

### User Authentication Button
- Google OAuth sign-in
- User profile dropdown
- Sign out functionality
