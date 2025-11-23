# My Right Window - Blog Website Development Master Plan

## Project Overview
**Company Name:** My Right Window  
**Project Type:** Futuristic 3D Blog Website with Admin Panel  
**Deployment Platform:** Netlify  
**Last Updated:** November 23, 2025

---

## Technology Stack

### Frontend
- **Framework:** React 18+ with Vite
- **3D Libraries:** 
  - Three.js (primary 3D engine)
  - React Three Fiber (React renderer for Three.js)
  - React Three Drei (helpers for R3F)
- **Styling:** Tailwind CSS (custom configuration, no shadcn)
- **State Management:** Zustand
- **Routing:** React Router v6
- **Forms:** React Hook Form + Zod validation
- **Real-time Updates:** Supabase Realtime (WebSocket subscriptions)
- **Authentication:** Supabase Auth

### Backend/Services
- **Database:** Supabase (PostgreSQL with real-time subscriptions)
- **Storage:** Supabase Storage (for images and PDFs)
- **Authentication:** Supabase Auth
- **Real-time Sync:** Supabase Realtime (WebSocket-based)
- **Hosting:** Netlify (frontend) + Supabase (backend services)
- **API:** Auto-generated RESTful API from Supabase

### Accessibility & UX
- **Accessibility:** ARIA labels, keyboard navigation, screen reader support
- **SEO:** React Helmet Async
- **Performance:** React.lazy, Suspense, code splitting

---

