# QRS Audit Fixes - Implementation Task List

**Status:** Ready for Implementation  
**Priority:** CRITICAL → HIGH → MEDIUM  
**Target:** All failures fixed before launch

---

## CRITICAL PRIORITY (Launch Blockers)

### ✅ Task 1: Remove Database Credential from DESIGN.md
**File:** `DESIGN.md`  
**Status:** ⬜ TODO  
**Estimated Time:** 2 min  
**Steps:**
1. Open `DESIGN.md`
2. Delete line 382 containing PostgreSQL connection string
3. Verify with: `grep -r "neondb_owner" .` returns zero results
4. Git commit: "chore: remove exposed database credential from DESIGN.md"

**Verification:**
- [ ] No PostgreSQL connection string in repo
- [ ] No credentials in git history (if exposed, force push after rotation)

---

### ✅ Task 2: Add Disclosure Strip (Non-dismissible)
**Files:** `frontend/app/layout.tsx` or `frontend/components/layout/Header.tsx`  
**Status:** ⬜ TODO  
**Estimated Time:** 15 min  
**Priority:** CRITICAL (C6 content compliance)

**Steps:**
1. Locate root layout file
2. Add disclosure banner component at top of layout
3. Style with yellow warning background
4. Make it persist on all pages (non-dismissible)
5. Link text to `/verify` page (if exists) or `/` as fallback

**Code to add:**
```tsx
<div className="w-full bg-status-warn/20 border-b border-status-warn text-center py-3 px-6 sticky top-0 z-50">
  <p className="text-sm font-semibold text-status-warn">
    MODELED — MODEL CARD v0 (DRAFT) · NOT INDEPENDENTLY VALIDATED
  </p>
</div>
```

**Verification:**
- [ ] Banner visible on all pages
- [ ] Not dismissible (no close button)
- [ ] Persists on scroll
- [ ] Correct text displayed

---

### ✅ Task 3: Replace Blocked Phrases (3 instances)
**Files:** `frontend/lib/default-sections.ts`, `qrs-cms/sections-data.json`  
**Status:** ⬜ TODO  
**Estimated Time:** 20 min  
**Priority:** CRITICAL (C1 content compliance)

**Replacements needed:**
1. "independently validated" → "internally benchmarked" (3 instances)
2. "peer-reviewed" → "quantitatively validated" (2 instances)
3. "quantum-optimized" → "scalable" (1 instance)
4. Section title "Independently Validated" → "Validation Methodology"

**Files & Lines:**
- `default-sections.ts:127, 169, 172, 176, 177, 181` (6 replacements)
- `sections-data.json:566, 1137, 1140, 1145, 1148, 1149` (6 replacements in seed data)

**Verification:**
- [ ] `grep -r "independently validated" frontend/ qrs-cms/` returns zero
- [ ] `grep -r "peer-reviewed" frontend/ qrs-cms/` returns zero
- [ ] `grep -r "quantum-optimized" frontend/ qrs-cms/` returns zero

---

### ✅ Task 4: Create security.txt (RFC 9116 Compliance)
**File:** Create `frontend/app/.well-known/security.txt/route.ts`  
**Status:** ⬜ TODO  
**Estimated Time:** 10 min  
**Priority:** CRITICAL (SOC2 A10 gate blocker)

**Steps:**
1. Create directory structure: `frontend/app/.well-known/security.txt/`
2. Create `route.ts` with security.txt handler
3. Set correct expiry date (1 year from now)
4. Point Policy to `/security/vdp/`

**Code to create:**
```typescript
export async function GET() {
  const expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split('T')[0];
  
  const securityTxt = `Contact: security@qrsrisk.com
Expires: ${expiryDate}T00:00Z
Preferred-Languages: en
Policy: https://qrsrisk.com/security/vdp/
`;
  
  return new Response(securityTxt, {
    headers: { 'Content-Type': 'text/plain' },
  });
}
```

**Verification:**
- [ ] `curl http://localhost:3000/.well-known/security.txt` returns 200
- [ ] Content includes Contact, Expires, Policy fields
- [ ] Policy points to `/security/vdp/`
- [ ] Expires date is valid (within 12 months)

---

### ✅ Task 5: Fix Security Headers (CSP, COOP, COEP)
**File:** `frontend/next.config.js`  
**Status:** ⬜ TODO  
**Estimated Time:** 15 min  
**Priority:** CRITICAL (SOC2 B6, B7, B8)

**Changes needed:**
1. Remove `'unsafe-eval'` from CSP script-src
2. Remove `'unsafe-inline'` from CSP script-src (check if needed first)
3. Add COOP header: `same-origin`
4. Add COEP header: `require-corp`

