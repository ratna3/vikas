# 🚀 Netlify Deployment Guide

## Prerequisites
- GitHub account (to connect repository)
- Netlify account (free tier available at https://netlify.com)

## 📋 Deployment Steps

### Step 1: Push Your Code to GitHub

1. **Initialize Git (if not already done)**
   ```powershell
   cd e:\vikas\my-right-window
   git init
   git add .
   git commit -m "Initial commit - Ready for Netlify deployment"
   ```

2. **Create a New GitHub Repository**
   - Go to https://github.com/new
   - Repository name: `my-right-window`
   - Make it Public or Private (your choice)
   - DO NOT initialize with README (you already have one)
   - Click **Create repository**

3. **Push to GitHub**
   ```powershell
   git remote add origin https://github.com/YOUR-USERNAME/my-right-window.git
   git branch -M main
   git push -u origin main
   ```
   Replace `YOUR-USERNAME` with your GitHub username

### Step 2: Deploy to Netlify

#### Option A: Using Netlify Dashboard (Recommended)

1. **Go to Netlify Dashboard**
   - Visit https://app.netlify.com
   - Sign up or log in

2. **Import Project**
   - Click **"Add new site"** → **"Import an existing project"**
   - Choose **"Deploy with GitHub"**
   - Authorize Netlify to access your GitHub repositories
   - Select the `my-right-window` repository

3. **Configure Build Settings**
   - **Branch to deploy**: `main`
   - **Build command**: `npm run build` (should be auto-detected)
   - **Publish directory**: `dist` (should be auto-detected)
   - **Node version**: 18 (already configured in netlify.toml)

4. **Add Environment Variables**
   Click **"Add environment variables"** and add these two:
   
   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | `https://tvwfrxndpxxdrtlaemak.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2d2ZyeG5kcHh4ZHJ0bGFlbWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTgzOTYsImV4cCI6MjA3OTQ3NDM5Nn0.jcgaWLlLOskJXc9qM8sm5L2IeeytbrwxPlFuKmAZ0ts` |

5. **Deploy**
   - Click **"Deploy site"**
   - Wait 2-3 minutes for the build to complete
   - Your site will be live at a Netlify URL like: `https://random-name-12345.netlify.app`

6. **Custom Domain (Optional)**
   - Go to **"Domain settings"**
   - Click **"Add custom domain"**
   - Follow instructions to connect your domain

#### Option B: Using Netlify CLI

1. **Install Netlify CLI**
   ```powershell
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```powershell
   netlify login
   ```

3. **Initialize Netlify**
   ```powershell
   cd e:\vikas\my-right-window
   netlify init
   ```

4. **Set Environment Variables**
   ```powershell
   netlify env:set VITE_SUPABASE_URL "https://tvwfrxndpxxdrtlaemak.supabase.co"
   netlify env:set VITE_SUPABASE_ANON_KEY "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2d2ZyeG5kcHh4ZHJ0bGFlbWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTgzOTYsImV4cCI6MjA3OTQ3NDM5Nn0.jcgaWLlLOskJXc9qM8sm5L2IeeytbrwxPlFuKmAZ0ts"
   ```

5. **Deploy**
   ```powershell
   netlify deploy --prod
   ```

## ✅ What's Already Configured

Your `netlify.toml` file already includes:

✅ **Build Configuration**
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 18

✅ **SPA Routing Support**
- Redirects all routes to `index.html` for React Router to work

✅ **Security Headers**
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

## 🔄 Continuous Deployment

After initial setup, Netlify will automatically:
- Deploy every push to the `main` branch
- Show build logs and deployment status
- Provide preview URLs for pull requests

## 🎯 Post-Deployment Checklist

After deployment, verify:

1. ✅ **Site loads correctly** - Visit your Netlify URL
2. ✅ **Blog posts visible** - Check `/blogs` page
3. ✅ **Admin login works** - Test `/admin/login`
4. ✅ **Supabase connected** - Verify data loads from database
5. ✅ **All routes work** - Test navigation between pages
6. ✅ **No console errors** - Open browser DevTools

## 🛠️ Troubleshooting

### Build Fails
- Check build logs in Netlify dashboard
- Verify all dependencies are in `package.json`
- Ensure environment variables are set correctly

### Supabase Not Connecting
- Verify environment variables are set in Netlify
- Check that URLs don't have extra spaces or quotes
- Test Supabase connection in local build first

### 404 Errors on Routes
- Already fixed with the redirect rule in `netlify.toml`
- If still occurring, check browser console for errors

### Admin Login Not Working
- Complete the Supabase setup steps from the previous guide
- Create `user_profiles` table
- Create admin user in Supabase Auth

## 📊 Monitoring

Access your Netlify dashboard to monitor:
- **Deploys**: View build history and logs
- **Functions**: (if you add Netlify Functions later)
- **Analytics**: Site traffic (upgrade required)
- **Forms**: (if you add Netlify Forms later)

## 🔒 Security Notes

- ✅ Supabase ANON key is safe to expose in frontend
- ✅ Row Level Security (RLS) protects your database
- ✅ Admin credentials should remain private
- ⚠️ Never commit `.env.local` to Git (already in `.gitignore`)

## 🎉 Your Live URLs

After deployment, you'll have:
- **Production URL**: `https://your-site-name.netlify.app`
- **Admin Panel**: `https://your-site-name.netlify.app/admin/login`
- **Blog Posts**: `https://your-site-name.netlify.app/blogs`

---

## Quick Deploy Commands

```powershell
# Build locally to test
npm run build

# Preview build locally
npm run preview

# Deploy to Netlify (if using CLI)
netlify deploy --prod
```

---

**Need Help?**
- Netlify Docs: https://docs.netlify.com
- Netlify Support: https://answers.netlify.com
- Supabase Docs: https://supabase.com/docs