## Color Scheme (Masculine/Professional)
- **Primary:** Dark slate (#0f172a), Charcoal (#1e293b)
- **Accent:** Neon green (#00ff41), Cyan (#00d9ff), Orange (#ff6b35)
- **Background:** Deep black (#000000), Dark gray (#111827)
- **Text:** White (#ffffff), Light gray (#e5e7eb)

---

## Project Structure

```
my-right-window/
├── public/
│   ├── models/          # 3D models
│   └── assets/          # Static assets
├── src/
│   ├── components/
│   │   ├── 3d/         # Three.js components
│   │   ├── admin/      # Admin panel components
│   │   ├── blog/       # Blog display components
│   │   ├── common/     # Reusable components
│   │   └── layout/     # Layout components
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── BlogList.jsx
│   │   ├── BlogDetail.jsx
│   │   ├── Admin/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── BlogEditor.jsx
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── services/       # Firebase services
│   ├── store/          # Zustand store
│   ├── styles/         # Global styles
│   └── App.jsx
├── .env.local
├── netlify.toml
├── vite.config.js
└── package.json
```

---

## Development Phases

### Phase 1: Project Setup & Configuration ✅
**Duration:** Day 1
- [x] Create progress.md
- [x] Initialize Vite + React project
- [x] Install dependencies (Three.js, React Three Fiber, Tailwind, Supabase)
- [x] Configure Tailwind with custom color scheme
- [x] Set up Supabase project and configuration
- [x] Configure environment variables
- [x] Set up project folder structure

### Phase 2: 3D Environment & Landing Page ✅
**Duration:** Days 2-3
**Status:** ✅ Complete (Dec 2024)
- [x] Create 3D canvas component with Three.js
- [x] Implement futuristic 3D background scene
  - [x] Particle system (1000 animated particles)
  - [x] Geometric shapes animation (Torus, Octahedron, Icosahedron)
  - [x] Interactive lighting effects (dynamic point lights)
- [x] Build landing page hero section
- [x] Add smooth scroll animations (parallax & fade effects)
- [x] Implement responsive 3D scene
- [x] Create responsive navigation component
- [x] Add featured section with card grid
- [x] Implement about and CTA sections

**Files Created:**
- src/components/3d/Scene.jsx
- src/components/3d/ParticleField.jsx
- src/components/3d/AnimatedShapes.jsx
- src/components/3d/Lighting.jsx
- src/components/layout/Navbar.jsx

**Files Modified:**
- src/pages/Home.jsx (complete landing page)
- src/App.jsx (added Navbar)
- src/services/supabase.js (fixed env vars)

### Phase 3: Blog Display System 📰
**Duration:** Days 4-5
**Status:** Ready to Start
- [ ] Design blog card components
- [ ] Create blog list page with pagination
- [ ] Build blog detail page
- [ ] Implement Supabase PostgreSQL integration
- [ ] Add real-time blog updates listener (Supabase Realtime)
- [ ] Create PDF viewer component
- [ ] Implement image gallery

### Phase 4: Admin Panel Development 🔐
**Duration:** Days 6-8
- [ ] Create admin authentication system
  - [ ] Login page with Supabase Auth
  - [ ] Protected routes
  - [ ] Session management
- [ ] Build admin dashboard
- [ ] Create blog editor with rich text
  - [ ] Text editor (TipTap or Quill)
  - [ ] Image upload component
  - [ ] PDF upload component
  - [ ] Metadata fields (title, author, date, tags)
- [ ] Implement CRUD operations
  - [ ] Create blog post
  - [ ] Edit blog post
  - [ ] Delete blog post
  - [ ] Preview before publish
- [ ] Add real-time sync for immediate updates

### Phase 5: UX & Accessibility Implementation ♿
**Duration:** Days 9-10
- [ ] Implement keyboard navigation
- [ ] Add ARIA labels and roles
- [ ] Test with screen readers
- [ ] Create skip navigation links
- [ ] Implement focus management
- [ ] Add loading states and skeletons
- [ ] Error handling and user feedback
- [ ] Mobile responsive design

### Phase 6: Performance Optimization ⚡
**Duration:** Day 11
- [ ] Implement code splitting
- [ ] Optimize 3D scene rendering
- [ ] Image optimization (lazy loading)
- [ ] Bundle size optimization
- [ ] Add service worker for caching
- [ ] Lighthouse audit and fixes

### Phase 7: Testing & QA 🧪
**Duration:** Days 12-13
- [ ] Cross-browser testing
- [ ] Mobile device testing
- [ ] Accessibility testing
- [ ] Performance testing
- [ ] Security testing
- [ ] User acceptance testing

### Phase 8: Deployment 🚀
**Duration:** Day 14
- [ ] Configure netlify.toml
- [ ] Set up build commands
- [ ] Configure environment variables on Netlify
- [ ] Deploy to Netlify
- [ ] Configure custom domain (if applicable)
- [ ] Set up Firebase security rules
- [ ] Enable Firebase hosting for assets
- [ ] Test production build
- [ ] Monitor and fix any deployment issues

---

## Key Features Implementation Plan

### 1. 3D Futuristic Design
- **Three.js Scene Components:**
  - Animated geometric background
  - Particle effects on scroll
  - Interactive 3D navigation menu
  - Floating content cards
  - Holographic effect overlays
  
### 2. Blog Management System
- **Public Features:**
  - Blog listing with search/filter
  - Category/tag filtering
  - Blog detail view with images
  - PDF document viewer
  - Social sharing
  
- **Admin Features:**
  - Secure login (Firebase Auth)
  - Rich text editor
  - Multi-image upload
  - PDF upload
  - Real-time preview
  - Publish/Draft status
  - Edit/Delete capabilities

### 3. Real-time Updates
- Supabase Realtime WebSocket subscriptions
- Automatic content refresh when new blogs published
- No page reload required
- Optimistic UI updates
- Row-level security (RLS) policies

### 4. Accessibility Features
- WCAG 2.1 AA compliance
- Keyboard shortcuts
- Screen reader announcements
- High contrast mode support
- Focus indicators
- Alt text for all images

---

## Supabase Configuration Required

### Database Tables Schema

#### blogs table
```sql
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  images JSONB DEFAULT '[]',
  pdf_url TEXT,
  pdf_name TEXT,
  slug TEXT UNIQUE NOT NULL
);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Public read access for published blogs
CREATE POLICY "Public blogs are viewable by everyone"
  ON blogs FOR SELECT
  USING (published = true);

-- Admin full access
CREATE POLICY "Admins can do everything"
  ON blogs FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE blogs;
```

#### users table (extends Supabase auth.users)
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  email TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Only admins can update roles
CREATE POLICY "Admins can update profiles"
  ON user_profiles FOR UPDATE
  USING (auth.jwt() ->> 'role' = 'admin');
```

### Storage Buckets

#### images bucket
```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Storage policies
CREATE POLICY "Public images are accessible by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'images');

CREATE POLICY "Admins can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'images' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'images' AND auth.jwt() ->> 'role' = 'admin');
```

#### pdfs bucket
```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', true);

-- Storage policies
CREATE POLICY "Public PDFs are accessible by everyone"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pdfs');

CREATE POLICY "Admins can upload PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pdfs' AND auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can delete PDFs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'pdfs' AND auth.jwt() ->> 'role' = 'admin');
```

---

## Netlify Configuration

### netlify.toml
```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
```

---

## Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## Design Principles
1. **Futuristic Aesthetic:** Dark themes, neon accents, geometric shapes
2. **Performance First:** Optimize 3D rendering, lazy loading
3. **User-Centric:** Intuitive navigation, clear information hierarchy
4. **Accessible:** Keyboard navigation, screen reader support
5. **Responsive:** Mobile-first approach
6. **Secure:** Protected admin routes, input validation

---

## Success Metrics
- [ ] Page load time < 3 seconds
- [ ] Lighthouse score > 90
- [ ] WCAG 2.1 AA compliance
- [ ] Mobile responsive on all devices
- [ ] 3D effects run at 60fps
- [ ] Real-time updates with < 1s latency
- [ ] Zero accessibility violations

---

## Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| 3D performance on low-end devices | High | Implement LOD, fallback to 2D |
| Supabase free tier limits | Low | Optimize queries, implement caching |
| Browser compatibility | Medium | Polyfills, progressive enhancement |
| Security vulnerabilities | High | Row-level security, input sanitization |

---

## Next Steps

1. Initialize project with Vite + React
2. Install all required dependencies (Three.js, Supabase, Tailwind)
3. Set up Supabase project (database + auth + storage)
4. Configure Tailwind CSS with custom masculine color scheme
5. Create basic project structure
6. Start Phase 1 implementation

---

## Notes

- Focus on masculine color palette (blacks, grays, neon greens, cyans, oranges)
- NO purple or blue tones
- NO shadcn components
- Prioritize performance alongside visual appeal
- Ensure admin panel is secure and user-friendly
- Real-time updates are critical for content freshness
- Supabase provides open-source alternative with PostgreSQL power
- Row-level security ensures data protection

---

**Project Status:** Phase 1 Complete ✅  
**Current Phase:** Ready to Begin Phase 2 - 3D Environment & Landing Page  
**Last Updated:** November 23, 2025

## Phase 1 Completion Summary

✅ **All tasks completed successfully:**
- Vite + React 18 project initialized
- All dependencies installed (Three.js, React Three Fiber, Supabase, Tailwind, etc.)
- Tailwind CSS configured with custom masculine color scheme
- Supabase client configured and ready
- Environment variables template created
- Complete project folder structure established
- State management with Zustand (Auth & Blog stores)
- React Router configured with lazy loading
- Placeholder pages created for all routes
- Development server running successfully at http://localhost:5173/

**See `SETUP_COMPLETE.md` for detailed setup documentation.**

**Next Action:** Set up Supabase project and begin Phase 2 (3D Environment)