**Current CSP line 34:**
```javascript
// REMOVE: 'unsafe-inline' 'unsafe-eval' from script-src
script-src 'self' 'unsafe-inline' 'unsafe-eval'
// BECOMES:
script-src 'self'
```

**Add after Permissions-Policy (after line 31):**
```javascript
{
  key: 'Cross-Origin-Opener-Policy',
  value: 'same-origin',
},
{
  key: 'Cross-Origin-Embedder-Policy',
  value: 'require-corp',
},
```

**Verification:**
- [ ] Next.js builds without errors
- [ ] No console warnings about CSP violations
- [ ] Run securityheaders.com grade check (target A+)
- [ ] Verify COOP header present: `curl -I http://localhost:3000 | grep COOP`
- [ ] Verify COEP header present: `curl -I http://localhost:3000 | grep COEP`

---

### ✅ Task 6: Replace Hardcoded Localhost URLs in SectionRenderer
**File:** `frontend/components/marketing/SectionRenderer.tsx`  
**Status:** ⬜ TODO  
**Estimated Time:** 15 min  
**Priority:** CRITICAL (A2 technical compliance)

**Lines to fix:** 85, 92, 244

**Changes:**
1. Import env: `import { env } from '@/lib/env'` (at top)
2. Add CMS URL variable in component
3. Replace all `http://localhost:3001` with `${cmsUrl}`

**Code pattern:**
```typescript
// At component level:
const cmsUrl = env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

// Then use:
<source src={`${cmsUrl}${section.videoUrl}`} type="video/mp4" />
<img src={`${cmsUrl}${section.imageUrl}`} />
```

**Lines to update:**
- Line 85: `<source src={...}`
- Line 92: `<img src={...}`
- Line 244: `<img src={...}`

**Verification:**
- [ ] `grep "http://localhost:3001" frontend/components/marketing/SectionRenderer.tsx` returns zero
- [ ] Sections load correctly in browser
- [ ] Images/videos render on staging deployment

---

## HIGH PRIORITY (Visual/Design Issues)

### ✅ Task 7: Fix Color Token Mismatches
**File:** `frontend/tailwind.config.ts`  
**Status:** ⬜ TODO  
**Estimated Time:** 10 min  
**Priority:** HIGH (B1 design compliance)

**Changes needed (lines 10-70):**

```typescript
'ink': {
  '50': '#f9fafb',
  '100': '#f3f4f6',
  '200': '#e5e7eb',
  '300': '#d1d5db',
  '400': '#9ca3af',
  '500': '#6b7280',
  '600': '#4b5563',
  '700': '#1f2124',
  '800': '#1B3B3A',  // ← CHANGE from #1f2937
  '900': '#0C0D0E',  // ← CHANGE from #1f2937
},
```

**Also update status colors:**
```typescript
'status': {
  'ok': '#22c55e',   // ← CHANGE from #10b981
  'warn': '#f59e0b',
  'error': '#ef4444',
},
```

