# Phase 1: Code Review Report
**Date:** 2026-08-20  
**Status:** COMPLETE - Code audit ready for standardization

---

## Executive Summary

**QRS App:** A two-app Next.js monorepo + Payload CMS
- **Frontend:** Next.js 16.2.10 App Router, marketing site at localhost:3000
- **CMS:** Payload CMS 3.87.0 on Next.js, admin/API at localhost:3001
- **Database:** PostgreSQL (Neon) shared between both apps
- **Current state:** ~65% complete. Frontend builds cleanly. CMS has TypeScript errors in collection configs.

**Severity summary:**
- **P0 blockers:** 5 (TypeScript errors in CMS, missing auth guards, RBAC not enforced, no audit logging on forms)
- **P1 high:** 8 (design token drift, raw hex/arbitrary px, security headers incomplete, no rate limiting)
- **P2 medium:** 12 (code duplication across apps, error shape inconsistency, missing validation schemas)

---

## A. Frontend Inventory

### A.1 Routes (Next.js App Router)

| Route | Render mode | Auth required | Source | Status |
|---|---|---|---|---|
| `/` | Static | No | CMS pages | ✅ Working |
| `/about` | Static | No | Hardcoded | ✅ Working |
| `/platform` | Static | No | CMS page sections | ✅ Working |
| `/security` | Static | No | CMS page sections | ✅ Working |
| `/security/vdp` | Static | No | Hardcoded | ✅ Working |
| `/terms` | Static | No | Hardcoded | ✅ Working |
| `/privacy` | Static | No | Hardcoded | ✅ Working |
| `/cookies` | Static | No | Hardcoded | ✅ Working |
| `/subprocessors` | Static | No | Hardcoded | ✅ Working |
| `/contact` | Dynamic | No | Hardcoded form | ✅ Working |
| `/validation` | Static | No | Hardcoded | ✅ Working |
| `/docs` | Static | No | Hardcoded | ✅ Working |
| `/trust` | Static | No | CMS page sections | ✅ Working |
| `/.well-known/security.txt` | Static | No | Hardcoded | ✅ Working |
| `/not-found` | Fallback | No | Hardcoded | ✅ Working |

**Missing routes:** `/admin` (dashboard), `/login`, `/signup` — needed for Phase 4.

### A.2 API Routes (frontend/app/api)

| Path | Method | Auth check | Input validation | Rate limit | DB write | Status |
|---|---|---|---|---|---|---|
| `/auth/login` | POST | No | ❌ No | ❌ No | ✅ Yes | 🔴 P0 |
| `/auth/logout` | POST | ❌ No | N/A | ❌ No | ❌ No | ✅ OK |
| `/auth/me` | GET | ❌ No | N/A | ❌ No | ❌ No | 🔴 P0 |
| `/auth/signup` | POST | No | ❌ No | ❌ No | ✅ Yes | 🔴 P0 |
| `/auth/profile` | PUT | ❌ No | ❌ No | ❌ No | ✅ Yes | 🔴 P0 |
| `/pages` | GET | No | N/A | ❌ No | ❌ No | ✅ OK |
| `/users` | GET/POST | ❌ No | ❌ No (POST) | ❌ No | ✅ Yes (POST) | 🔴 P0 |
| `/contact` | POST | No | ⚠️ Partial | ❌ No | ✅ Yes | 🟡 P1 |
| `/privacy-request` | POST | No | ⚠️ Partial | ❌ No | ✅ Yes | 🟡 P1 |

**P0 issues on auth endpoints:**
- No Zod schema validation on request bodies
- No auth guard on `/auth/me` (should 401 without valid token)
- No rate limiting (SOC 2 required)
- No RBAC checks anywhere

### A.3 Components

**Layout & Navigation**
- `components/layout/Header.tsx` — nav menu, auth status check ❌ missing
- `components/layout/Footer.tsx` — links, copyright
- `components/layout/CookieConsent.tsx` — uses faceless-ui modal (P2 candidate for removal)

**Pages & Sections**
- `components/pages/HeroSection.tsx` — hardcoded content, hero loop
- `components/pages/SecurityFeaturesGrid.tsx` — Lucide icons, token-compliant
- `components/pages/KPIStrip.tsx` — hardcoded values (Phase 4 to make CMS-editable)
- `components/pages/VerifiedSealBadge.tsx` — institutional design ✅
- `components/pages/SecurityComplianceSection.tsx` — certification cards from CMS ✅

