# QRS App - Unified Single Next.js Application

**Status:** ✅ Complete consolidation into single Next.js app  
**Architecture:** One Next.js app on port 3000 with integrated Payload CMS  
**Structure:** Website + CMS code in one `frontend/` folder

---

## What Changed

### Before (2 Apps)
```
frontend/                  (Next.js, port 3000)
qrs-cms/                   (Payload CMS, port 3001)
package.json              (root - managed both)
```

**Required:**
- 2 terminal windows
- 2 separate commands
- 2 package.json files
- Managing 2 ports

### Now (1 App, Unified)
```
frontend/                  (Single Next.js app, port 3000)
├── app/
│   ├── (frontend)/        ← Public website pages
│   └── admin/             ← CMS admin panel
├── cms/                   ← Payload CMS code
│   ├── collections/       ← Database schema
│   ├── globals/           ← Global settings
│   ├── lib/               ← Utilities
│   └── payload.config.ts  ← CMS configuration
└── package.json
```

**Now:**
- ✅ 1 terminal window
- ✅ 1 command: `npm run dev`
- ✅ 1 port (3000)
- ✅ 1 package.json
- ✅ Everything in frontend folder

---

## Quick Start

### Install Dependencies
```bash
cd frontend
npm install
```

### Start Development
```bash
npm run dev
```

This starts:
- **Website:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin
- **CMS API:** http://localhost:3000/api/payload/...

### Build for Production
```bash
npm run build
```

### Start Production
```bash
npm start
```

---

## Project Structure

```
frontend/
│
├── 📱 app/
│   ├── (frontend)/           ← Public website routes
│   │   ├── page.tsx          ← Home
│   │   ├── platform/page.tsx ← Platform
│   │   ├── verify/page.tsx   ← Built to be Verified
│   │   ├── solutions/page.tsx← Solutions
│   │   ├── regulatory/page.tsx← Regulatory
│   │   └── ...               ← 24 public pages total
│   │
│   ├── admin/                ← CMS Admin Routes
│   │   ├── layout.tsx        ← Admin layout wrapper
│   │   └── [].tsx            ← Dynamic admin pages
│   │
│   └── api/
│       ├── payload/[...slug]/route.ts    ← CMS API proxy
│       ├── contact/route.ts              ← Contact form
│       ├── privacy-request/route.ts      ← Privacy request
│       └── ...
│
├── 🎨 components/
│   ├── marketing/            ← 28 marketing components
│   ├── layout/               ← Header, Footer, etc
│   └── ui/                   ← Button, etc
│
├── 📚 lib/
│   ├── cms-fetch.ts          ← Fetch from CMS API (localhost:3000/api/payload)
│   ├── default-sections.ts   ← Fallback content
│   └── ...
│
├── 🗄️ cms/                   ← Payload CMS Code
│   ├── collections/          ← 18 database collections
│   │   ├── PageSections.ts   ← Page content blocks
│   │   ├── Solutions.ts      ← Role-based solutions
│   │   ├── RegulatoryCompliance.ts ← Regulatory frameworks
│   │   ├── Users.ts          ← User management + RBAC
│   │   ├── AuditLogs.ts      ← Audit trail
│   │   └── ... (14 more)
│   │
│   ├── globals/              ← Global configuration
│   │   ├── Settings.ts       ← Hero content, KPIs, branding
│   │   └── TrustCenter.ts    ← Trust information
│   │
│   ├── lib/
│   │   ├── rbac/roles.ts     ← RBAC system (5 roles, 14 permissions)
│   │   └── validation/       ← Form validation
│   │
│   └── payload.config.ts     ← CMS configuration
│
├── 📄 package.json           ← Dependencies (includes Payload CMS)
├── .env.local                ← Environment variables
└── next.config.js            ← Next.js configuration
```

---

## CMS Code Organization

The `cms/` folder contains all Payload CMS code:

### Collections (18 files)
These define database tables:
- **Content:** PageSections, Blog, Pages, Media, Documentation, ValidationReports
- **Data:** Solutions (5), RegulatoryCompliance (4), PlatformCapability, PerilStatus (7)
- **Logging:** FormSubmissions, AuditLogs, EmailLogs
- **Infrastructure:** Users (+ RBAC, auth), Redirects, FormEntries, EmailSettings

### Globals (2 files)
Singleton configuration:
- **Settings:** Hero content, KPIs, branding
- **TrustCenter:** Trust information

### Lib (3 files)
Utilities:
- **rbac/roles.ts:** 5 roles with 14 permissions
- **validation/schemas.ts:** Zod form validation
- **validation/responses.ts:** API response builders

---

## Data Flow (Single App)

```
┌──────────────────────────────────────┐
│  Single Next.js App (Port 3000)      │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│   Frontend Pages (app/(frontend)/)   │
│  (Home, Platform, Verify, etc)       │
└──────────────────────────────────────┘
         ↓
  Call getPageSections('verify')
         ↓
┌──────────────────────────────────────┐
│   CMS API Route                      │
│   /api/payload/page-sections?...     │
└──────────────────────────────────────┘
         ↓
┌──────────────────────────────────────┐
│   Payload CMS (app/api/payload/)     │
│   (Collections, Globals, Auth)       │
└──────────────────────────────────────┘
         ↓
   PostgreSQL Database
         ↓
  Return JSON data
         ↓
   SectionRenderer displays it
```

---

## API Endpoints

All endpoints are now local (no network calls):

```bash
# CMS Collections API
http://localhost:3000/api/payload/page-sections?page=verify&published=true
http://localhost:3000/api/payload/solutions?published=true
http://localhost:3000/api/payload/regulatory-compliance

# CMS Globals API
http://localhost:3000/api/payload/globals/settings
http://localhost:3000/api/payload/globals/trust-center

# CMS Authentication
http://localhost:3000/api/payload/users/login

# Admin Panel
http://localhost:3000/admin
```

