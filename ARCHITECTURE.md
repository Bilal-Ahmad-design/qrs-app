# QRS Project Architecture

## High-Level Structure

```
qrs-app/
├── frontend/              # Next.js 16 frontend (Turbopack, App Router)
├── qrs-cms/              # Payload CMS (headless, PostgreSQL)
└── docs/                 # Documentation
```

---

## Frontend Architecture (`frontend/`)

### Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (frontend)/               # Public-facing pages
│   │   ├── page.tsx             # Home page
│   │   ├── about/page.tsx       # About page
│   │   ├── platform/page.tsx    # Platform page
│   │   ├── trust/page.tsx       # Trust & Security
│   │   ├── validation/page.tsx  # Validation page
│   │   ├── docs/page.tsx        # Docs
│   │   ├── privacy/page.tsx     # Privacy (static)
│   │   ├── terms/page.tsx       # Terms (static)
│   │   ├── security/page.tsx    # Security (static)
│   │   ├── cookies/page.tsx     # Cookies (static)
│   │   ├── support/page.tsx     # Support (static)
│   │   ├── subprocessors/page.tsx
│   │   └── [...slug]/page.tsx   # Catch-all dynamic routing (TODO)
│   │
│   ├── (payload)/                # Payload admin routes (stubs)
│   │   └── api/[...slug]/route.ts
│   │
│   ├── admin/                    # /admin dashboard
│   │   └── page.tsx             # Admin panel (role-gated)
│   │
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   │   ├── login/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── signup/route.ts
│   │   │   ├── me/route.ts
│   │   │   └── profile/route.ts
│   │   ├── users/route.ts        # User management
│   │   ├── pages/route.ts
│   │   ├── contact/route.ts      # Contact form
│   │   └── privacy-request/route.ts
│   │
│   ├── dashboard/                # /dashboard user portal
│   │   └── page.tsx
│   │
│   ├── login/page.tsx            # Login page
│   ├── signup/page.tsx           # Signup page
│   │
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles + animations
│
├── components/                   # Reusable React components
│   ├── marketing/                # Brand-specific components (NEW)
│   │   ├── ProductShowcase.tsx          # Video/image carousel
│   │   ├── VerificationFlow.tsx         # 4-step verification process
│   │   ├── RiskEngineShowcase.tsx       # Feature grid
│   │   ├── QuantumArchitecture.tsx      # 4-layer architecture
│   │   ├── SolutionCard.tsx             # Role-specific cards
│   │   ├── ComplianceBadge.tsx          # Certification badges
│   │   ├── LightThemeWrapper.tsx        # Light theme container
│   │   ├── DataCard.tsx                 # Generic card wrapper
│   │   ├── StatusIndicator.tsx          # Status/peril indicator
│   │   ├── PerilStatusIndicator.tsx
│   │   ├── DeviceFrame.tsx              # Device chrome mockup
│   │   ├── HeroDeviceFrame.tsx
│   │   ├── KPIStrip.tsx
│   │   ├── TrustBadgeCluster.tsx        # Trust badges
│   │   ├── VerifiedSealBadge.tsx        # Crypto seal badge
│   │   ├── PrivacyRequestForm.tsx
│   │   ├── SupportForm.tsx
│   │   └── CompliancePage.tsx
│   │
│   ├── ui/                      # Generic UI primitives
│   │   ├── Button.tsx           # CTA button system
│   │   ├── Badge.tsx
│   │   └── ...
│   │
│   ├── layout/                  # Page layout components
│   │   ├── Header.tsx           # Navigation header
│   │   ├── Footer.tsx           # Site footer
│   │   ├── SiteChrome.tsx       # Layout wrapper
│   │   ├── MobileNav.tsx        # Mobile-only nav
│   │   └── CookiePreferencesButton.tsx
│   │
│   ├── admin/                   # Admin panel components
│   │   └── UserManagement.tsx
│   │
│   └── cookie-consent/          # Cookie consent system (TODO)
│       ├── CookieConsentProvider.tsx
│       └── CookieConsentUI.tsx
│
├── lib/                         # Utilities & helpers
│   ├── cms-fetch.ts            # CMS REST API client (NEW)
│   ├── payload.ts              # Payload Local API (NOT IMPORTED - Turbopack issue)
│   ├── payload-client.ts       # Payload client utilities
│   ├── payload-fetch.ts        # Legacy fetch wrapper
│   ├── auth.ts                 # JWT auth utilities
│   ├── metadata.ts             # SEO metadata builder
│   ├── env.ts                  # Environment variables
│   ├── constants.ts            # Site-wide constants
│   └── utils.ts                # General utilities
│
├── styles/                      # Global styles
│   └── globals.css             # Tailwind imports + animations
│
├── public/                      # Static assets
│   ├── hero-placeholder.png
│   └── ...
│
├── tailwind.config.ts          # Tailwind config (WITH light theme)
├── next.config.ts              # Next.js config
├── tsconfig.json               # TypeScript config
├── package.json
└── .env.local                  # Environment variables (gitignored)
```

### Component Layers

```
UI Layer (Components)
├── Primitives (ui/)
│   ├── Button
│   ├── Badge
│   └── Card
│
├── Marketing (marketing/)
│   ├── ProductShowcase (video carousel)
│   ├── VerificationFlow (process steps)
│   ├── RiskEngineShowcase (feature grid)
│   ├── QuantumArchitecture (layers)
│   ├── SolutionCard (challenge/value)
│   ├── ComplianceBadge (status badges)
│   └── LightThemeWrapper (theme container)
│
├── Layout (layout/)
│   ├── SiteChrome (header/footer wrapper)
│   ├── Header
│   ├── Footer
│   └── MobileNav
│
└── Pages (app/*/page.tsx)
    ├── Home
    ├── About
    ├── Platform
    ├── Trust
    ├── Validation
    └── Dashboard (auth-required)

Data Layer (APIs & Utilities)
├── CMS Fetch (lib/cms-fetch.ts)
│   ├── getProductShowcaseItems()
│   ├── getSolutions()
│   ├── getRegulatoryCompliance()
│   ├── getPlatformCapabilities()
│   └── getDocumentation()
│
├── Auth APIs (api/auth/*)
│   ├── Login
│   ├── Logout
│   ├── Signup
│   └── Me
│
└── Data APIs (api/*)
    ├── Users
    ├── Pages
    ├── Contact
    └── Privacy Requests

Style Layer (Tailwind)
├── Global styles (globals.css)
├── Theme colors (tailwind.config.ts)
│   ├── Dark theme (ink, cream, teal)
│   └── Light theme (light-*) ← NEW
└── Utilities (animations, spacing, etc)
```

### Page Flow

```
Homepage (/)
├── Hero Section (DeviceFrame)
├── Active Models (PerilStatusIndicator)
├── Verifiable by Design (TrustBadgeCluster)
├── AI-Native Architecture
├── The Crisis (DataCards with metrics)
├── How It Works (4-step flow)
├── Independently Validated (Validation reports)
└── Enterprise CTA

Platform Page (/platform)
├── Hero (title + description)
├── Core Capabilities (DataCards)
└── Additional Features list

Trust Page (/trust)
├── Hero
├── Security & Compliance (2-column cards)
│   ├── Left: VerifiedSealBadge + Crypto explanation
│   └── Right: TrustBadgeCluster + Compliance notes
└── Security Features grid

Validation Page (/validation)
├── Hero
├── Validation Reports section
└── Validation Methodology (3-column grid)

About Page (/about)
├── Hero
├── Mission section
├── Why Verifiable section
├── Team section
```

---

## CMS Architecture (`qrs-cms/`)

### Directory Structure

```
qrs-cms/
├── collections/                   # Payload CMS collections (NEW)
│   ├── Users.ts                  # User management
│   ├── Pages.ts                  # Generic pages
│   ├── Blog.ts                   # Blog posts
│   ├── Media.ts                  # Images/PDFs
│   ├── ProductShowcase.ts        # Product demo content ← NEW
│   ├── Solutions.ts              # Role-based solutions ← NEW
│   ├── RegulatoryCompliance.ts   # Framework tracking ← NEW
│   ├── PlatformCapability.ts     # Features catalog ← NEW
│   ├── Documentation.ts          # Technical docs ← NEW
│   ├── PerilStatus.ts            # Peril/model status
│   ├── ValidationReports.ts      # Validation reports
│   ├── Redirects.ts              # URL redirects
│   ├── FormSubmissions.ts        # Form submission logs
│   └── AuditLogs.ts              # System audit trail
│
├── globals/                       # Payload CMS globals
│   └── TrustCenter.ts            # Global trust/security info
│
├── access/                        # Role-based access control
│   └── roles.ts                  # Reusable role helpers
│
├── hooks/                         # Lifecycle hooks
│   └── auditLog.ts               # Audit logging hook
│
├── payload.config.ts             # CMS configuration
├── tsconfig.json
├── package.json
└── .env.local                    # DATABASE_URL, etc
```

### CMS Collections Overview

| Collection | Purpose | Key Fields | Access Model |
|------------|---------|-----------|--------------|
| **ProductShowcase** | Hero/demo content | title, imageUrl, videoUrl, category, published | public read, admin create/update |
| **Solutions** | Role-specific pages | roleTitle, tagline, challenges[], qrsValue[], published | public read, admin create/update |
| **RegulatoryCompliance** | Framework compliance | region, framework, description, evidencePackage, published | public read, admin create/update |
| **PlatformCapability** | Feature catalog | category, title, features[], relatedCapabilities, published | public read, admin create/update |
| **Documentation** | Technical docs | section, slug, content (richText), codeExamples[], published | public read, editor+ create/update |
| **PerilStatus** | Peril/model status | perilName, status (production/validation/roadmap) | public read, editor+ create/update |
| **Pages** | Generic pages | slug, title, content, seoTitle, seoDescription | published-only read, editor+ create/update |

### Data Flow

```
CMS Admin Panel
    ↓
Payload API (/api/collections/*)
    ↓
Frontend REST Client (cms-fetch.ts)
    ↓
React Components (render with data)
    ↓
Browser (user sees content)

Alternative (when DB exists):
Payload Local API (lib/payload.ts - not yet imported)
    ↓ (same as above)
```

---

## Authentication & Authorization

### JWT Flow

```
User Login
    ↓
POST /api/auth/login {email, password}
    ↓
Backend validates + generates JWT
    ↓
JWT stored in httpOnly cookie
    ↓
GET /api/auth/me (validate token)
    ↓
User role stored in token: {sub, email, role, iat}

Roles: super-admin, admin, editor, reviewer, read-only
```

### Access Control

```
Public Pages (/*, /about, /platform, etc)
    → No auth required
    → Anyone can view

Admin Panel (/admin)
    → Requires: admin OR super-admin role
    → Check in checkAuth() function
    → Redirect to / if unauthorized

Dashboard (/dashboard)
    → Requires: any authenticated user
    → Shows user profile + settings
    → Admin users get "Go to Admin" button

Payload CMS (/admin on cms)
    → Requires: admin OR super-admin OR editor roles
    → Create/update depends on role
    → Super-admin can delete
```

---

## Styling Architecture

### Theme System

```
tailwind.config.ts
├── Dark Theme (existing)
│   ├── ink (grays + teal)
│   ├── cream (warm neutrals)
│   └── teal (accent colors)
│
└── Light Theme (NEW)
    ├── light-bg-primary (#F4F6F6)
    ├── light-bg-section (#FFFFFF)
    ├── light-bg-dark (#1B3B3A)
    ├── light-text-primary (#1A1A1A)
    ├── light-accent-primary (#5BBAB5)
    └── ... (see tailwind.config.ts for full palette)

Usage:
<div className="bg-light-bg-primary text-light-text-primary">
  Light themed content
</div>
```

### CSS Architecture

```
globals.css
├── Tailwind directives (@tailwind)
├── Global resets (html, body)
├── Font definitions (Outfit, Poppins, JetBrains Mono)
├── Custom animations
│   ├── @keyframes fadeInUp (entrance)
│   ├── @keyframes slideDown (slide)
│   └── prefers-reduced-motion override
└── Utility classes (containers, gaps)
```

### Component Styling Strategy

- **Tailwind-first:** All components use Tailwind utility classes
- **No CSS files:** Use className attribute, not separate .css/.module.css
- **Theme-aware:** Components use semantic color names (text-primary, bg-accent, etc)
- **Responsive:** Mobile-first, sm:/md:/lg:/xl: prefixes for breakpoints
- **Accessibility:** Color contrast ≥ 4.5:1 (WCAG AA), focus states, motion reduction

---

## Data Management & Fetching

### CMS-Driven Content Pattern

```
// Fetch data (server-side in Next.js)
async function HomePage() {
  // Try to fetch real CMS data
  const products = await getProductShowcaseItems()
  
  // If CMS unavailable (DATABASE_URL not set), returns []
  // Component then renders hardcoded fallback content
  
  return <main>
    {products.length > 0 ? (
      products.map(p => <ProductShowcase key={p.id} {...p} />)
    ) : (
      // Fallback (hardcoded)
      <ProductShowcase 
        imageUrl="/placeholder.png"
        title="Coming soon..."
      />
    )}
  </main>
}
```

### Fetch Strategy

| Pattern | Use Case | Example |
|---------|----------|---------|
| **GET /api/collection?where[field][equals]=value** | Fetch single item by field | getPageBySlug('home') |
| **GET /api/collection?where[field][equals]=value&limit=100** | Fetch multiple filtered | getSolutionByRole('underwriter') |
| **GET /api/collection?sort=order&limit=100** | Fetch sorted list | getProductShowcaseItems() |
| **GET /api/globals/trust-center** | Fetch global singleton | getTrustCenter() |

### Cache Strategy

```
getProductShowcaseItems()
  ↓
next: { revalidate: 3600 }  # Cache for 1 hour
  ↓
On-demand revalidation (manual after CMS update)
```

---

## Environment Configuration

### `.env.local` (not in git)

```
# CMS
NEXT_PUBLIC_CMS_URL=http://localhost:3001
NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3001

# Frontend (public)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Auth
JWT_SECRET=your-secret-key

# Database (only needed for server-side CMS)
DATABASE_URL=postgresql://user:pass@host/db

# Compliance
TURNSTILE_SECRET_KEY=your-turnstile-key
```

### Build Configuration

```
next.config.ts
├── Turbopack enabled (default Next.js 16)
├── Image optimization (next/image)
├── Static site generation (SSG where possible)
├── Dynamic routes (SSR when needed)
└── CSP headers (script-src 'self', style-src 'unsafe-inline')
```

---

## API Routes Structure

### Authentication Endpoints

```
POST /api/auth/signup
  Input: {email, password, fullname}
  Output: {user: {id, email, role}, token}

POST /api/auth/login
  Input: {email, password}
  Output: {user: {id, email, role}, token}

POST /api/auth/logout
  Output: {success: true}

GET /api/auth/me
  Headers: {Authorization: Bearer token}
  Output: {user: {id, email, role, fullname}}
```

### User Management

```
GET /api/users
  Headers: {Authorization: Bearer token}
  Output: [{id, email, fullname, role, created_at}]

PUT /api/users/{id}
  Headers: {Authorization: Bearer token}
  Input: {fullname, password}
  Output: {user: {...}}
```

### Form Endpoints

```
POST /api/contact
  Input: {name, email, message, turnstileToken}
  Output: {success: true}

POST /api/privacy-request
  Input: {email, requestType, turnstileToken}
  Output: {success: true}
```

---

## Build & Deployment Pipeline

### Local Development

```
npm run dev
  ↓
Next.js dev server (http://localhost:3000)
  + Turbopack hot reload
  + Fallback content when CMS unavailable
```

### Production Build

```
npm run build
  ↓
Turbopack compiles TypeScript + JSX
  ↓
Static export for pre-renderable routes
  ↓
Dynamic rendering for CMS-driven routes
  ↓
Output: .next/ directory

npm run start
  ↓
Production server ready
```

### Build Stages

```
1. Compile TypeScript → Check type safety
2. Generate static pages → Pre-render 31 routes
3. Optimize images → next/image
4. Minify CSS/JS → Production bundle
5. Create sitemap.xml → SEO
6. Export static files → Ready for CDN
```

---

## Known Constraints & Workarounds

### Turbopack + Payload CMS Issue

**Problem:**
- Importing `payload.config.ts` breaks Turbopack
- Root cause: `@payloadcms/db-postgres` → `drizzle-kit` has dynamic `require()`
- Turbopack static analysis cannot resolve this

**Current Workaround:**
1. REST API client (`cms-fetch.ts`) used for all page data
2. `lib/payload.ts` has Local API code but **NOT IMPORTED** from pages
3. Fall back to hardcoded content when CMS unavailable

**Future Solution (when DATABASE_URL exists):**
1. Try importing `lib/payload.ts` in pages
2. If build breaks, revert to REST API pattern (confirmed per M1)
3. Document exactly which pattern was required

### No Live Postgres Requirement

**Design Decision:**
- M1 & M2 built without requiring live database
- All marketing pages use fallback content
- CMS collections written; data seeding waiting on user
- Allows development/testing without external service dependency

---

## Testing & QA Architecture

### Type Checking
```
npm run build
  ↓
TypeScript validation
  ↓
0 errors required for production
```

### Component Testing

**Manual Browser Testing (No DB Required)**
- All marketing components render with fallback props
- Responsive design on mobile/tablet/desktop
- Light theme colors apply correctly
- No JavaScript errors in console

**CMS Testing (Requires DATABASE_URL)**
- Collection CRUD in admin panel
- Fetch utilities return data
- Pages render fetched content correctly
- Fallback gracefully if CMS unavailable

### Build Validation
```
next build
  ✓ Compiled successfully
  ✓ Running TypeScript
  ✓ Generating static pages
  ✓ Finalizing page optimization
  
Route table shows:
  ○ (Static) - prerendered as static content
  ƒ (Dynamic) - server-rendered on demand
```

---

## Performance Targets

### Lighthouse Metrics
- **Performance:** ≥85
- **Accessibility:** ≥90 (WCAG AA contrast, semantic HTML)
- **Best Practices:** ≥90
- **SEO:** ≥95

### Image Optimization
```
next/image component
├── Responsive srcset
├── WebP format (fallback to JPG)
├── Lazy loading
└── Automatic sizing
```

### Bundle Size
- **Main bundle:** <200KB (gzipped)
- **CSS:** <30KB (gzipped)
- **Components:** Tree-shake unused code

---

## Deployment Checklist

- [ ] All environment variables set
- [ ] DATABASE_URL configured (if using Payload)
- [ ] Build passes TypeScript
- [ ] `npm run build` succeeds
- [ ] `npm run start` serves correctly
- [ ] All 31 routes accessible
- [ ] Fallback content renders (no blank pages)
- [ ] Light theme colors applied
- [ ] Marketing components visible
- [ ] No console errors
- [ ] Lighthouse ≥85