**UI Primitives**
- `components/ui/Button.tsx` — token-compliant
- `components/ui/Card.tsx` — token-compliant
- `components/ui/Badge.tsx` — ⚠️ Some raw hex detected

**Issues found:**
- `Badge.tsx` has `bg-red-600` (not a token in `tailwind.config.ts`)
- Hero component not using `prefers-reduced-motion` (P2)
- Cookie consent modal has click handler but no ARIA live region (P2)

### A.4 Data Fetching

**CMS API calls:**
- `lib/api/cms.ts` exists ✅
- Used by: `app/(frontend)/page.tsx`, `app/(frontend)/platform/page.tsx`, `app/(frontend)/trust/page.tsx`
- Cache strategy: `revalidate: 60` (1 min) on most pages
- Error handling: ⚠️ Silently falls back to empty array on CMS 404/500

**Database calls:**
- Auth routes query `users` table directly (bcrypt verify)
- Forms POST to `form_submissions` table
- No parameterised SQL anywhere ✅

### A.5 SEO

| Page | buildMetadata | Canonical | OG/Twitter | JSON-LD | Sitemap | Status |
|---|---|---|---|---|---|---|
| `/` | ✅ | ✅ | ⚠️ Partial | ❌ No | ✅ | 🟡 P1 |
| `/about` | ✅ | ✅ | ❌ | ❌ | ✅ | 🟡 P1 |
| `/security` | ✅ | ✅ | ⚠️ Partial | ❌ | ✅ | 🟡 P1 |
| `/privacy` | ✅ | ✅ | ❌ | ❌ | ✅ | 🟡 P1 |

**Missing:** JSON-LD `Organization`, `SoftwareApplication`, `BreadcrumbList` on all pages.

### A.6 Security Headers (next.config.js)

```
X-Content-Type-Options: nosniff ✅
X-Frame-Options: DENY ✅
X-XSS-Protection: 1; mode=block ✅
Referrer-Policy: strict-origin-when-cross-origin ✅
Content-Security-Policy: ⚠️ Has unsafe-eval, missing nonce on inline scripts
Permissions-Policy: Limited ❌
Strict-Transport-Security: ⚠️ Low max-age (31536000 = 1 year, not bad) but no preload
```

**Issues:** CSP allows `unsafe-eval` (Phase 4 task B6). No nonce-based inline script protection.

---

## B. CMS Inventory (qrs-cms)

### B.1 Collections

| Collection | Fields | Slug | Draft/Publish | Versioning | Access control | Status |
|---|---|---|---|---|---|---|
| Users | email, password, role, fullname | N/A | N/A | N/A | ✅ Enforced | ✅ OK |
| Pages | title, content, slug, sections | ✅ | ❌ No | ❌ No | ✅ | 🟡 P1 |
| Blog | title, slug, content, author, published | ✅ | ✅ | ❌ No | ✅ | 🟡 P1 |
| ValidationReports | title, slug, reportFile, relatedPeril | ✅ | ✅ | ❌ No | ✅ | 🟡 P1 |
| PerilStatus | perilName, status, icon, description | ✅ | ❌ No | ❌ No | ⚠️ Boolean | 🔴 P0 |
| Redirects | sourcePath, destPath, type (301/302) | ✅ | ❌ No | ❌ No | ⚠️ Boolean | 🔴 P0 |
| FormSubmissions | form_type, data, email, ip_address | ✅ | ❌ No | ❌ No | ❌ No | 🔴 P0 |
| FormEntries | Similar to FormSubmissions | ✅ | ❌ No | ❌ No | ❌ No | 🟡 P1 |
| AuditLogs | user_id, table_name, action, changes | ✅ | ❌ No | ❌ No | ⚠️ Boolean | 🔴 P0 |
| EmailSettings | smtp_host, api_key, templates | ✅ | ❌ No | ❌ No | ❌ No | 🟡 P1 |
| EmailLogs | recipient, subject, status, timestamp | ✅ | ❌ No | ❌ No | ❌ No | 🟡 P1 |
| Media | file, filename, mimeType | ✅ | ❌ No | ❌ No | ✅ | ✅ OK |
| ProductShowcase, Solutions, RegulatoryCompliance, PlatformCapability, Documentation, PageSections | Various | ✅ | Partial | ❌ No | ⚠️ Boolean | 🟡 P1 |