**Verification:**
- [ ] Run dev server: `npm run dev`
- [ ] Visual comparison: home page colors match DESIGN.md mockups
- [ ] Dark sections show correct ink-800 (#1B3B3A) background
- [ ] Status badges show correct green (#22c55e) for "validated"
- [ ] Run Lighthouse (should improve accessibility score)

---

### ✅ Task 8: Add Hero Video Poster & Reduced Motion Handling
**File:** `frontend/components/marketing/SectionRenderer.tsx`  
**Status:** ⬜ TODO  
**Estimated Time:** 20 min  
**Priority:** HIGH (A7 design/accessibility compliance)

**Changes needed (lines 75-86, hero case):**

Replace:
```typescript
{section.videoUrl && (
  <video
    className="absolute inset-0 w-full h-full object-cover"
    autoPlay
    muted
    loop
    playsInline
  >
    <source src={`${cmsUrl}${section.videoUrl}`} type="video/mp4" />
  </video>
)}
```

With:
```typescript
{section.videoUrl && (
  <video
    className="absolute inset-0 w-full h-full object-cover"
    autoPlay={!window.matchMedia('(prefers-reduced-motion: reduce)').matches}
    muted
    loop
    playsInline
    poster={`${cmsUrl}${section.imageUrl || '/placeholder.png'}`}
  >
    <source src={`${cmsUrl}${section.videoUrl}`} type="video/mp4" />
  </video>
)}
```

**Verification:**
- [ ] Video plays normally in browser
- [ ] Test with DevTools: `prefers-reduced-motion: reduce` enabled → video pauses, shows poster
- [ ] Poster image displays while video loads
- [ ] No console errors about missing poster

---

### ✅ Task 9: Remove Placeholder Text from VerifiedSealBadge
**File:** `frontend/components/marketing/VerifiedSealBadge.tsx`  
**Status:** ⬜ TODO  
**Estimated Time:** 10 min  
**Priority:** HIGH (A8 placeholder content)

**Changes needed (line 70):**

Replace:
```typescript
<p className="text-sm text-teal-700 font-medium">
  Placeholder signature. Real ECDSA data from product backend before launch.
</p>
```

With actual logic or conditional rendering:
```typescript
{signature ? (
  <p className="text-sm text-teal-700 font-medium">
    Click to verify calculation signature using open-source tools
  </p>
) : (
  // Component hidden or shows "Coming soon" if no data
  null
)}
```

**Verification:**
- [ ] Placeholder text not visible in browser
- [ ] Component displays real signature or is hidden
- [ ] No console warnings about missing props

---

## MEDIUM PRIORITY (Code Quality)

### ✅ Task 10: Remove TODO Comments (3 instances)
**Files:** 3 locations  
**Status:** ⬜ TODO  
**Estimated Time:** 20 min  
**Priority:** MEDIUM (A8 code quality)

**Location 1:** `frontend/app/.well-known/security.txt/route.ts`
- Line: TODO about refreshing date
- **Fix:** Implement automatic expiry calculation (already in Task 4)

**Location 2:** `frontend/app/api/contact/route.ts`
- Line: TODO about sending email to support@qrsrisk.com
- **Steps:**
  1. Import email service (Nodemailer, SendGrid, etc.)
  2. Implement form submission to email
  3. Add error handling
  4. Test with real submission

**Location 3:** `frontend/app/api/privacy-request/route.ts`
- Line: TODO about sending email to privacy@qrsrisk.com
- **Steps:** Same as Location 2

**Verification:**
- [ ] `grep -r "TODO" frontend/app/` returns zero results
- [ ] Contact form submission sends email to support@qrsrisk.com
- [ ] Privacy request sends email to privacy@qrsrisk.com
- [ ] Email integration tested end-to-end

---

## PARTIAL/OPTIONAL (Recommendations)

### ⚠️ Task 11: Verify Font Loading (B2)
**File:** `frontend/app/layout.tsx`  
**Status:** ⚠️ VERIFY ONLY  
**Estimated Time:** 5 min

**Check:**
- [ ] Outfit font loaded with `display: 'swap'`
- [ ] Poppins font loaded with `display: 'swap'`
- [ ] JetBrains Mono loaded with `display: 'swap'`
- [ ] No FOIT (Flash of Invisible Text)

---

### ⚠️ Task 12: Font Weight Review (B3)
**File:** Multiple components  
**Status:** ⚠️ VERIFY ONLY  
**Estimated Time:** 15 min

**Spot-check:**
- [ ] Heading h1/h2/h3 use weight 600 (not 700)
- [ ] Body text uses weight 400
- [ ] Emphasis text uses weight 500
- [ ] Display text uses 700 or higher

---

### ⚠️ Task 13: Contrast Verification (B5)
**File:** All components  
**Status:** ⚠️ VERIFY ONLY  
**Estimated Time:** Run Lighthouse

**Check:**
- [ ] Run Lighthouse on all P0 pages
- [ ] Accessibility score ≥ 95
- [ ] No contrast warnings
- [ ] Flag teal-700 on cream backgrounds if found

---

---

## IMPLEMENTATION ORDER

**Do these in sequence (6 critical fixes first):**

```
Week 1:
  Mon: Tasks 1, 2, 3 (Credentials, Disclosure, Phrases)
  Tue: Tasks 4, 5, 6 (security.txt, Headers, URLs)
  Wed: Tasks 7, 8, 9 (Colors, Video, Seal)
  Thu: Task 10 (TODOs)
  Fri: Verification + QA testing

Week 2:
  Mon-Tue: Tasks 11-13 (Optional verifications)
  Wed: UAT & final checks
  Thu: Deploy to staging
  Fri: Launch readiness review
```

---

## VERIFICATION CHECKLIST (Before Deployment)

- [ ] All 6 critical tasks completed
- [ ] `npm run build` succeeds without warnings
- [ ] `npm run dev` starts without errors
- [ ] No console errors in browser DevTools
- [ ] Lighthouse score: Perf ≥90, A11y ≥95, BP ≥95, SEO ≥95
- [ ] Security headers: securityheaders.com grade A+
- [ ] All forbidden phrases removed: `grep -r "independently validated|peer-reviewed|quantum-optimized" .` = 0
- [ ] Database credential removed: `grep -r "neondb_owner" .` = 0
- [ ] Contact/Privacy forms send emails successfully
- [ ] Video plays with poster on desktop, pauses on prefers-reduced-motion
- [ ] Colors match DESIGN.md hex values
- [ ] Disclosure banner visible on all pages
- [ ] security.txt returns 200 with correct content

---

**Generated:** 2026-08-08  
**Last Updated:** —  
**Assigned to:** You  
**Deadline:** Before launch cutover
