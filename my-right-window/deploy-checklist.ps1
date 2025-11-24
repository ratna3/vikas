# Quick Netlify Deploy Script
# Run this after pushing to GitHub

Write-Host "🚀 Netlify Deployment Checklist" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if Git is initialized
if (-Not (Test-Path ".git")) {
    Write-Host "❌ Git not initialized. Run:" -ForegroundColor Red
    Write-Host "   git init" -ForegroundColor Yellow
    Write-Host "   git add ." -ForegroundColor Yellow
    Write-Host "   git commit -m 'Initial commit'" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git repository found" -ForegroundColor Green

# Check if .env.local exists and warn
if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local found (good - it should NOT be committed)" -ForegroundColor Yellow
}

# Check build
Write-Host ""
Write-Host "📦 Testing build..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Build successful!" -ForegroundColor Green
} else {
    Write-Host "❌ Build failed! Fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Push to GitHub:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR-USERNAME/my-right-window.git" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Deploy on Netlify:" -ForegroundColor White
Write-Host "   • Go to: https://app.netlify.com" -ForegroundColor Yellow
Write-Host "   • Click 'Add new site' → 'Import an existing project'" -ForegroundColor Yellow
Write-Host "   • Connect GitHub and select 'my-right-window'" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Add Environment Variables in Netlify:" -ForegroundColor White
Write-Host "   VITE_SUPABASE_URL = https://tvwfrxndpxxdrtlaemak.supabase.co" -ForegroundColor Yellow
Write-Host "   VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Complete Supabase Setup:" -ForegroundColor White
Write-Host "   • Create user_profiles table (see supabase/migrations/002_create_user_profiles.sql)" -ForegroundColor Yellow
Write-Host "   • Create admin user in Supabase Auth" -ForegroundColor Yellow
Write-Host "   • Email: admin@myrightwindow.com" -ForegroundColor Yellow
Write-Host "   • Password: Admin@123!MRW" -ForegroundColor Yellow
Write-Host ""
Write-Host "Full guide: NETLIFY_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