---

## Environment Variables

Single `.env.local` file in `frontend/`:

```bash
# URLs (All on same port)
NEXT_PUBLIC_CMS_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PAYLOAD_URL=/api/payload

# Database (Shared)
DATABASE_URL=postgresql://...

# Secrets
JWT_SECRET=your-secret
PAYLOAD_SECRET=your-secret
```

---

## Key Benefits of Unified Setup

✅ **Single Command:** `npm run dev` starts everything  
✅ **One Port:** Everything on :3000 (no port management)  
✅ **Faster API Calls:** CMS API is local, no network latency  
✅ **Simpler Deployment:** Deploy as single app  
✅ **Easier Development:** All code in one place  
✅ **Smaller Bundle:** Shared dependencies  
✅ **Type Safety:** Single TypeScript configuration  

---

## Access Points

### Public Website
- **Home:** http://localhost:3000
- **Platform:** http://localhost:3000/platform
- **Verify:** http://localhost:3000/verify
- **Solutions:** http://localhost:3000/solutions
- **Regulatory:** http://localhost:3000/regulatory
- **All 24 pages:** See app/(frontend)/ directory

### CMS Admin Panel
- **Admin:** http://localhost:3000/admin
- **Login:** Use admin credentials
- **Create content:** Add sections, data, etc.

### API Access
- **Page Sections:** /api/payload/page-sections
- **Solutions:** /api/payload/solutions
- **Globals:** /api/payload/globals/settings
- **All endpoints:** See cms/payload.config.ts

---

## File Locations Reference

| What | Where |
|------|-------|
| Public pages | `app/(frontend)/*/page.tsx` |
| Admin panel | `app/admin/` |
| CMS API proxy | `app/api/payload/[...slug]/route.ts` |
| Form APIs | `app/api/contact/route.ts`, `app/api/privacy-request/route.ts` |
| CMS Collections | `cms/collections/` (18 files) |
| CMS Globals | `cms/globals/` (2 files) |
| CMS Config | `cms/payload.config.ts` |
| RBAC System | `cms/lib/rbac/roles.ts` |
| Form Validation | `cms/lib/validation/schemas.ts` |
| CMS Fetch Client | `lib/cms-fetch.ts` |
| Fallback Content | `lib/default-sections.ts` |

---

## Package.json Changes

### Dependencies Added
- `payload@^3.87.0` - CMS core
- `@payloadcms/db-postgres@^3.87.0` - Database adapter
- `@payloadcms/richtext-lexical@^3.87.0` - Rich text editor
- `bcryptjs@^3.0.3` - Password hashing

### Scripts Simplified
```json
{
  "dev": "cd frontend && npm run dev",
  "build": "cd frontend && npm run build",
  "start": "cd frontend && npm start"
}
```

---

## Workflow: Creating Content

1. **Start app:**
   ```bash
   npm run dev
   ```

2. **Open admin panel:**
   - Navigate to http://localhost:3000/admin
   - Login with admin credentials

3. **Create content:**
   - Go to "Page Sections"
   - Click "Create New"
   - Fill in: page, sectionType, heading, items, etc.
   - Click "Publish"

4. **See on frontend:**
   - Open http://localhost:3000/verify (or page you added to)
   - Content appears automatically
   - If CMS is offline, fallback defaults show

---

## Fallback System

If CMS is unavailable:
1. Frontend tries to fetch from `/api/payload/...`
2. If request fails, catches error
3. Falls back to hardcoded defaults in `lib/default-sections.ts`
4. Page still loads with content

**Result:** Pages always work, even if CMS fails!

---

## Old qrs-cms Folder

The original `qrs-cms/` folder still exists but is:
- ⚠️ **Not used anymore**
- ⚠️ **Can be deleted**
- ✅ Still in git for reference

```bash
# To remove old folder (optional)
rm -rf qrs-cms
git rm -r qrs-cms
git commit -m "remove: delete deprecated qrs-cms folder"
```

---

## Next.js App Router Flow

```
User visits: http://localhost:3000/verify
    ↓
Next.js App Router matches: app/(frontend)/verify/page.tsx
    ↓
Page component runs (Server Component)
    ↓
Calls: getPageSections('verify')
    ↓
cms-fetch.ts makes request to /api/payload/page-sections?page=verify
    ↓
app/api/payload/[...slug]/route.ts catches request
    ↓
Payload CMS processes request
    ↓
Database returns results
    ↓
JSON response sent back
    ↓
SectionRenderer renders each section
    ↓
User sees page with CMS content
```

---

## Deployment

### To Vercel
```bash
# Deploy entire Next.js app (with CMS)
cd frontend
vercel deploy
```

Single deployment includes:
- ✅ Website
- ✅ Admin panel
- ✅ All CMS functionality

### To Self-Hosted Server
```bash
# Build
npm run build

# Start
npm start

# Runs on :3000 with everything included
```

---

## Commands

```bash
# Development (everything on one command)
npm run dev

# Production build
npm run build

# Production start
npm start

# Type checking
npm run typecheck

# Linting
npm run lint
```

All commands run from the `frontend/` directory with everything integrated!

---

## Summary

🎉 **Single Unified Next.js Application:**

✅ Website + CMS in one app  
✅ One port (3000) for everything  
✅ One command to start (`npm run dev`)  
✅ CMS code in organized `cms/` subfolder  
✅ Easy to understand structure  
✅ Production-ready deployment  
✅ Type-safe with TypeScript  

**Next step:** Run `npm run dev` and visit http://localhost:3000/admin to start managing content! 🚀
