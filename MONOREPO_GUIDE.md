# QRS App - Unified Monorepo Setup

**Status:** Consolidated into single monorepo with npm workspaces  
**Architecture:** Frontend (Next.js port 3000) + CMS Backend (Payload CMS port 3001)  
**Single Command:** `npm run dev`

---

## What is a Monorepo?

A **monorepo** is a single git repository that contains multiple projects (workspaces). This gives you:

✅ **Unified development:** One `npm run dev` command starts everything  
✅ **Single deployment:** Deploy both apps together  
✅ **Shared dependencies:** Both apps can share node_modules  
✅ **Easy management:** One git repo, one codebase to maintain  
✅ **Modular:** Apps remain separate but coordinated  

---

## Project Structure

```
c:\laragon\www\qrs-app\
├── package.json                 ← Root monorepo config (workspaces)
├── package-lock.json
│
├── frontend/                    ← App 1: Next.js Frontend (port 3000)
│   ├── package.json
│   ├── next.config.js
│   ├── app/
│   ├── lib/
│   └── components/
│
└── qrs-cms/                     ← App 2: Payload CMS (port 3001)
    ├── package.json
    ├── payload.config.ts
    ├── collections/
    └── globals/
```

---

## Commands

### **Start All (Recommended for Development)**
```bash
npm run dev
```

This starts both servers simultaneously:
- Frontend: http://localhost:3000
- CMS Admin: http://localhost:3000/admin (proxied)
- CMS API: http://localhost:3001/api

### **Start Individual Servers**
```bash
# Just frontend
npm run dev:frontend

# Just CMS
npm run dev:cms
```

### **Build Everything**
```bash
npm run build
```

Builds both frontend and CMS.

### **Production Start**
```bash
npm start
```

Starts both in production mode.

---

## Workflow: Making Content Editable

### Step 1: Start Everything
```bash
npm run dev
```

### Step 2: Create Content in CMS
1. Open: http://localhost:3000/admin
2. Login with admin credentials
3. Navigate to "Page Sections"
4. Create/edit sections for pages
5. Publish changes

### Step 3: Frontend Fetches Content
Frontend automatically fetches from CMS at: http://localhost:3001/api

Pages fetch data from:
- `getPageSections('page-name')` ← Calls `/api/page-sections?page=page-name`
- `getSettings()` ← Calls `/api/globals/settings`
- `getSolutions()` ← Calls `/api/solutions`
- etc.

### Step 4: See Changes
Frontend page shows CMS content (or falls back to defaults if CMS is down).

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│          Development: npm run dev                       │
└────────────────┬──────────────────────┬────────────────┘
                 │                      │
        ┌────────▼────────┐   ┌─────────▼──────────┐
        │   Frontend App  │   │  CMS Backend       │
        │   (Next.js)     │   │  (Payload CMS)     │
        │   Port 3000     │   │  Port 3001         │
        │                 │   │                    │
        │  - Pages (/)    │   │  - Collections     │
        │  - /verify      │   │  - Globals         │
        │  - /solutions   │   │  - Admin UI        │
        │  - /regulatory  │   │  - REST APIs       │
        │  - /admin       │   │                    │
        │    (proxied)    │   │                    │
        └────────┬────────┘   └────────┬───────────┘
                 │                     │
                 └──────────┬──────────┘
                            │
                     REST API Calls
                  (port 3001/api/...)
                            │
                   ┌────────▼────────┐
                   │   PostgreSQL    │
                   │   Database      │
                   └─────────────────┘
