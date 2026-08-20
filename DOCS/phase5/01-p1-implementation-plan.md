# Phase 5: P1 Implementation Plan

**Date:** 2026-08-21  
**Status:** Ready to begin  
**Scope:** 12 P1 items for DNS cutover readiness

---

## P1 Items Overview

| ID | Feature | Effort | Type | Priority |
|----|---------|--------|------|----------|
| P1-001 | Input validation (auth) | S | Backend | High |
| P1-002 | Form validation (Zod) | S | Backend | High |
| P1-003 | User enumeration fix | S | Backend | High |
| P1-004 | CSP hardening | M | Security | High |
| P1-005 | Lighthouse budgets | S | QA | High |
| P1-006 | prefers-reduced-motion | S | A11y | Medium |
| P1-007 | 301 redirects | M | SEO | Medium |
| P1-008 | Hero content + KPIs | M | Content | Medium |
| P1-009 | 6 new form types | M | Feature | Medium |
| P1-010 | 404/500 pages | S | UX | Medium |
| P1-011 | JSON-LD + OG/Twitter | M | SEO | Medium |
| P1-012 | CRM webhook | S | Integration | Low |

**Total Effort:** 10M (Medium: 6, Small: 6)  
**Estimated Timeline:** 4-5 days

---

## Recommended Implementation Order

### **Day 1: Security & Validation (P1-001 through P1-004)**

#### **P1-001: Payload CMS Auth Input Validation** (1 hour)
```
Location: qrs-cms/app/api/auth/* (or Payload hooks)
Changes:
  - Add email format validation
  - Add password strength rules (≥8 chars, complexity)
  - Return 400 with Zod error format
  
Before: POST /admin/login {email: "x", password: "short"} → success or unclear error
After: POST /admin/login {email: "x", password: "short"} → 400 {error: {code: 'VALIDATION_ERROR', details: [...]}}

Status: 🔄 Payload CMS only, not frontend
```

#### **P1-002: Form Endpoint Validation** (1.5 hours)
```
Location: frontend/app/api/contact/route.ts, frontend/app/api/privacy-request/route.ts
Changes:
  - Import Zod schemas
  - Validate email, message length (≥10 chars)
  - Return 400 on failure
  
Before: POST /api/contact {email: "x", message: "short"} → stored
After: POST /api/contact {email: "x", message: "short"} → 400 VALIDATION_ERROR

Zod Schemas Needed:
  - contactFormSchema {email, name, message (≥10)}
  - privacyRequestSchema {email, requestType, details (≥10)}

Status: 🔄 Use existing lib/validation/schemas.ts
```

#### **P1-003: User Enumeration Fix** (0.5 hours)
```
Location: Payload CMS auth endpoint
Changes:
  - Change "Email not found" to generic "Invalid credentials"
  - Change "Password incorrect" to same generic message
  
Before: Login attempts reveal which emails exist
After: All failures say "Email or password incorrect"

Status: 🔄 CMS auth only
```

#### **P1-004: CSP Header Hardening** (1.5 hours)
```
Location: frontend/next.config.ts
Changes:
  - Remove unsafe-eval from CSP
  - Add nonce to inline scripts (if any)
  - Deploy as Report-Only first
  
Before: script-src 'self' 'unsafe-eval' https://challenges.cloudflare.com
After: script-src 'self' https://challenges.cloudflare.com

Status: 🔄 Next.js security headers
```

**Day 1 Total:** ~4.5 hours

---

### **Day 2: Quality & Accessibility (P1-005, P1-006, P1-010)**

#### **P1-005: Lighthouse Budgets** (1.5 hours)
```
Location: frontend/.lighthouserc.json (already exists, needs wiring to CI)
Changes:
  - Configure Lighthouse CI in GitHub Actions
  - Set budgets: Perf ≥90, A11y ≥95, BP ≥95, SEO ≥95
  - Fail PR if exceeded
  
Before: No automated Lighthouse checks
After: Every PR checked against budgets

Status: 🔄 CI/CD integration
```

#### **P1-006: prefers-reduced-motion** (1 hour)
```
Location: frontend/components/marketing/HeroLoop.tsx (or hero video component)
Changes:
  - Add @media (prefers-reduced-motion: reduce)
  - Disable autoplay for users with preference
  - Show static poster instead

Before: Video always auto-plays
After: Video respects user motion preference

Status: 🔄 Component accessibility
```

#### **P1-010: 404/500 Pages** (1 hour)
```
Location: frontend/app/not-found.tsx, frontend/app/error.tsx
Changes:
  - Create branded error pages
  - Return correct HTTP status codes
  - Link to homepage

Before: Generic Next.js error pages
After: QRS-branded error handling

Status: 🔄 Page creation
```

**Day 2 Total:** ~3.5 hours

---

### **Day 3: Content & SEO (P1-007, P1-008, P1-011)**

#### **P1-007: 301 Redirects** (2 hours)
```
Location: frontend/app/api/redirects/route.ts OR next.config.ts redirects
Changes:
  - Fetch Redirects collection from CMS
  - Implement 301 middleware
  - Test old WordPress URLs → new URLs
  
Before: Old URLs → 404
After: Old URLs → 301 redirect to new URLs

Status: 🔄 CMS collection + middleware
```

