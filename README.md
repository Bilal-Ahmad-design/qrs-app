# QRS - Quantitative Risk Systems

Enterprise-grade quantitative risk analysis platform with cryptographically verified catastrophe modeling. Next.js 16 frontend with integrated Payload CMS and PostgreSQL backend.

**Live:** https://qrs-app-eight.vercel.app/

## Project Structure

```
qrs-app/
├── frontend/                # Next.js 16 application (port 3000)
│   ├── app/                 # Next.js app directory (routes & pages)
│   ├── components/          # React components
│   │   ├── marketing/       # Marketing section components
│   │   ├── admin/           # Admin dashboard components
│   │   └── layout/          # Layout & header/footer
│   ├── lib/                 # Utilities & helpers
│   │   ├── cms-fetch.ts     # CMS data fetching
│   │   └── default-sections.ts  # Fallback page sections
│   ├── cms/                 # Payload CMS integration
│   │   ├── payload.config.ts    # CMS configuration
│   │   ├── server.ts            # CMS server (port 3001)
│   │   └── mock-server.ts       # Mock data fallback
│   ├── public/              # Static assets
│   │   └── media/           # Product images & videos
│   └── package.json         # Dependencies
├── DOCS/                    # Documentation
├── .github/                 # CI/CD configuration
└── README.md                # This file
```

## Features

✅ **Frontend**
- Next.js 16.2.10 with Turbopack & React 19 (strict TypeScript)
- Monochrome SVG icon system (Lucide React + custom icons)
- Full responsive design (mobile-first: 320px → 1920px)
- Video backgrounds with poster images & smooth playback
- Dynamic page sections from CMS with fallback defaults
- Trust page with 5 comprehensive security sections
- Professional institutional design system (light/dark themes)
- Role-based access control (RBAC) with 5 roles
- Cryptographic verification integration (QRS-Reply portal)

✅ **CMS & Backend**
- Payload CMS 3.87.0 integrated
- PostgreSQL database
- REST API endpoints
- Session-based authentication
- Mock server fallback for development

✅ **Performance & Design**
- Responsive padding system (py-12 sm:py-16 md:py-20 lg:py-28)
- Adaptive grid layouts (1-2-3-4 columns based on breakpoint)
- Monochrome SVG icons (no emoji, no images)
- Background overlays with gradient effects
- CSS transforms & Tailwind animations
- Vercel edge caching & ISR
- Production-ready build optimization

✅ **Code Quality & UI/UX**
- TypeScript strict mode with proper interfaces
- ESLint compliant code (zero warnings on key files)
- Monochrome SVG icon system (Lucide React + custom icons)
- Full page responsiveness with adaptive layouts
- Professional institutional design theme (light/dark)
- Accessibility features (ARIA labels, keyboard navigation)
- Production-ready deployment to Vercel

## Quick Start - Local Development

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Create Environment File