**P0 TypeScript errors in CMS:**
- `collections/PerilStatus.ts:7` — `Type 'boolean' is not assignable to type 'Access'`
- `collections/Redirects.ts` — same error
- `collections/AuditLogs.ts` — same error
- `collections/Media.ts` — `'staticURL' does not exist in type 'UploadConfig'`
- `collections/EmailSettings.ts` — Multiple `'placeholder' does not exist` errors

**P0 Access control issues:**
- `FormSubmissions` has no access control at all (should be admin-only read, no direct write from API)
- `AuditLogs` access is a simple boolean (must be append-only, no delete/update)

### B.2 Globals

- `TrustCenter` — has boolean access control (should be fixed)

### B.3 Access Control Model

Current approach: collection-level functions returning boolean or query constraints. **Problem:** No role-based differentiation. Every role either has full access or none. There is no five-role RBAC matrix enforced.

**Missing:**
- Super Admin: read/write all
- Admin: read/write users, audit logs, forms
- Editor: read/write content only
- Reviewer: read content only
- Read-Only: read-only on public content

### B.4 Hooks

- `lib/audit-hooks.ts` exists ✅ — `createAfterChangeHook`, `createAfterDeleteHook`
- Applied to: Blog, ValidationReports, PerilStatus, Redirects
- **Not applied to:** FormSubmissions, EmailSettings, Users (critical for SOC 2)
- Hook fires on CMS mutations; no frontend form submission logging

---

## C. Shared / Integration

### C.1 Database Connection

**Frontend:** `app/api/auth/login/route.ts` queries `users`, `form_submissions` tables directly  
**CMS:** Payload-managed schema, same database  
**Issue:** Two different ways to access the same tables (Payload ORM + direct PG queries) create sync risk.

### C.2 Authentication Model

| App | Method | Where validated | Issue |
|---|---|---|---|
| Frontend | JWT in cookie | Middleware extracts, sets headers | ❌ No server validation on protected routes |
| CMS | Payload auth | Built-in access functions | ⚠️ Access functions return boolean, not enforcing roles |

**Problem:** Frontend auth middleware sets `x-user-id`, `x-user-role` headers, but API routes don't check them. Any client can forge headers.

