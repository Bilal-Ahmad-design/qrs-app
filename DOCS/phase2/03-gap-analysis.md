# Phase 3: Gap Analysis
**Date:** 2026-08-21  
**Status:** COMPLETE - Backlog ready for Phase 4 implementation

---

## Executive Summary

This document reconciles three sources of truth:
1. **Phase 1 findings** - What exists and what's broken
2. **Phase 2 deferrals** - Standardization work deferred to Phase 4
3. **PRD section 3 + SOC 2 checklist** - Required features and compliance

**Result:** 28 prioritized gaps ordered by: SOC 2 cutover blockers → security → required before DNS → quality/hardening.

**Severity distribution:**
- **P0 (blockers):** 5 items — must complete before production
- **P1 (required):** 12 items — required before DNS cutover
- **P2 (quality):** 11 items — post-launch hardening

---

## Tier 1: P0 SOC 2 Cutover Blockers

| ID | Gap | App | Source | Effort | Acceptance Criteria | Status |
|---|---|---|---|---|---|---|
| **P0-001** | Auth system missing role-based access enforcement | Both | Phase 1 review + PRD 3.1 | M | Five-role matrix (Super Admin, Admin, Editor, Reviewer, Read-Only) enforced on every API route and CMS collection; unauthenticated users receive 401; insufficient role receives 403 | Not started |
| **P0-002** | Form submissions writable by anyone; no Turnstile verification | Frontend | Phase 1 review + PRD 3.4 | M | Server-side Turnstile verification on `/api/contact`, `/api/privacy-request`; POST rejected if token invalid; every form submission stored with `turnstile_verified` flag | Not started |
| **P0-003** | No audit logging on form submissions; missing audit trail for H5/H7 | Both | Phase 1 review + SOC 2 H5/H7 | S | Every form submission (`contact`, `privacy-request`) writes to `audit_logs` with user_id (null for anonymous), table_name, action, changes, ip_address, timestamp; no delete/update paths on audit table | Not started |
| **P0-004** | CMS collections lack proper RBAC access control | CMS | Phase 1 review + PRD 3.1 | S | All collections enforce role-based access functions; FormSubmissions/AuditLogs are admin-only read; no write from API | Not started |
| **P0-005** | Rate limiting missing on auth and form endpoints | Frontend | Phase 1 review + PRD 3.7 | M | Implement sliding-window rate limit on `/api/auth/login`, `/api/auth/signup`, `/api/contact`, `/api/privacy-request`; return 429 after 5 attempts/minute per IP; reject requests with no IP header | Not started |

---

## Tier 2: P1 Required Before DNS Cutover

| ID | Gap | App | Source | Effort | Acceptance Criteria | Status |
|---|---|---|---|---|---|---|
| **P1-001** | Input validation missing on auth endpoints | Frontend | Phase 1 review + Phase 2 deferral | S | Use `loginSchema`, `signupSchema` from `lib/validation/schemas.ts`; validate email format, password ≥8 chars; return `{ error: { code: 'VALIDATION_ERROR', message, details } }` shape on 400 | Not started |
| **P1-002** | Form endpoint validation incomplete | Frontend | Phase 1 review + Phase 2 deferral | S | Use `contactFormSchema`, `privacyRequestSchema`; validate email, required fields, message length ≥10 chars; return validation errors via `handleValidationError()` helper | Not started |
| **P1-003** | User enumeration attack on login endpoint | Frontend | Phase 1 review + PRD 3.2 | S | Change `/api/auth/login` 401 message from "Email not found" to generic "Email or password incorrect" for all failure cases (email not found, password wrong) | Not started |
| **P1-004** | CSP header allows unsafe-eval; no nonce on inline scripts | Frontend | Phase 1 review + PRD 3.12 | M | Remove `unsafe-eval` from CSP header in next.config.js; add nonce to any inline `<script>` tags; ship in Report-Only first, review reports, then enforce | Not started |
| **P1-005** | Lighthouse budgets not enforced as CI check | Frontend | PRD 3.6 + Phase 1 review | S | Wire `.lighthouserc.json` to CI (GitHub Actions); enforce Perf ≥90, A11y ≥95, BP ≥95, SEO ≥95 on `/`, `/privacy`, `/terms`, `/security`, `/security/vdp` desktop and mobile; fail PR if any budget exceeded | Not started |
| **P1-006** | Hero loop not respecting prefers-reduced-motion | Frontend | Phase 1 review + PRD 3.5 | S | Add `@media (prefers-reduced-motion: reduce)` to hero loop animation; substitute poster image for autoplay video when reduce-motion is set | Not started |
| **P1-007** | Missing 301 redirect map from WordPress | Frontend | PRD 3.8 | M | Build redirect middleware consuming Redirects collection; crawl old site, capture 100+ URLs; store as rows; test zero 404s on old URLs; document redirect reasons | Not started |
| **P1-008** | Real hero content missing; hardcoded KPI values | Frontend | PRD 3.9 + Phase 1 review | M | Replace placeholder hero with de-identified `app.qrsrisk.com` screenshot (2x WebP + poster); move KPI values (Portfolio TIV, VaR 99.5%, TVaR, Capital Headroom) to CMS `Settings` collection; fetch at build time | Not started |
| **P1-009** | Missing form types (Demo, RFP, Newsletter, etc.) | Frontend | PRD 3.10 | M | Create 6 new forms: Demo Request, Validation Report Request, Newsletter, General Contact, Press Inquiry, RFP, Partner Inquiry; each with Turnstile, storage, mailbox routing, Privacy/Terms links, `aria-live` status | Not started |
| **P1-010** | No branded 404/500 pages | Frontend | PRD 3.11 | S | Create `app/not-found.tsx` and `app/error.tsx` with QRS branding, nav, helpful links; return correct HTTP status codes | Not started |
| **P1-011** | JSON-LD and OG/Twitter metadata incomplete | Frontend | Phase 1 review + PRD 3.17 | M | Add JSON-LD (`Organization`, `SoftwareApplication`, `BreadcrumbList`) to all five P0 pages; complete OG/Twitter tags (image, card type, url); verify with opengraph.io | Not started |
| **P1-012** | CRM webhook stub missing | Frontend | PRD 3.13 | S | Create `/api/webhooks/crm` POST endpoint; document payload contract; log webhook calls for audit; no-op implementation ready for integration | Not started |