Create `frontend/.env.local`:
```env
# CMS Configuration
NEXT_PUBLIC_CMS_URL=http://localhost:3001
DATABASE_URL=postgresql://user:password@host:5432/qrs_db
DATABASE_URL_UNPOOLED=postgresql://user:password@host:5432/qrs_db

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Start Development Server

```bash
cd frontend
npm run dev
```

The application will run on:
- **Frontend:** http://localhost:3000
- **Payload CMS (API):** http://localhost:3001
- **CMS Admin:** http://localhost:3001/admin (if CMS started separately)

## Architecture

### Frontend (Next.js 16)
- Server-side rendering (SSR) & static generation (ISR)
- Dynamic page content from Payload CMS
- Fallback to mock server when CMS unavailable
- Media management with file system storage
- Responsive design system

### Backend (Payload CMS)
- Headless CMS for page management
- Collections: pages, sections, media, users, audit-logs
- REST API (`/api/payload/*`)
- PostgreSQL database
- Session-based authentication

### Database (PostgreSQL)
- Hosted on cloud provider (Neon/Railway/etc)
- Manages: users, pages, media, audit logs
- Row-level security with RBAC

## API Endpoints

### Fetch Page Sections
```bash
GET /api/payload/page-sections?page=home&published=true
```

### Fetch Media Files
```bash
GET /api/media?type=image
GET /api/media?type=video
GET /api/media?type=document
```

### Fetch Pages
```bash
GET /api/payload/pages?where[slug][equals]=platform
```

## Deployment

### Frontend → Vercel (Deployed ✓)

```bash
npm run build
# Automatically deployed on git push to main
```

**Environment variables on Vercel:**
```
NEXT_PUBLIC_CMS_URL=http://localhost:3001 (or production CMS URL)
DATABASE_URL=postgresql://...
```

### Payload CMS → Local Only

Currently running locally (port 3001). For production:
1. Deploy to Node.js hosting (Railway, Render, etc.)
2. Set environment variables
3. Configure PostgreSQL connection
4. Update `NEXT_PUBLIC_CMS_URL` in frontend

## Media Management

**Supported file types:**
- Images: PNG, JPG, WebP, SVG
- Videos: MP4 (H.264), WebM (VP9)
- Documents: PDF, DOCX, XLSX

**Location:** `frontend/public/media/`
```
media/
├── images/      # Product screenshots, logos
├── videos/      # Demo videos, backgrounds
└── documents/   # PDFs, guides
```

**API Usage:**
```typescript
// Fetch all media
const response = await fetch('/api/media');
const { docs } = await response.json();

// Fetch by type
const videos = await fetch('/api/media?type=video');
```

## Type Safety

All TypeScript strict mode with proper interfaces:
```typescript
interface DefaultSection {
  id: string
  title: string
  sectionType: string
  backgroundStyle?: string
  items?: SectionItem[]
  imageUrl?: string
  videoUrl?: string
  [key: string]: unknown
}
```

## Performance Optimizations

- ✓ Responsive images with object-fit: fill
- ✓ Video preload optimization
- ✓ CSS transforms for animations
- ✓ Section padding consistency (2rem/7rem)
- ✓ Button sizing responsive (40px-48px height)
- ✓ Content Security Policy headers
- ✓ Strict security policies

## Development Workflow

### Local Testing
```bash
# Start dev server
npm run dev

# Type checking
npm run typecheck

# Linting
npm run lint

# Tests
npm run test
```

### Git Workflow
```bash
# Create branch
git checkout -b feature/my-feature

# Commit changes
git commit -m "feat: descriptive message"

# Push to GitHub
git push origin feature/my-feature

# Create PR for review
# Merge to main for auto-deploy to Vercel
```

## Production Checklist

- ✓ Environment variables configured
- ✓ Database migrations run
- ✓ SSL/TLS enabled
- ✓ CDN configured (Vercel edge)
- ✓ Monitoring set up
- ✓ Backups configured
- ✓ Security headers enabled
- ✓ Rate limiting configured

## Troubleshooting

### CMS Connection Issues
- Verify `NEXT_PUBLIC_CMS_URL` environment variable
- Check if Payload CMS server is running on port 3001
- Mock server will activate if CMS unavailable

### Media Not Loading
- Verify files in `frontend/public/media/`
- Check `/api/media` endpoint responds
- Ensure CSP headers allow media URLs

### Build Failures on Vercel
- Check `npm audit` for dependency issues
- Verify all environment variables set
- Clear Vercel cache and redeploy

## Contributing

1. Clone repository
2. Create feature branch
3. Make changes with tests
4. Push and create PR
5. After review and approval, merge to main
6. Vercel auto-deploys on merge

## Support

- **Issues:** GitHub Issues
- **Documentation:** See DOCS/ folder
- **Admin Panel:** http://localhost:3000/admin (local)

## License

Proprietary - Quantitative Risk Systems 2024-2026