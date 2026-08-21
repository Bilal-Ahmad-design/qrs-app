# QRS Project Architecture

**Version:** Phase 5 (P0 Complete, P1 In Progress)  
**Last Updated:** 2026-08-21  
**Status:** Frontend audit complete, DNS cutover preparation, 3 new pages deployed

## High-Level Structure

```
qrs-app/
├── frontend/              # Next.js 16.2.10 frontend (Turbopack, App Router, React 19)
├── qrs-cms/              # Payload CMS 3.87.0 (headless, Next.js, PostgreSQL)
└── docs/                 # Documentation & runbooks
```

**Key Integrations:**
- Frontend: Public marketing site (no authentication)
- Backend: Payload CMS with JWT auth + RBAC (admin panel only)
- Security: Turnstile verification, rate limiting, audit logging, CSP hardening
- Validation: Zod schemas at API trust boundaries
- Database: PostgreSQL (Neon) shared across both apps

---

## Frontend Architecture (`frontend/`)

### Directory Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── (frontend)/               # Public-facing pages (24 routes)
│   │   ├── page.tsx             # Home page (hero + perils + stats + workflow)
│   │   ├── about/page.tsx       # About page
│   │   ├── platform/page.tsx    # Platform capabilities
│   │   ├── verify/page.tsx      # Built to be Verified (cryptographic sealing)
│   │   ├── solutions/page.tsx   # Solutions by role (5 customer personas)
│   │   ├── regulatory/page.tsx  # Regulatory frameworks (Solvency II, NAIC, ORSA, Lloyd's)
│   │   ├── trust/page.tsx       # Trust & Security (verified seal badge)
│   │   ├── validation/page.tsx  # Validation reports
│   │   ├── docs/page.tsx        # Documentation
│   │   ├── security/page.tsx    # Security (static)
│   │   ├── security/vdp/page.tsx # Vulnerability Disclosure Program
│   │   ├── privacy/page.tsx     # Privacy Policy (static)
│   │   ├── terms/page.tsx       # Terms of Service (static)
│   │   ├── cookies/page.tsx     # Cookie Policy (static)
│   │   ├── support/page.tsx     # Support page (static)
│   │   ├── contact/page.tsx     # Contact form
│   │   ├── subprocessors/page.tsx # Subprocessors list
│   │   └── not-found.tsx        # 404 error page
│   │
│   ├── (payload)/                # Payload CMS admin routes
│   │   ├── layout.tsx           # Payload layout wrapper
│   │   └── api/[...slug]/route.ts # CMS proxy
│   │
│   ├── .well-known/             # Security metadata
│   │   └── security.txt/route.ts
│   │
│   ├── api/                      # Public API routes
│   │   ├── contact/route.ts      # Contact form submission (rate-limited, Turnstile)
│   │   ├── privacy-request/route.ts # Privacy requests (rate-limited, Turnstile)
│   │   ├── pages/route.ts        # CMS pages endpoint
│   │   └── webhooks/
│   │       └── crm/route.ts      # CRM webhook stub (audit logged)
│   │
│   ├── layout.tsx                # Root layout (with SiteChrome)
│   ├── error.tsx                 # 500 error page (branded)
│   ├── not-found.tsx             # 404 catch-all
│   ├── robots.ts                 # SEO robots configuration
│   └── sitemap.ts                # Dynamic sitemap generation
│
├── components/                   # Reusable React components
│   ├── marketing/                # Brand-specific components (28 active)
│   │   ├── ProductShowcase.tsx          # Video/image carousel with poster fallback
│   │   ├── VerificationFlow.tsx         # Verification workflow (4-step process)
│   │   ├── RiskEngineShowcase.tsx       # Risk engine feature grid
│   │   ├── QuantumArchitecture.tsx      # Quantum-native architecture diagram
│   │   ├── ComplianceBadge.tsx          # Certification badges (framework status)
│   │   ├── DataCard.tsx                 # Generic data card wrapper
│   │   ├── StatusIndicator.tsx          # Generic status indicator
│   │   ├── PerilStatusIndicator.tsx     # Peril-specific status badge
│   │   ├── DeviceFrame.tsx              # Device chrome mockup
│   │   ├── HeroDeviceFrame.tsx          # Hero device framing
│   │   ├── KPIStrip.tsx                 # KPI metrics display
│   │   ├── TrustBadgeCluster.tsx        # Trust badges cluster
│   │   ├── VerifiedSealBadge.tsx        # Cryptographic seal badge
│   │   ├── SecurityFeaturesGrid.tsx     # Security features 3-column grid
│   │   ├── SecurityComplianceSection.tsx # Security & compliance cards
│   │   ├── PrivacyRequestForm.tsx       # Privacy request form component
│   │   ├── SupportForm.tsx              # Support form component
│   │   ├── CompliancePage.tsx           # Compliance page layout wrapper
│   │   ├── SectionRenderer.tsx          # CMS section dynamic rendering
│   │   ├── WorkflowSteps.tsx            # Multi-step workflow display
│   │   ├── RegulatoryGrid.tsx           # Regulatory frameworks grid
│   │   └── (4 removed: SolutionCard, LightThemeWrapper, unused duplicates)
│   │
│   ├── ui/                      # Generic UI primitives
│   │   └── Button.tsx           # CTA button system
│   │
│   ├── layout/                  # Page layout components
│   │   ├── Header.tsx           # Navigation header (7 nav links)
│   │   ├── Footer.tsx           # Site footer (3-column + copyright)
│   │   ├── SiteChrome.tsx       # Layout wrapper (header + footer + warning banner)
│   │   ├── MobileNav.tsx        # Mobile navigation drawer
│   │   └── CookiePreferencesButton.tsx # Cookie preference control
│   │
│   └── cookie-consent/          # Cookie consent system
│       ├── CookieConsentProvider.tsx
│       └── CookieConsentUI.tsx
│
├── lib/                         # Utilities & helpers (24 active files)
│   ├── cms-fetch.ts            # CMS REST API client (14 fetch functions)
│   ├── cms/
│   │   └── settings.ts         # Settings global fetch (hero, KPIs, branding)
│   ├── metadata.ts             # SEO metadata builder
│   ├── metadata/
│   │   └── schema.ts           # JSON-LD schema generators
│   ├── env.ts                  # Frontend env access (site URL, CMS URL)
│   ├── constants.ts            # Site-wide constants (nav links, compliance links)
│   ├── audit.ts                # Audit logging for form submissions
│   ├── rate-limit.ts           # Sliding-window rate limiter (5 req/min per IP)
│   ├── turnstile.ts            # Cloudflare Turnstile verification
│   ├── hooks/
│   │   └── useReducedMotion.ts # Accessibility: motion preference detection
│   ├── validation/
│   │   ├── schemas.ts          # Zod schemas (contact, privacy-request, forms)
│   │   ├── responses.ts        # API response builders (success, error, ApiErrors)
│   │   └── form-types.ts       # Form type enums + type-specific schemas
│   ├── payload-fetch.ts        # Legacy payload fetch (deprecated)
│   ├── default-sections.ts     # Fallback section data (home, platform, trust, validation)
│   └── (6 removed: payload.ts, payload-client.ts, roles.ts, redirects.ts, turnstile-verify.ts, config/env.ts)
│
├── styles/                      # Global styles
│   └── globals.css             # Tailwind imports + prefers-reduced-motion
│
├── public/                      # Static assets
│   ├── qrs-wordmark.webp
│   └── (placeholder images)
│
├── tailwind.config.ts          # Tailwind config (dark + light themes)
├── next.config.js              # Next.js config (CSP headers, redirects from CMS)
├── tsconfig.json               # TypeScript strict mode
├── .lighthouserc.json          # Lighthouse CI budgets
├── package.json
└── .env.local                  # Environment variables (gitignored)
```

### Component Layers

```
UI Layer (Components)
├── Primitives (ui/)
│   └── Button (CTA system)
│
├── Marketing (marketing/) - 28 active components
│   ├── ProductShowcase (video/image carousel)
│   ├── VerificationFlow (4-step process)
│   ├── RiskEngineShowcase (features)
│   ├── QuantumArchitecture (layers)
│   ├── ComplianceBadge (framework badges)
│   ├── SecurityFeaturesGrid (security cards)
│   ├── SecurityComplianceSection (compliance info)
│   ├── RegulatoryGrid (framework matrix)
│   └── (20 others: data cards, badges, forms)
│
├── Layout (layout/) - 5 components
│   ├── SiteChrome (header/footer wrapper)
│   ├── Header (nav with 7 links)
│   ├── Footer (3-column)
│   ├── MobileNav (responsive)
│   └── CookiePreferencesButton
│
└── Pages (app/(frontend)/*/page.tsx) - 24 public routes
    ├── Home (hero, perils, stats, workflow)
    ├── /verify (Built to be Verified)
    ├── /solutions (5 customer personas)
    ├── /regulatory (4 frameworks)
    ├── /platform (capabilities)
    ├── /trust (security & compliance)
    ├── /about (mission + team)
    ├── /validation (reports + methodology)
    ├── /docs (documentation)
    └── (15 compliance/legal pages)

Data Layer (APIs & CMS Fetching)
├── CMS Fetch (lib/cms-fetch.ts) - 14 functions
│   ├── getPageBySlug()
│   ├── getProductShowcaseItems()
│   ├── getSolutions()
│   ├── getRegulatoryCompliance()
│   ├── getPlatformCapabilities()
│   ├── getDocumentation()
│   ├── getPerilStatuses()
│   └── (7 others)
│
├── Settings (lib/cms/settings.ts)
│   └── getCachedSettings() - Fetch hero content & KPIs from CMS global
│
├── Public API Routes (api/)
│   ├── POST /api/contact (rate-limited, Turnstile)
│   ├── POST /api/privacy-request (rate-limited, Turnstile)
│   ├── POST /api/webhooks/crm (webhook receiver, audit-logged)
│   └── GET /api/pages (CMS pages proxy)
│
└── Security & Validation
    ├── Rate Limiter (5 req/min per IP)
    ├── Turnstile Verifier (CAPTCHA)
    ├── Audit Logger (form submissions)
    ├── Zod Schemas (input validation)
    └── CSP Headers (no unsafe-eval)

Style Layer (Tailwind)
├── Global styles (globals.css)
├── Dark theme (default, ink/teal/cream)
├── Light theme (light-bg-*, light-text-*, etc.)
├── Spacing (py-24 for sections, consistent vertical rhythm)
├── Animations (prefers-reduced-motion aware)
└── Utilities (responsive, accessibility)
```

### Page Flow

```
Homepage (/) - Hero + Perils + Stats + Workflow
├── Hero Section
│   ├── H1: "Run catastrophe models in seconds"
│   ├── Subtitle: "Every number cryptographically signed and independently verifiable"
│   └── CTAs: "Request Demo" → /platform, "Request Validation Report" → https://ssrn.com
├── Peril Grid (ACTIVE/VALIDATED + ILLUSTRATIVE + ROADMAP sections)
│   ├── ACTIVE: Hurricane (validated)
│   ├── ILLUSTRATIVE: Flood, Earthquake, Severe Convective Storm, Wildfire
│   └── ROADMAP: Cyber, Space Weather
├── Verifiable by Design section
├── AI-Native Architecture section
├── The Crisis section (stats: $10B+ LA wildfires, $8-12B excess capital)
├── How It Works (4-step workflow)
├── Validation Methodology (SSRN study + third-party audit)
└── Enterprise CTA section

Platform Page (/platform) - Capabilities + Risk Engine
├── Hero (title + description)
├── How QRS Works (4-step workflow)
├── The Risk Engine (6-feature grid)
├── Product Evidence (3 screenshot galleries)
├── Quantum-Native Engine (text + image)
├── AI-Assisted Intelligence (3-feature grid)
├── Built for Compliance (4 regulatory frameworks)
└── Enterprise Integration (4 integration types)

Verify Page (/verify) - Built to be Verified
├── Hero (cryptographic sealing explanation)
├── Lineage Verified Seal (4-point bullet list)
├── Verification Workflow (3-step process)
├── Why Verification Matters (4 value propositions)
└── CTA: "Request Demo" → /contact

Solutions Page (/solutions) - Solutions by Role
├── Hero (5 customer personas intro)
├── Solutions Grid (5 role cards with features)
│   ├── Underwriters (4 features)
│   ├── Portfolio Managers (4 features)
│   ├── Reinsurance Buyers (4 features)
│   ├── ILS Managers (4 features)
│   └── CROs (4 features)
└── CTA: "Request Demo" → /contact

Regulatory Page (/regulatory) - Regulatory & Compliance
├── Hero (frameworks overview)
├── Regulatory Frameworks Grid (4 frameworks)
│   ├── Solvency II (EU)
│   ├── NAIC RBC (US)
│   ├── ORSA (Multi-Region)
│   └── Lloyd's/BMA (Bermuda)
├── Compliance Approach (4 pillars)
├── Governance & Control (4 cards)
└── CTA: "Request Demo" → /contact

Trust Page (/trust) - Security & Compliance
├── Hero
├── Security & Compliance (2-column: seal explanation + trust badges)
├── Security Features (3-column grid)
└── Compliance Certifications

Validation Page (/validation) - Validation Reports
├── Hero
├── Validation Reports (2-column: SSRN + Third-Party Audit)
└── Validation Methodology (3-step process)

About Page (/about) - Mission & Team
├── Hero
├── Mission section
├── Why Verifiable section
└── Team section
```

---

## CMS Architecture (`qrs-cms/`)

### Directory Structure

```
qrs-cms/
├── collections/                   # Payload CMS collections (19 active)
│   ├── Users.ts                  # User management + RBAC + password validation
│   ├── Pages.ts                  # Generic CMS pages
│   ├── Blog.ts                   # Blog posts
│   ├── Media.ts                  # Images/PDFs
│   ├── ProductShowcase.ts        # Product demo content
│   ├── Solutions.ts              # Role-based solutions (5 personas)
│   ├── RegulatoryCompliance.ts   # Regulatory frameworks
│   ├── PlatformCapability.ts     # Platform capabilities
│   ├── Documentation.ts          # Technical documentation
│   ├── PerilStatus.ts            # Peril/model status (7 perils: Hurricane validated, 4 illustrative, 2 roadmap)
│   ├── ValidationReports.ts      # Validation reports
│   ├── Redirects.ts              # URL redirects (301/302 from WordPress)
│   ├── FormSubmissions.ts        # Form submission logs (audit trail)
│   ├── AuditLogs.ts              # Append-only audit trail (SOC 2)
│   ├── EmailSettings.ts          # Email configuration
│   ├── EmailLogs.ts              # Email send logs
│   ├── PageSections.ts           # Page section blocks (CMS-driven content)
│   └── (1 removed: ValidationReports duplicate handling)
│
├── globals/                       # Payload CMS globals (singletons)
│   ├── TrustCenter.ts            # Trust center information
│   └── Settings.ts               # Site settings (hero content, KPIs, branding)
│
├── lib/                           # CMS utilities
│   └── rbac/
│       └── roles.ts              # RBAC system (5-role hierarchy, 14 permissions)
│
├── hooks/                         # Lifecycle hooks
│   └── auditLog.ts               # Audit logging hook
│
├── payload.config.ts             # CMS configuration
├── tsconfig.json
├── package.json
└── .env.local                    # DATABASE_URL, JWT_SECRET, etc
```

### CMS Collections Overview

| Collection | Purpose | RBAC Permission | Published | Audit Logged |
|------------|---------|-----------------|-----------|--------------|
| **Users** | User management + auth | users:* | N/A | ✓ |
| **ProductShowcase** | Hero/demo content | content:* | Yes (published) | ✓ |
| **Solutions** | Role-specific pages | content:* | Yes (published) | ✓ |
| **RegulatoryCompliance** | Framework info | content:* | Yes (published) | ✓ |
| **PlatformCapability** | Features catalog | content:* | Yes (published) | ✓ |
| **PerilStatus** | Peril/model status | content:* | Yes (published) | ✓ |
| **Pages** | Generic pages | content:* | Yes (published) | ✓ |
| **Documentation** | Technical docs | content:* | Yes (published) | ✓ |
| **FormSubmissions** | Form logs | forms:read | No (API only) | ✓ |
| **AuditLogs** | Audit trail | audit:read | N/A (append-only) | ✓ |
| **Blog** | Blog posts | content:* | Yes (published) | ✓ |
| **Media** | Images/PDFs | content:* | N/A | ✓ |
| **ValidationReports** | Validation docs | content:* | Yes (published) | ✓ |
| **Redirects** | URL redirects | content:* | N/A (active) | ✓ |

---

## Data Flow

### Frontend → CMS → Database

```
1. Page Load (Homepage)
   ├── Next.js Server Component
   ├── Calls: getProductShowcaseItems() from lib/cms-fetch.ts
   ├── CMS REST API: GET /api/products?published=true
   ├── Payload returns: {docs: [{id, title, imageUrl, ...}]}
   └── React renders: <ProductShowcase key={id} {...product} />

2. CMS Page Load (/platform)
   ├── Server Component
   ├── Calls: getCachedSettings() + getPageBySlug('platform')
   ├── CMS REST API: GET /api/globals/settings + GET /api/pages?slug=platform
   ├── Returns: hero content, KPIs, platform capabilities
   └── React renders: Hero with settings + capabilities grid

3. Form Submission (Contact)
   ├── Client: User fills form + passes Turnstile verification
   ├── Client: POST /api/contact {name, email, message, turnstileToken}
   ├── API Route (api/contact/route.ts):
   │   ├── Rate limit check: 5 req/min per IP
   │   ├── Turnstile verify via Cloudflare API
   │   ├── Zod schema validation (name ≥2, email format, message ≥10)
   │   ├── INSERT form_submissions (form_type='contact', email, ip_address, turnstile_verified=true)
   │   ├── INSERT audit_logs (table_name='form_submissions', action='create', ip_address, timestamp)
   │   └── Return: 200 {success: true}
   └── Client: Show success message

4. CMS Admin (Edit Pages)
   ├── Admin logs in: POST /api/auth/login {email, password}
   ├── Payload CMS auth: validates credentials, returns JWT
   ├── Admin edits: ProductShowcase collection
   ├── Admin publishes: Triggers cache revalidation
   ├── Frontend fetches fresh data: Cache invalidated after 1 hour (or on-demand revalidation)
   └── Changes appear on site within revalidation window

5. Settings Update (Hero Content)
   ├── Admin edits: Settings global {hero: {title, subtitle, cta_text, background_image}}
   ├── Admin publishes: changes saved
   ├── Frontend fetches: getCachedSettings() (revalidate: 3600)
   ├── Hero component receives: new title, subtitle, KPIs
   └── Homepage renders: updated hero section
```

### CMS Redirect Flow

```
User requests: https://qrs.io/old-wordpress-url
   ├── Next.js next.config.js runs redirects() function
   ├── Fetch Redirects collection: GET /api/redirects?sourcePath=/old-wordpress-url
   ├── Payload returns: {sourcePath: '/old-wordpress-url', destinationPath: '/verify', type: '301'}
   ├── Next.js returns: 301 redirect to /verify
   └── Browser navigates to: https://qrs.io/verify
```

---

## Security & Compliance (Phase 5)

### Rate Limiting (P0-005)

**Implementation:** `lib/rate-limit.ts`

```
Protected Endpoints:
  POST /api/contact          → 5 requests per 60 seconds per IP
  POST /api/privacy-request  → 5 requests per 60 seconds per IP

Behavior:
  ✓ Sliding-window rate limiter (tracks per IP)
  ✓ Returns 429 Too Many Requests if exceeded
  ✓ Includes Retry-After: 60 header
  ✓ Per-endpoint tracking (independent buckets)
```

### Turnstile Verification (P0-002)

**Implementation:** `lib/turnstile.ts`

```
Protected Endpoints:
  POST /api/contact
  POST /api/privacy-request

Flow:
  1. Frontend: Display Turnstile widget → capture token
  2. Frontend: Send token with form data
  3. Backend: Verify token against Cloudflare API
  4. Backend: Store turnstile_verified flag with submission
  5. Database: Audit log entry created
```

### Audit Logging (P0-003)

**Implementation:** `lib/audit.ts`

```
Schema:
  user_id, table_name, record_id, action, changes (JSON), ip_address, timestamp

Logged Actions:
  ✓ Form submission (contact, privacy-request)
  ✓ CMS operations (create, update, delete, publish)
  ✓ User management (create, update, delete)

Access Control:
  read:   audit:read permission (admin+ only)
  update: disabled (append-only trail)
```

### Input Validation (P1-002, P1-001)

**Implementation:** `lib/validation/schemas.ts`

```
Form Schemas:
  contactFormSchema:       {name (≥2), email, message (≥10), turnstileToken}
  privacyRequestSchema:    {email, requestType, description (≥10), turnstileToken}
  
Auth Validation (CMS):
  Password:               ≥8 characters
  Email:                 Format validation (@domain.com)
  
Validation Returns:
  ✓ 400 VALIDATION_ERROR with field-level errors
  ✓ 400 Turnstile failure
  ✓ 429 Rate limit exceeded
```

### CSP Headers (P1-004)

**Implementation:** `next.config.js`

```
Script sources:
  script-src 'self'                      (no unsafe-eval)

Style sources:
  style-src 'self' 'unsafe-inline'       (Tailwind only)

Image sources:
  img-src 'self' data: https: [CMS_URL]

Other:
  default-src 'self'
  object-src 'none'
  frame-ancestors 'self'
```

### Metadata & SEO (P1-011)

**Implementation:** `lib/metadata/schema.ts`

```
JSON-LD Schemas:
  ✓ Organization schema (name, URL, logo, contact)
  ✓ BreadcrumbList (for navigation)
  ✓ SoftwareApplication (product info)

OG/Twitter Tags:
  ✓ og:title, og:description, og:image
  ✓ twitter:card, twitter:image
  ✓ Canonical URLs
```

### Accessibility (P1-006)

**Implementation:** `lib/hooks/useReducedMotion.ts` + `globals.css`

```
Motion Preferences:
  ✓ useReducedMotion hook for client components
  ✓ ProductShowcase respects prefers-reduced-motion
  ✓ Global CSS: @media (prefers-reduced-motion: reduce) disables all animations
  ✓ HeroDeviceFrame supports static fallback (no autoplay)
```

---

## Deployment Status

### Phase 5 (Current)

**Completed:**
- ✅ Frontend audit: removed 8 unused files, fixed duplicate code
- ✅ New pages: /verify, /solutions, /regulatory (all with improved spacing)
- ✅ Peril grid: 7 perils with correct status labels (ACTIVE/VALIDATED, ILLUSTRATIVE, ROADMAP)
- ✅ Crisis statistics: corrected ($10B+ for LA wildfires only, removed 300% and 14x)
- ✅ All emojis removed from components and data
- ✅ Section spacing: standardized to py-24 for vertical rhythm
- ✅ Lighthouse budgets: configured (.lighthouserc.json)
- ✅ Accessibility: prefers-reduced-motion support complete
- ✅ Redirects: next.config.js fetches from CMS

**P1 Items In Progress (11 remaining):**
- P1-008: Hero content + KPIs from CMS (Settings global created)
- P1-009: 6 new form types (Zod schemas ready)
- P1-012: CRM webhook stub (implemented)

**Ready for Production:**
- ✅ Both servers running (frontend 3000, CMS 3001)
- ✅ TypeScript: clean build
- ✅ Form validation: Zod + rate limiting + Turnstile
- ✅ Audit logging: all form submissions tracked
- ✅ RBAC: 5-role system enforced on CMS collections
- ✅ Security headers: CSP, HSTS, X-Frame-Options, etc.

---

## Performance Targets

### Lighthouse Metrics
- **Performance:** ≥90
- **Accessibility:** ≥95 (WCAG AA)
- **Best Practices:** ≥95
- **SEO:** ≥95

### Build Output
```
Next.js 16.2.10 with Turbopack
├── 24 static pages (pre-rendered)
├── 3 dynamic routes (CMS-driven)
└── Zero console errors
```

---

## Frontend Cleanup (Session Summary)

**Files Removed (8 total):**
- Components: SolutionCard.tsx, LightThemeWrapper.tsx
- Lib: roles.ts, redirects.ts, payload.ts, payload-client.ts, turnstile-verify.ts, config/env.ts

**Code Quality:**
- ✅ Removed 500+ lines of duplicate code
- ✅ Eliminated security risk (removed backend secrets from frontend)
- ✅ Simplified CMS client architecture (single source: cms-fetch.ts)
- ✅ Consistent spacing across all new pages

---

## Next Steps (Post-Phase 5)

**P1 Items (7 remaining):**
- P1-008: Wire Settings global into hero component
- P1-009: Create API routes for 6 form types
- P1-012: Finalize CRM webhook integration

**P2 Items (11 remaining):**
- Test suite (Vitest + Playwright)
- Structured logging
- Monorepo tooling
- ESLint/Prettier unification
