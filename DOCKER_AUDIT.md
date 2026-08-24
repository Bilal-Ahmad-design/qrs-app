# Docker Audit Report - QRS Platform

**Date:** 2026-08-24  
**Application:** QRS Risk Platform  
**Current Production Deployment:** Vercel (https://qrs-app-eight.vercel.app/)  
**Phase:** Phase 6 - Consolidated Single Next.js Application

---

## Executive Summary

The QRS Platform is a **single consolidated Next.js application** with **integrated Payload CMS**. There is no separate frontend/CMS architecture split. The application is currently deployed on Vercel and can be Dockerized as a single multi-stage container.

**Status:** ✅ Ready for Dockerization  
**Risk Level:** Low - No architectural changes needed

---

## Actual Runtime Architecture

### Current Development Flow

```
npm run dev
  ├─ Spawns: cms/mock-server.ts on port 3001 (Payload CMS API)
  └─ Spawns: next dev on port 3000 (Next.js frontend)
     └─ Proxies: /api/payload/* → http://localhost:3001
```

### Current Production Flow (Vercel)

```
Vercel Edge (https://qrs-app-eight.vercel.app/)
  └─ Next.js build output
     └─ API routes (includes /api/payload proxy)
```

### Consolidated Application Structure

```
qrs-app/ (Single monorepo)
├── frontend/ (Main application root)
│   ├── app/                    # Next.js App Router (all routes)
│   ├── cms/                    # Payload CMS configuration & mock-server
│   │   ├── payload.config.ts   # CMS collections & globals
│   │   ├── mock-server.ts      # Development mock server (port 3001)
│   │   ├── collections/        # CMS data models
│   │   └── globals/            # CMS global settings
│   ├── components/             # React components (marketing, admin, UI)
│   ├── lib/                    # Utilities & CMS fetch functions
│   ├── public/                 # Static assets
│   ├── styles/                 # Tailwind CSS
│   ├── package.json            # 📌 MAIN APPLICATION PACKAGE
│   ├── package-lock.json       # 📌 Lockfile (at root)
│   ├── next.config.js          # Next.js configuration
│   ├── tsconfig.json           # TypeScript configuration
│   └── .env.local              # Development environment variables
├── package-lock.json           # 📌 SINGLE LOCKFILE AT ROOT
├── ARCHITECTURE.md             # Phase 6 architecture documentation
├── README.md                    # Project documentation
└── dev.js                       # 📌 Development orchestration script

**Note:** qrs-cms/ folder does NOT exist - it's legacy/removed
```

---

## Application Entry Points

### Build Entry Point
```
Command:  npm run build
Location: frontend/package.json
Output:   Next.js build artifact (.next/ directory)
Config:   next.config.js (features redirects, CSP headers, static optimization)
```

### Start Entry Point (Production)
```
Command:  npm start
Location: frontend/package.json
Entrypoint: next start
Port:     3000
Runtime:  Node.js 18.20.2+ (per package.json engines)
```

### Development Entry Point
```
Command:  npm run dev
Location: Root dev.js script
Behavior: Orchestrates both Payload CMS (port 3001) and Next.js (port 3000)
Sequence: Starts mock-server.ts first, waits for readiness, then starts next dev
```

---

## Package Management

### Package Managers
- **Type:** npm (lockfile v3)
- **Lockfile:** `package-lock.json` (at repository root)
- **Install Path:** Frontend dependencies at `frontend/`

### Node.js Version Requirements
```
Declared in frontend/package.json:
  "engines": {
    "node": "^18.20.2 || >=20.9.0"
  }

Recommended: Node.js 20.x LTS
Docker Base Image: node:20-alpine or node:20-slim
```

### Critical Dependencies

**Core Framework:**
- next@16.2.10
- react@19.2.7
- react-dom@19.2.7
- typescript@5.7.0

**CMS & Database:**
- payload@3.87.0
- @payloadcms/db-postgres@3.87.0
- @payloadcms/richtext-lexical@3.87.0
- pg@8.22.0

**Utilities:**
- tailwindcss@3.4.19
- zod@4.4.3
- jsonwebtoken@9.0.2
- bcryptjs@3.0.3
- nodemailer@6.9.13
- lucide-react@1.23.0
- sharp@0.33.0 (image processing - has native binary dependencies)

**Dev Dependencies:**
- typescript@5.7.0
- eslint@9.0.0
- @playwright/test@1.45.0
- vitest@1.6.0
- @lhci/cli@0.15.1

---

## Build Configuration

### Next.js Configuration
**File:** `frontend/next.config.js`

**Key Settings:**
```javascript
{
  reactStrictMode: true,
  serverExternalPackages: ['drizzle-kit', 'esbuild', 'esbuild-register'],
  // Dynamically fetches redirects from CMS
  redirects: async () => { ... },
  // Security headers (CSP, HSTS, etc.)
  headers: async () => { ... }
}
```

**Not using `output: "standalone"`** - currently building for Vercel

**Output:** Standard `.next/` directory with full node_modules required at runtime

### TypeScript Configuration
**File:** `frontend/tsconfig.json`

**Strict Mode:** ✅ Enabled  
**Path Aliases:** `@/*` → `frontend/*`  
**Excluded from Build:** `scripts`, `cms`, `vitest.config.ts`

### Build Scripts
```json
{
  "build": "next build",                    // Production build
  "start": "next start",                    // Start server from built artifact
  "dev": "node dev.js",                     // Start dev with CMS orchestration
  "dev:frontend": "next dev",               // Next.js only (no CMS)
  "cms": "payload run",                     // Payload CLI server
  "cms:server": "tsx cms/server.ts",        // Run CMS server directly
  "lint": "eslint .",                       // Linting
  "typecheck": "tsc --noEmit",              // Type checking
  "test": "vitest run",                     // Unit tests
  "test:e2e": "playwright test",            // E2E tests
  "seed": "tsx cms/seed.ts"                 // Database seeding
}
```

---

## Database Configuration

### PostgreSQL Setup

**Current Production (Neon):**
```
Host:      ep-cool-block-at41gwhk.c-9.us-east-1.aws.neon.tech
Database:  neondb
User:      neondb_owner
Connection: Pooled + Unpooled options
SSL Mode:  require
```

**Environment Variables Required:**
```
DATABASE_URL=postgresql://user:password@host:port/dbname?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://user:password@host:port/dbname?sslmode=require
```

**Payload Configuration:**
```typescript
// frontend/cms/payload.config.ts
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URL || '',
  },
}),
```

**Collections Managed:**
- Users
- Pages
- Blog
- ValidationReports
- PerilStatus
- Redirects
- FormSubmissions
- FormEntries
- EmailLogs
- EmailSettings
- AuditLogs
- Media
- ProductShowcase
- Solutions
- RegulatoryCompliance
- PlatformCapability
- Documentation
- PageSections

**Globals Managed:**
- TrustCenter
- Settings
- Navigation
- Homepage

### Local Docker Database
For local development Docker Compose:
- **Service:** postgres:16-alpine
- **Port:** 5432 (internal), expose as needed
- **Volume:** Named volume for persistence
- **Init:** Database must exist before app starts

---

## Media & File Storage

### Current Storage
- **Location:** `frontend/public/media/`
- **Types:** Images, videos, documents
- **Endpoint:** `/api/media` (Next.js API route)

### Production (Vercel)
- **Behavior:** Static files in `public/` served via Vercel CDN edge cache
- **Media Path:** Accessible at `https://qrs-app-eight.vercel.app/media/*`

### Docker Development
- **Volume Mount:** `./frontend/public/media:/app/public/media`
- **Persistence:** Docker named volume

### Docker Production
- **Strategy:** External object storage (S3, Cloudflare R2, etc.)
- **Not Configured:** This audit does not assume production media solution exists
- **Future:** Payload CMS can be configured with S3 adapter if needed

---

## Environment Variables

### Required for Docker Runtime

**Database:**
```
DATABASE_URL=postgresql://...             (pooled connection)
DATABASE_URL_UNPOOLED=postgresql://...    (non-pooled fallback)
```

**CMS:**
```
PAYLOAD_SECRET=<random-secure-string>     (required by Payload)
NEXT_PUBLIC_CMS_URL=http://localhost:3000 (in Docker, same origin)
NEXT_PUBLIC_CMS_API_URL=http://localhost:3000
```

**Authentication:**
```
JWT_SECRET=<random-secure-string>         (for JWT tokens)
SESSION_SECRET=<random-secure-string>     (for sessions)
```

**Site Configuration:**
```
NEXT_PUBLIC_SITE_URL=http://localhost:3000 (dev), https://qrs-app-eight.vercel.app (prod)
NODE_ENV=development|production
```

**Optional/Development:**
```
DEBUG=next:*                               (Next.js debug logging)
VERCEL_OIDC_TOKEN=...                      (only for Vercel deployments)
```

### Docker Build vs Runtime

**Build-Time Secrets:** ❌ Should NOT be in Dockerfile or build args  
**Runtime Secrets:** ✅ Injected via `docker run -e` or `.env` file  
**Build Optimization:** ARG used only for public build parameters (Node version, etc.)

---

## API Routes & Payload Proxy

### Current Proxy Pattern

**Frontend Route:** `frontend/app/api/payload/[...slug]/route.ts`

```typescript
// Proxies all /api/payload/* requests to http://localhost:3001
GET/POST /api/payload/[...slug]
  └─ Forwarded to: http://localhost:3001/api/payload/[...slug]
  └─ Used for: CMS operations, media endpoints, auth
```

**In Docker:**
- Payload CMS runs on `http://localhost:3001` (internal)
- Next.js proxies requests internally
- External clients access via `http://container:3000/api/payload/*`

### Payload CMS Endpoints Proxied
```
GET  /api/payload/pages                    # Fetch pages
GET  /api/payload/page-sections            # Fetch page sections
GET  /api/payload/users                    # User management
POST /api/payload/auth/login               # Authentication
POST /api/payload/auth/refresh             # Token refresh
GET  /api/payload/redirects                # Redirect rules
POST /api/payload/media                    # Upload media
```

---

## Security & Secrets Management

### Current Secrets (in .env.local - DEVELOPMENT ONLY)
```
DATABASE_URL               (Neon credentials)
DATABASE_URL_UNPOOLED      (Neon credentials)
JWT_SECRET                 (hardcoded - NOT secure)
PAYLOAD_SECRET             (hardcoded - NOT secure)
SESSION_SECRET             (hardcoded - NOT secure)
VERCEL_OIDC_TOKEN          (Vercel integration)
```

### Docker Security Recommendations
1. **Never embed secrets in Dockerfile or image layers**
2. **Use docker run -e or .env file injection**
3. **For CI/CD: Use orchestration platform secret management** (Docker Swarm secrets, Kubernetes Secrets, etc.)
4. **Never commit .env.local to Git** (already in .gitignore)
5. **Generate secure random secrets for production**

### Security Headers (Configured)
✅ Content-Security-Policy (CSP)  
✅ Strict-Transport-Security (HSTS)  
✅ X-Content-Type-Options: nosniff  
✅ X-Frame-Options: SAMEORIGIN  
✅ Referrer-Policy: strict-origin-when-cross-origin  
✅ Permissions-Policy  
✅ Cross-Origin-Opener-Policy  
✅ Cross-Origin-Embedder-Policy

---

## Port Configuration

### Development (with dev.js orchestration)
```
Port 3001: Payload CMS mock-server (tcp://localhost:3001)
Port 3000: Next.js frontend (tcp://localhost:3000)
```

### Production (Docker / Vercel)
```
Port 3000: Next.js application (exposed to host/load balancer)
Port 3001: Payload CMS (internal, not exposed externally)
```

### In Docker Compose
```yaml
next:
  ports:
    - "3000:3000"    # External access
  environment:
    - NEXT_PUBLIC_CMS_URL=http://localhost:3000
    - NEXT_PUBLIC_CMS_API_URL=http://localhost:3000

payload:
  ports: []          # No external ports - internal only
  environment:
    - DATABASE_URL=postgresql://postgres:postgres@postgres:5432/qrs
```

---

## Vercel Compatibility Notes

### Current Deployment
- **Platform:** Vercel
- **Build:** `npm run build` (in root or `frontend/`)
- **Start:** `npm start` (Next.js standalone)
- **Serverless:** Functions created from API routes
- **Static:** Public files served via edge cache

### Docker Divergence
- **No Vercel CLI needed** (`vercel deploy` not applicable)
- **Standard Node.js runtime** instead of Vercel's edge functions
- **Stateful server** instead of serverless
- **Traditional deployment** vs. Vercel's git-push-to-deploy

### Environment Variable Mapping
Vercel Project Settings → Docker `.env` file (for local)  
Production Secrets → Docker orchestration platform (Swarm/K8s/etc.)

---

## Dockerization Risks & Mitigations

### Risk 1: Database Initialization
**Problem:** Payload CMS needs database schema (migrations)  
**Mitigation:** Run `npm run seed` as part of Dockerfile or init container  
**Plan:** Include migration step in Docker entrypoint script

### Risk 2: Port Conflicts
**Problem:** Port 3000 and 3001 may already be in use  
**Mitigation:** Docker isolation, or remap ports via `-p` flag  
**Plan:** Document port configuration in compose files

### Risk 3: Environment Variable Injection
**Problem:** Secrets cannot be embedded in Dockerfile  
**Mitigation:** Use runtime environment injection  
**Plan:** Provide `.env.example` and require user to create `.env`

### Risk 4: Sharp Native Dependencies
**Problem:** Sharp (image processing) requires compilation  
**Mitigation:** Use alpine image with build tools, or multi-stage build  
**Plan:** Multi-stage build to remove dev dependencies after build

### Risk 5: Development vs. Production Build
**Problem:** dev.js orchestrates both CMS and Next.js (not suitable for Docker single-image)  
**Mitigation:** Use single Node.js app runner inside container  
**Plan:** Run both Payload CMS and Next.js as single process, or use init system

### Risk 6: Media Volume Persistence
**Problem:** Media files in `frontend/public/media/` lost on container restart  
**Mitigation:** Mount as Docker volume  
**Plan:** Define named volume in compose file

### Risk 7: Build Cache Busting
**Problem:** Next.js build cache interferes with Docker builds  
**Mitigation:** Remove `.next/` before building  
**Plan:** .dockerignore includes `.next/`

---

## Current Vercel Deployment Analysis

### Vercel Build Process
```
1. Clone repository
2. Install dependencies (npm install)
3. Run build command: npm run build
4. Deploy .next/ output
5. Set environment variables from Vercel dashboard
6. Start command: npm start
```

### Dockerfile Should Match This Flow
```
1. Copy source code
2. npm ci (clean install for reproducibility)
3. npm run build
4. npm start (in container)
```

---

## Conflicts Between Architecture Docs & Source Code

### README.md Says
> "CMS Server (port 3001) - If CMS started separately"

### Code Actually Does
- **Default:** dev.js orchestrates both (port 3000 + 3001)
- **Production:** Single process on port 3000 (via Next.js)
- **CMS runs inside Next.js process**, not truly separate

### Clarification
The "separation" is internal/virtual:
- Payload CMS API server runs on 3001 during dev
- Next.js proxies requests to it
- In production (Vercel/Docker), Next.js directly loads Payload CMS

**No changes needed.** Docker will preserve this behavior.

---

## Payload CMS Integration Points

### Collections Generated
```
frontend/cms/payload-types.ts (auto-generated)
  └─ TypeScript types for all collections & globals
```

### CMS Admin Interface
- **Currently:** Not exposed in production (Vercel)
- **In Docker:** Can be exposed at `/admin` if desired
- **Implementation:** Built into Payload CMS - accessible if authenticated

### CMS REST API
- **Proxy Route:** `/api/payload/[...slug]`
- **Mock Server:** `cms/mock-server.ts` (development only)
- **Real Server:** Integrated into Next.js process in production

---

## Build & Start Behavior Verification

### Existing Build Command
```bash
npm run build
# Defined in: frontend/package.json
# Executes: next build
# Output: .next/ directory with optimized bundles
# Duration: ~60-90 seconds on modern hardware
# Cache: Uses .next/cache for incremental builds
```

### Existing Start Command
```bash
npm start
# Defined in: frontend/package.json
# Executes: next start
# Behavior: Starts Next.js server on port 3000
# Duration: ~2-5 seconds to ready
# Includes: Payload CMS integrated within Next.js process
```

### Development Command (for reference)
```bash
npm run dev
# Defined in: root dev.js
# Behavior: Orchestrates Payload CMS + Next.js
# NOT USED IN DOCKER - containers should be single-process
```

---

## Health Check Endpoints

### Current Status
**No health check endpoint exists** at `/api/health`

### Needed for Docker
```typescript
// frontend/app/api/health/route.ts
export async function GET() {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  })
}
```

**Recommendation:** Create this as part of Docker implementation

---

## Dockerfile Strategy

### Multi-Stage Build (Recommended)

**Stage 1: Dependencies**
- Base: `node:20-alpine`
- Copy: `package*.json`
- Install: `npm ci` (clean install)
- Output: `/app/node_modules`

**Stage 2: Builder**
- Base: `node:20-alpine`
- Copy: Source code + dependencies from stage 1
- Build: `npm run build`
- Output: `.next/` directory

**Stage 3: Runner (Production)**
- Base: `node:20-alpine` (minimal runtime)
- Copy: `.next/`, `public/`, `node_modules/`, `package.json` from stages 1-2
- Expose: Port 3000
- Entrypoint: `npm start`

**Benefits:**
- Minimal final image (no dev dependencies, no source code except what needed)
- Build cache optimization
- Security (no build tools in production image)
- Size: ~500MB vs. ~1.5GB without optimization

---

## Summary Table

| Aspect | Current State | Docker Requirement |
|--------|---------------|-------------------|
| **Entry Point** | `npm run build` / `npm start` | Same commands |
| **Port** | 3000 (external), 3001 (internal) | 3000 exposed |
| **Database** | Neon PostgreSQL | Any PostgreSQL (Neon or local) |
| **Node Version** | 18.20.2+ or 20+ | 20 recommended |
| **Build Time** | ~2 minutes | ~3-5 minutes (fresh build) |
| **Lockfile** | `package-lock.json` at root | Preserve as-is |
| **Secrets** | In `.env.local` (dev) | Injected at runtime |
| **Media Storage** | `public/media/` filesystem | Docker volume or S3 |
| **Health Check** | None currently | `/api/health` needed |
| **CMS Payload** | Integrated in Next.js process | Same, runs within container |
| **Environment** | Development: dev.js orchestration | Container: `npm start` only |

---

## Recommendation

✅ **Proceed with Dockerization**

The application is well-suited for containerization:
1. Single monorepo with consolidated CMS integration
2. Clear build and start commands
3. Environment-driven configuration
4. No legacy qrs-cms folder to maintain
5. PostgreSQL backend ready for any host

**Priority:**
1. Create multi-stage Dockerfile
2. Create docker-compose.dev.yml (for local development with postgres service)
3. Create docker-compose.prod.yml (if self-hosting, else skip for Vercel)
4. Create `.env.example` with all required variables
5. Add health check endpoint
6. Update documentation with Docker deployment guide
7. Test full flow: build → run → access application → verify CMS connectivity

**No breaking changes needed.** Docker will preserve all existing functionality.
