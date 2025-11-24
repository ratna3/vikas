# 🚀 QUICK DEPLOY REFERENCE

## Your Supabase Credentials (For Netlify)
```
VITE_SUPABASE_URL=https://tvwfrxndpxxdrtlaemak.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2d2ZyeG5kcHh4ZHJ0bGFlbWFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTgzOTYsImV4cCI6MjA3OTQ3NDM5Nn0.jcgaWLlLOskJXc9qM8sm5L2IeeytbrwxPlFuKmAZ0ts
```

## Your Admin Credentials
```
Email: admin@myrightwindow.com
Password: Admin@123!MRW
```

## 3-Step Netlify Deploy

### 1️⃣ Push to GitHub
```powershell
cd e:\vikas\my-right-window
git init
git add .
git commit -m "Ready for deployment"
git remote add origin https://github.com/YOUR-USERNAME/my-right-window.git
git branch -M main
git push -u origin main
```

### 2️⃣ Deploy on Netlify
1. Go to: https://app.netlify.com
2. Click **"Add new site"** → **"Import an existing project"**
3. Choose **GitHub** → Select `my-right-window`
4. Add environment variables (see credentials above)
5. Click **"Deploy site"**

### 3️⃣ Setup Supabase (Critical!)
1. Open Supabase Dashboard: https://supabase.com/dashboard/project/tvwfrxndpxxdrtlaemak
2. SQL Editor → Run `supabase/migrations/002_create_user_profiles.sql`
3. Authentication → Users → Add User (use admin credentials above)
4. SQL Editor → Link admin user to profiles table

## ✅ Deployment Checklist
- [ ] Build passes locally (`npm run build`)
- [ ] Code pushed to GitHub
- [ ] Netlify site created and connected
- [ ] Environment variables added in Netlify
- [ ] Supabase tables created
- [ ] Admin user created in Supabase Auth
- [ ] Site loads without errors
- [ ] Blog posts visible
- [ ] Admin login works

## 🔗 Important Links
- **Netlify Dashboard**: https://app.netlify.com
- **Supabase Dashboard**: https://supabase.com/dashboard/project/tvwfrxndpxxdrtlaemak
- **GitHub**: https://github.com
- **Full Guide**: See `NETLIFY_DEPLOYMENT.md`

## 🆘 Troubleshooting
- **Build fails**: Check `package.json` and all imports
- **Blank page**: Check browser console for errors
- **Supabase not working**: Verify env vars in Netlify
- **Admin login fails**: Complete Supabase setup step 3
- **Routes 404**: Already fixed in `netlify.toml`

## 📞 Support
- Netlify: https://docs.netlify.com
- Supabase: https://supabase.com/docs