```

---

## Key Files

### Root Level
- **package.json** - Workspaces config, scripts for running both apps
- **MONOREPO_GUIDE.md** - This file

### Frontend (`frontend/`)
- **next.config.js** - Next.js config with CSP headers
- **lib/cms-fetch.ts** - Fetches from CMS API (http://localhost:3001/api)
- **lib/default-sections.ts** - Fallback content if CMS is offline
- **app/(frontend)/** - 24 public pages
- **components/marketing/SectionRenderer.tsx** - Renders CMS sections

### CMS (`qrs-cms/`)
- **payload.config.ts** - Payload CMS configuration
- **collections/** - 18 database collections
- **globals/** - Settings, TrustCenter
- **package.json** - Payload dependencies

---

## Environment Variables

Both apps share `.env.local` files in their respective directories:

### Frontend (`.env.local`)
```bash
NEXT_PUBLIC_CMS_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL=postgresql://...
JWT_SECRET=...
```

### CMS (`.env.local`)
```bash
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=...
JWT_SECRET=...
```

---

## Workflow: CMS-Driven Content

**Goal:** Manage all frontend content from Payload CMS without code changes

### What's CMS-Driven:
✅ Page sections (hero, feature-grid, cta, etc.)  
✅ Peril statuses (validated, illustrative, roadmap)  
✅ Solutions by role (Underwriters, Portfolio Managers, etc.)  
✅ Regulatory frameworks (Solvency II, NAIC, ORSA, Lloyd's)  
✅ Platform capabilities  
✅ Settings & branding  

### What's Still Hardcoded:
❌ Navigation links (frontend/lib/constants.ts)  
❌ Page routes (Next.js app router)  
❌ Component structure (React components)  

---

## Troubleshooting

### "npm run dev" doesn't work
```bash
# Check if concurrently is installed
npm install -g concurrently

# Or use individual commands
npm run dev:frontend  # Terminal 1
npm run dev:cms       # Terminal 2
```

### Frontend doesn't show CMS content
1. Check CMS is running: http://localhost:3001
2. Check database connection in `.env.local`
3. Check page sections exist in CMS admin
4. Check "Published" checkbox is set

### CMS not starting
```bash
cd qrs-cms
npm install
npm run dev
```

### Database connection error
1. Verify `DATABASE_URL` in `.env.local`
2. Check PostgreSQL is running (Neon cloud DB)
3. Verify network connectivity to database

---

## Deployment

### Local Development
```bash
npm run dev
# Both apps run on localhost (3000 + 3001)
```

### Production Build
```bash
npm run build
# Builds both frontend and CMS

npm start
# Starts both in production
```

### Deploy to Vercel (Frontend Only)
```bash
# Deploy frontend/ to Vercel
cd frontend
vercel deploy
```

### Deploy CMS (Separate Server)
```bash
# Deploy qrs-cms/ to separate Node.js hosting
# (Railway, Render, Fly.io, etc.)
```

---

## Why Monorepo?

**Before:** Two separate setups
```
c:\laragon\www\qrs-app\frontend\          # App 1
c:\laragon\www\qrs-app\qrs-cms\           # App 2
# Had to: cd frontend && npm run dev, then cd qrs-cms && npm run dev
```

**After:** One unified monorepo
```
c:\laragon\www\qrs-app\
├── frontend/
├── qrs-cms/
└── package.json (workspaces)
# Now: npm run dev (runs both)
```

**Benefits:**
- ✅ One command to start development
- ✅ Both apps use shared node_modules
- ✅ Easier to manage as one project
- ✅ Standard monorepo pattern (used by Next.js, Vercel, etc.)

---

## What's NOT Changed

- ✅ Frontend code remains the same
- ✅ CMS collections remain the same
- ✅ Database schema unchanged
- ✅ API contracts unchanged
- ✅ Deployment strategy can remain unchanged

This is a **development workflow improvement** only - the actual apps work exactly as before.

---

## Next Steps

1. Install dependencies: `npm install`
2. Start everything: `npm run dev`
3. Open http://localhost:3000 (frontend)
4. Go to http://localhost:3000/admin (CMS)
5. Create page sections in CMS
6. See them live on frontend pages

---

For more details on CMS setup, see [CMS_SETUP_GUIDE.md](CMS_SETUP_GUIDE.md)
