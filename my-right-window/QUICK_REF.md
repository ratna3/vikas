# Quick Reference - My Right Window

## Project Info
- **Name:** My Right Window
- **Type:** Futuristic 3D Blog Platform
- **Status:** Phase 1 Complete ✅
- **Dev Server:** http://localhost:5173/

## Directory Structure
```
my-right-window/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Route pages
│   ├── services/       # Supabase client
│   ├── store/          # State management
│   ├── hooks/          # Custom hooks
│   └── utils/          # Utilities
├── public/             # Static assets
└── .env.local          # Environment vars
```

## Key Files
- `src/services/supabase.js` - Database client
- `src/store/index.js` - Auth & Blog stores
- `src/App.jsx` - Router configuration
- `src/index.css` - Tailwind + custom styles
- `tailwind.config.js` - Theme configuration
- `netlify.toml` - Deployment settings
- `progress.md` - Master plan
- `SETUP_COMPLETE.md` - Setup guide
- `PHASE1_SUMMARY.md` - Phase 1 summary

## Commands
```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build
```

## Color Palette
- **Primary:** `#0f172a` (dark-slate), `#1e293b` (charcoal)
- **Accents:** `#00ff41` (neon-green), `#00d9ff` (neon-cyan), `#ff6b35` (neon-orange)
- **Backgrounds:** `#000000` (deep-black), `#111827` (dark-gray)
- **Text:** `#ffffff` (white), `#e5e7eb` (light-gray)

## Tailwind Classes
- `.btn-primary` - Green button
- `.btn-secondary` - Cyan outlined button
- `.card` - Content card
- `.input-field` - Form input
- `.text-glow` - Glowing text
- `.box-glow` - Glowing shadow

## State Stores
- `useAuthStore` - Authentication
- `useBlogStore` - Blog data + real-time

## Routes
- `/` - Home
- `/blogs` - Blog list
- `/blog/:slug` - Blog detail
- `/admin/login` - Admin login
- `/admin/dashboard` - Admin dashboard
- `/admin/blog/new` - Create blog
- `/admin/blog/edit/:id` - Edit blog

## Environment Variables
```env
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-key
```

## Next: Phase 2
Create 3D environment with Three.js

## Notes
- No purple/blue colors
- No shadcn components
- Focus on performance
- Masculine design aesthetic