#### **P1-008: Hero Content + KPI Values** (1.5 hours)
```
Location: frontend/app/page.tsx, qrs-cms/collections/Settings.ts
Changes:
  - Add Settings collection to CMS
  - Move KPI values (Portfolio TIV, VaR, etc.) to CMS
  - Fetch at build time

Before: Hero screenshot hardcoded, KPIs hardcoded
After: Hero image and KPIs from CMS

Status: 🔄 CMS collection + component update
```

#### **P1-011: JSON-LD + OG/Twitter Metadata** (1.5 hours)
```
Location: frontend/lib/metadata.ts, frontend/app/layout.tsx
Changes:
  - Add JSON-LD scripts (Organization, SoftwareApplication, BreadcrumbList)
  - Complete OG/Twitter tags (image, card type, url)
  - Test with opengraph.io

Before: Minimal metadata
After: Full SEO metadata for sharing

Status: 🔄 Metadata generation
```

**Day 3 Total:** ~5 hours

---

### **Day 4: Features & Integration (P1-009, P1-012)**

#### **P1-009: 6 New Form Types** (2 hours)
```
Location: frontend/components/marketing/FormModal.tsx (or new component)
Changes:
  - Add form types: Demo Request, Validation Report, Newsletter, Press, RFP, Partner
  - Each with: Turnstile, rate limiting, audit logging
  - Link to privacy/terms

Forms:
  1. Demo Request
  2. Validation Report Request
  3. Newsletter Signup
  4. General Contact
  5. Press Inquiry
  6. RFP / Partner Inquiry

Status: 🔄 Component + API routes
```

#### **P1-012: CRM Webhook Stub** (0.5 hours)
```
Location: frontend/app/api/webhooks/crm/route.ts
Changes:
  - Create POST endpoint
  - Log webhook calls for audit
  - Document payload contract
  - No-op implementation

Before: No webhook
After: Ready for CRM integration

Status: 🔄 API route
```

**Day 4 Total:** ~2.5 hours

---

## Implementation Checklist by Day

### **Day 1** (Security & Validation)
- [ ] P1-001: CMS auth validation
- [ ] P1-002: Form validation (Zod)
- [ ] P1-003: User enumeration fix
- [ ] P1-004: CSP hardening
- [ ] Commit: "feat(p1-001-004): security and validation hardening"

### **Day 2** (Quality & Accessibility)
- [ ] P1-005: Lighthouse budgets
- [ ] P1-006: prefers-reduced-motion
- [ ] P1-010: 404/500 pages
- [ ] Commit: "feat(p1-005-006-010): quality and accessibility"

### **Day 3** (Content & SEO)
- [ ] P1-007: 301 redirects
- [ ] P1-008: Hero content + KPIs
- [ ] P1-011: JSON-LD + OG/Twitter metadata
- [ ] Commit: "feat(p1-007-008-011): content and SEO"

### **Day 4** (Features & Integration)
- [ ] P1-009: 6 new form types
- [ ] P1-012: CRM webhook stub
- [ ] Commit: "feat(p1-009-012): new forms and webhook"

---

## Testing Strategy

### **For each P1 item:**

1. **Unit tests** (if applicable)
   - Validation schemas
   - Redirect logic
   - Metadata generation

2. **Manual testing**
   - Form submissions
   - Redirect chains
   - Page rendering
   - Metadata inspection

3. **Lighthouse scan**
   - After all changes
   - Target: Perf ≥90, A11y ≥95, BP ≥95, SEO ≥95

4. **Accessibility audit**
   - Motion preferences
   - Color contrast
   - Semantic HTML

---

## Dependencies & Blockers

| Item | Dependencies | Blocker? |
|------|------------|----------|
| P1-001 | None | No |
| P1-002 | None | No |
| P1-003 | None | No |
| P1-004 | None | No |
| P1-005 | None | No |
| P1-006 | Hero video component | Possible |
| P1-007 | Redirects CMS collection | No (created in Phase 1) |
| P1-008 | Settings CMS collection | Needs creation |
| P1-009 | Rate limiter (done) | No |
| P1-010 | None | No |
| P1-011 | None | No |
| P1-012 | None | No |

---

## Success Criteria

### **All P1 items complete when:**

1. ✅ All 12 features implemented
2. ✅ Zod validation on all form endpoints
3. ✅ RBAC still enforced on CMS
4. ✅ Rate limiting still working
5. ✅ Audit logs still recording
6. ✅ TypeScript clean on both apps
7. ✅ Lighthouse budgets met
8. ✅ No regressions in Phase 4 features
9. ✅ All redirects working
10. ✅ Metadata correct on all pages

---

## Deployment Readiness (Post-P1)

Once P1 complete:
- ✅ DNS cutover can proceed
- ✅ All SOC 2 requirements met (P0 + P1)
- ✅ Site ready for production
- ✅ P2 items can be scheduled post-launch

---

**Next Step:** Confirm priority order, then begin Day 1 (P1-001 through P1-004) implementation.

Ready to start? Run the project and implement P1!