---

## Tier 3: P2 Quality & Post-Launch Hardening

| ID | Gap | App | Source | Effort | Acceptance Criteria | Status |
|---|---|---|---|---|---|---|
| **P2-001** | No structured server-side logging | Both | Phase 2 deferral | M | Implement request ID tracking; log to stdout with JSON format; include method, path, status, duration, user_id; correlate frontend errors to logs | Not started |
| **P2-002** | Test suite missing (unit, integration, E2E) | Both | PRD 3.16 | L | Vitest for lib/ functions + API routes (target 80%+ coverage on lib/); Playwright E2E for signup → login → form submit flow; @axe-core/playwright for a11y on P0 pages | Not started |
| **P2-003** | Token compliance: raw hex and arbitrary px in components | Frontend | Phase 1 review + Phase 2 deferral | S | Audit all components for raw hex colors and arbitrary px sizes; replace with `tailwind.config.ts` tokens; add ESLint rule to block new violations | Not started |
| **P2-004** | No JSDoc on lib functions | Both | Phase 2 deferral | S | Add JSDoc to all exports in `lib/api/*.ts`, `lib/auth.ts`, `lib/validation/*.ts`, `lib/config/env.ts`; describe params, return type, side effects | Not started |
| **P2-005** | Cookie consent modal missing aria-live | Frontend | Phase 1 review | S | Add `aria-live="polite"` to cookie banner; announce when consent changes; test with screen reader | Not started |
| **P2-006** | Missing .well-known/security.txt | Frontend | PRD 3.1 (implied) | S | Create `app/.well-known/security.txt/route.ts`; include Contact, Expires (under 12 months), Policy URL (/security/vdp/); return as text/plain | Not started |
| **P2-007** | npm audit has unresolved high/critical | Both | Phase 1 review (pre-phase2) | S | Run `npm audit --production` in both apps; resolve or document all high/critical CVEs | Not started |
| **P2-008** | ARCHITECTURE.md missing | Docs | PRD 3.19 | S | Document two-app model (frontend 3000, CMS 3001), data flow, auth flow, deploy topology, database schema, Payload config | Not started |
| **P2-009** | RUNBOOK.md missing | Docs | PRD 3.18 | M | Document deploy steps, rollback, incident response, cutover procedure, alerting setup | Not started |
| **P2-010** | Monorepo tooling not established | Both | Phase 2 deferral | M | Evaluate npm workspaces vs Turbo; set up shared `packages/shared` with types/schemas; configure build orchestration | Not started |
| **P2-011** | ESLint/Prettier config not unified | Both | Phase 2 deferral | S | Create root `.eslintrc.json` and `.prettierrc.json`; both apps extend with minimal overrides; run `npm run lint` across both | Not started |