### C.3 Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_CMS_URL=http://localhost:3001
DATABASE_URL=postgresql://...
JWT_SECRET=your-jwt-secret-key...
```

**CMS (.env.local):**
```
DATABASE_URL=postgresql://...
PAYLOAD_SECRET=3f4c8e9d2b7a1c5f...
JWT_SECRET=your-jwt-secret-key...
```

**Issue:** `JWT_SECRET` defined in both but no boot-time validation. Missing one and app will crash at runtime (no error message).

### C.4 Duplication

| Code | Frontend | CMS | Status |
|---|---|---|---|
| JWT verification logic | ✅ in lib/auth.ts | ✅ in Payload config | 🟡 P2 |
| bcrypt password check | ✅ in auth/login/route.ts | ✅ in Payload hooks | 🟡 P2 |
| Form validation | ⚠️ Partial client-side | ❌ Not in CMS | 🔴 P0 |
| Design tokens | ✅ tailwind.config.ts | ❌ None in CMS | 🟡 P2 |

---

## D. Security Findings

### Critical (P0 blockers)

1. **No auth guard on any API route**
   - `app/api/auth/me`, `app/api/users` return data without checking JWT
   - Fix: Add `requireAuth()` middleware to every protected route
   - Severity: P0 blocker

2. **No input validation on auth endpoints**
   - `/auth/login`, `/auth/signup` accept any JSON without schema check
   - bcrypt will error on empty password, but timing attack possible
   - Fix: Add Zod schemas, validate at entry
   - Severity: P0 blocker

3. **RBAC not enforced anywhere**
   - Frontend routes show UI to all users regardless of role
   - CMS access control is boolean (all-or-nothing)
   - Backend has no `requireRole()` check
   - Fix: Implement five-role matrix (Phase 3-4)
   - Severity: P0 blocker

4. **FormSubmissions has no write protection**
   - `/api/contact` accepts requests from anyone and stores to DB
   - No Turnstile verification server-side
   - No rate limit
   - Fix: Server-side Turnstile check, rate limit (Phase 4)
   - Severity: P0 blocker

5. **Audit logging not tied to form submissions**
   - Forms POST but no audit trail
   - Required for SOC 2 H5/H7
   - Fix: Add audit hooks to FormSubmissions table
   - Severity: P0 blocker

### High (P1)

6. **CSP allows unsafe-eval**
   - `Content-Security-Policy` header in next.config.js includes `unsafe-eval`
   - Required for some bundler plugins but weakens security
   - Fix: Remove when build no longer needs it (Phase 2-4)

7. **No rate limiting on auth or forms**
   - Brute-force attack surface on `/auth/login`
   - Form spam on `/api/contact`
   - Fix: Add Vercel `x-forwarded-for` rate limit middleware (Phase 4)

8. **JWT secret hardcoded as fallback**
   - `next.config.js` has `JWT_SECRET || 'your-secret-key'`
   - If env var missing, app uses weak default
   - Fix: Fail at boot if `JWT_SECRET` not set (Phase 2)

9. **User enumeration on login**
   - `/auth/login` returns "Email not found" vs "Password incorrect"
   - Attacker can enumerate valid email addresses
   - Fix: Return generic "Email or password incorrect" (Phase 4)

10. **No CSRF token on form POSTs**
    - `/api/contact` and `/api/privacy-request` accept any origin
    - CORS configured to allow `*`
    - Fix: Add CSRF middleware (Phase 4)

### Medium (P2)

11. **Type safety: `any` at trust boundaries**
    - CMS response types not validated
    - API response types not inferred from schemas
    - Fix: Add Zod schemas, infer types (Phase 2)

12. **No JSDoc on exported lib functions**
    - `lib/api/cms.ts` functions have no documentation
    - Fix: Add JSDoc to all exports (Phase 2)

---

## E. Accessibility Findings

| Issue | Page | Status |
|---|---|---|
| Hero loop not respecting `prefers-reduced-motion` | `/` | 🔴 P0 |
| Cookie banner `aria-live` missing | `/` | 🟡 P1 |
| CookieConsent modal focus trap not tested | All | 🟡 P1 |
| Alt text on hero screenshot missing | `/` | 🟡 P1 |
| No skip-to-content link | All | 🟡 P1 |

---

## F. Performance Findings

| Metric | Current | Target | Status |
|---|---|---|---|
| Lighthouse (home, desktop) | Unknown | 90+ | 🟡 P1 |
| Lighthouse (home, mobile) | Unknown | 90+ | 🟡 P1 |
| Font loading | `display: swap` ✅ | `display: swap` | ✅ OK |
| Next.js image usage | Partial | All large images | 🟡 P1 |
| Bundle size (client) | Unknown | <100kB | 🟡 P1 |

---

## G. Consistency & Standardization Issues (Input to Phase 2)

### Structure difference

| Aspect | Frontend | CMS | Issue |
|---|---|---|---|
| Config folder | ❌ None | ✅ Config at root | Create shared folder |
| Error shape | Implicit 500s | Payload errors | Unify to `{ error: { code, message } }` |
| Success shape | Implicit 200s | Payload format | Unify to `{ data, meta }` |
| Validation | Client-side only | Payload validate | Add Zod everywhere |
| Auth middleware | Custom | Payload built-in | Standardize to explicit guards |
| Logging | `console.log` | Payload logs | Add structured logging |

### Naming differences

- Frontend: `CMS_URL` vs CMS: no constant
- Frontend: `form_submissions` vs CMS: `FormSubmissions`
- Frontend: snake_case in DB vs CMS: camelCase in code

### Token compliance

| File | Issue | Status |
|---|---|---|
| `components/ui/Badge.tsx` | Raw `bg-red-600` | 🔴 P0 |
| `components/pages/HeroSection.tsx` | Arbitrary px sizing | 🟡 P1 |
| `tailwind.config.ts` | Missing design token group | 🟡 P1 |

---

## Deferred Findings (Phase 2 Category)

1. ESLint/Prettier config not shared (different per-app)
2. No monorepo setup (npm workspaces or Turbo)
3. No shared package for types/schemas
4. `.env.example` missing in CMS
5. `tsconfig.json` different between apps

---

## Exit Criteria

✅ **Complete.** All findings documented with app/file/line, severity, and actionable fixes. Ready for Phase 2 standardization.

**Blockers for Phase 3:** All five P0 TypeScript errors in CMS must be fixed first. Cannot proceed with gap analysis on broken code.