---

## Tier 4: Phase 2 Deferrals (Technical Debt, Will Address in Phase 4)

These were identified as standardization tasks but deferred to Phase 4 to avoid changing behavior in Phase 2.

| Deferral | Reason | Phase 4 Item |
|---|---|---|
| Naming: snake_case vs camelCase in DB | Database schema naming inconsistency | Will standardize after RBAC is enforced |
| Error shape unification | Implicit 500s in some routes | Use `ApiErrors.*` builders from Phase 2 everywhere |
| Success shape unification | Inconsistent response formats | Use `createSuccessResponse()` everywhere |
| JSDoc on all exports | Missing function documentation | P2-004 |
| ESLint/Prettier unification | Per-app config drift | P2-011 |
| Token compliance audit | Raw hex/px in components | P2-003 |

---

## Dependency Graph (Critical Path)

```
P0-001 (RBAC)
  ├─→ P0-004 (CMS collections RBAC)
  └─→ P1-001 (Auth validation) → P1-003 (User enumeration)

P0-002 (Turnstile verification)
  └─→ P0-003 (Audit logging on forms)
        └─→ P0-005 (Rate limiting)

P1-008 (Hero content & KPIs)
  └─→ P1-005 (Lighthouse budgets)

P1-007 (301 redirects)
  └─→ (No dependencies; can run in parallel)
```

**Critical path:** P0-001 → P0-002 → P0-003 → P0-005 → (P1-*) → P2-*

---

## Ordering Rationale

**P0 first** because SOC 2 cutover is blocked without RBAC, Turnstile, audit logging, and rate limiting. These prevent the most critical security/compliance issues.

**P1 second** because DNS cutover requires: input validation, branding, lighthouse budgets, redirects, forms, 404/500 pages, security.txt, OG/JSON-LD. These are customer-facing and compliance-critical.

**P2 third** because these are operational hardening: logging, tests, documentation, config cleanup. They improve resilience but don't block launch.

**Phase 2 deferrals** can be picked up opportunistically during Phase 4 implementation, since they don't affect acceptance criteria.

---

## SOC 2 Gate Status

| SOC 2 Item | Status | Phase 4 Task |
|---|---|---|
| **A1-A9:** Website pages (privacy, terms, security, VDP, cookies, subprocessors) | ⚠️ Content drafted but incomplete | P1-008, P1-009 |
| **B1-B8:** Security headers | 🟡 CSP has unsafe-eval | P1-004 |
| **C1-C3:** Lighthouse budgets | ❌ Not enforced | P1-005 |
| **D1-D7:** Forms and data handling | 🟡 Forms exist but no Turnstile verification | P0-002, P1-009 |
| **E1-E5:** Authentication | 🟡 JWT works but no RBAC enforcement | P0-001 |
| **G1-G4:** Deployment and configuration | ✅ Vercel config ready | (Blocked: needs auth) |
| **H1-H7:** Audit and accountability | 🟡 Logging implemented but not on forms | P0-003 |

**Gate blockers for H5 (H7 = form audit):** P0-003

---

## Acceptance Criteria Summary

### Before Phase 4 starts:
- [x] Phase 1 code review complete
- [x] Phase 2 standardization (3 passes) complete
- [x] Phase 3 gap analysis complete
- [x] Both apps TypeScript clean
- [x] Zod validation schemas created
- [x] Env validation in place

### Definition of done for Phase 4:
- All P0 items have passing tests
- All P0 items have fresh verification evidence (curl, Playwright, axe)
- All P1 items done or explicitly deferred with rationale
- Both apps build clean; no axe violations on P0 pages
- Lighthouse budgets met (90/95/95/95)
- SOC 2 gate list is accurate with owners assigned

---

## Estimated Phase 4 Timeline

| Tier | Items | Effort | Days |
|---|---|---|---|
| P0 | 5 items | 5M | 2-3 |
| P1 | 12 items | 10M | 4-5 |
| P2 | 11 items | 8M | 3-4 |
| **Total** | **28 items** | **23M** | **9-12** |

*Effort: S=small (0.5d), M=medium (1d), L=large (2-3d)*

---

## Next Steps

1. **Prioritize P0** — assign owners, start Phase 4 implementation
2. **Parallelize P1** — independent features can run concurrently
3. **Batch P2** — defer to post-launch if needed; focus on cutover blockers
4. **Document decisions** — link Phase 4 implementation log to this backlog

