# QRS Design System Audit & Implementation Plan

**Date:** 2026-09-12  
**Status:** Comprehensive audit complete  
**Scope:** Frontend codebase vs DESIGN.md v1.0  

---

## Executive Summary

The QRS marketing site has **foundational design infrastructure** in place (colors, typography, components) but is missing critical **implementation consistency** and **design excellence details**. 

- ✅ **Working:** Color palette, typography stack, button variants, core components
- ⚠️ **Partially Working:** Spacing system, component patterns, responsive behavior  
- ❌ **Missing/Broken:** Design token consistency, spacing class naming, KPI sizing, motion/animation, accessibility compliance

**Estimated Effort:** 40-60 hours across 3 phases

---

## PHASE 1: Design Token & Tailwind Config Fix (12 hours) — P0 CRITICAL

### 1.1 Spacing Class Naming Bug

**Severity:** 🔴 CRITICAL - Breaks all spacing

**Current Problem:**
Components use `py-space-20`, `gap-space-8`, `px-space-4` but **`space-` prefix doesn't exist in Tailwind**.

Files affected:
- `HeroDeviceFrame.tsx` - 10+ instances
- `KPIStrip.tsx` - 8+ instances  
- `VerifiedSealBadge.tsx` - 4+ instances
- ~30 other components

**Fix:**
```tsx
// ❌ BROKEN - doesn't work
className="py-space-20 gap-space-8 px-space-4"

// ✅ CORRECT - use Tailwind's base scale
className="py-20 gap-8 px-4"

// Tailwind spacing scale maps to:
// space-4 = 1rem (16px)
// space-6 = 1.5rem (24px)
// space-8 = 2rem (32px)
// space-12 = 3rem (48px)
// space-16 = 4rem (64px)
// space-20 = 5rem (80px)
// space-24 = 6rem (96px)
// space-32 = 8rem (128px)
```

**Action Items:**
- [ ] Run find/replace: `py-space-` → `py-`
- [ ] Run find/replace: `px-space-` → `px-`
- [ ] Run find/replace: `gap-space-` → `gap-`
- [ ] Run find/replace: `mb-space-` → `mb-`
- [ ] Run find/replace: `mt-space-` → `mt-`
- [ ] Verify all spacing works after replacement
- [ ] Check 5 pages visually after fix

---

### 1.2 KPI Font Size Mismatch

**Severity:** 🟡 HIGH - Visual branding issue

**Current Problem:**
```ts
// tailwind.config.ts line 88
kpi: ['1.5rem', { lineHeight: '1' }],  // ❌ 24px

// DESIGN.md spec:
// --text-kpi: 2.25rem (36px)
```

**Current rendering:**
- KPI values show at 24px (text-kpi)
- But HeroDeviceFrame uses `text-5xl lg:text-7xl` (48px / 56px)
- Inconsistency creates confusion

**Fix:**
```ts
// ✅ CORRECT per DESIGN.md
fontSize: {
  kpi: ['2.25rem', { lineHeight: '1' }],  // 36px, line-height 1
}
```

**Action Items:**
- [ ] Update `tailwind.config.ts` fontSize.kpi to 2.25rem
- [ ] Update `KPIStrip.tsx` to use `text-kpi` (remove text-4xl/text-6xl)
- [ ] Add `font-mono` class to KPI values (spec requires mono)
- [ ] Test on desktop/mobile/tablet

---

### 1.3 Motion Timing Mismatch

**Severity:** 🟡 MEDIUM - Animation feels off

**Current:**
```ts
transitionDuration: {
  'base': '200ms',    // ❌ Should be 240ms per spec
  'slow': '500ms',    // ❌ Should be 480ms per spec
}
// Missing: 'fast': '120ms'
```

**DESIGN.md spec:**
```
--motion-fast: 120ms
--motion-base: 240ms
--motion-slow: 480ms
```

**Fix:**
```ts
transitionDuration: {
  'fast': '120ms',
  'base': '240ms',
  'slow': '480ms',
}
```

**Action Items:**
- [ ] Update all 3 timing values in tailwind.config
- [ ] Find/replace `duration-200` → `duration-base` in components
- [ ] Test animation smoothness on hero entrance

---

### 1.4 Color Accessibility Audit

**Severity:** 🟡 MEDIUM - May fail Lighthouse

**Risk:** `--text-muted-on-dark` (teal-700 #29908A) on dark backgrounds

**DESIGN.md warning:**
> "Avoid: `--text-muted-on-dark` on anything lighter than `--color-ink-800`. Mid-teal-on-mid-teal is the most common a11y failure on dark themes"

**Current usage:**
- KPIStrip uses `text-teal-300` for labels ✅ (good contrast)
- Some text might use teal-700 on teal backgrounds ❌

**Action Items:**
- [ ] Run Lighthouse on home page → check accessibility score
- [ ] Run on platform, trust, validation, solutions pages
- [ ] If score < 95: identify failing elements
- [ ] Verify all text/background pairs meet WCAG AA (4.5:1 minimum)

---

## PHASE 2: Component Pattern Alignment (20 hours) — P1 HIGH

### 2.1 Hero Device Frame - Add Animation

**File:** `frontend/components/marketing/HeroDeviceFrame.tsx`

**Current:** Static, no entrance animation

**Spec requirement:**
> "Subtle entrance animation (motion-slow fade-up, easing ease-standard)"
> "Poster image fallback for reduced-motion users"

**Missing:**
```tsx
// ❌ Currently static
<div className="rounded-2xl shadow-glow">

// ✅ Should animate on entrance
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

<div className="rounded-2xl shadow-glow 
             animate-fadeInUp 
             duration-slow 
             ease-standard
             motion-reduce:animate-none">
```

**Action Items:**
- [ ] Add @keyframes fadeInUp to globals.css
- [ ] Import animation in HeroDeviceFrame
- [ ] Add prefers-reduced-motion media query
- [ ] Test on Safari/Chrome (animation performance)

---

### 2.2 KPI Strip - Fix Styling & Colors

**File:** `frontend/components/marketing/KPIStrip.tsx`

**Current Issues:**
1. Font size wrong (text-4xl instead of text-kpi after fix above)
2. Missing mono font
3. Background color not matching spec
4. Label color might be wrong

**Spec per DESIGN.md §8.2:**
```
Background: --bg-card-dark (ink-700)
Labels: text-small, --text-muted-on-dark (teal-700)
Values: --text-kpi mono, --text-on-dark (white)
```

**Current code problems:**
```tsx
// ❌ Line 12: gradient background
className="bg-gradient-to-r from-ink-800 via-ink-700 to-ink-800"

// ✅ Should be:
className="bg-ink-700"

// ❌ Line 20: using teal-300 for labels
text-teal-300

// ✅ Should be: teal-700 per spec
text-teal-700

// ❌ Line 23: using text-4xl/text-6xl
text-4xl lg:text-6xl

// ✅ After kpi fix, use: text-kpi (2.25rem)

// ❌ Missing: font-mono
// ✅ Add: font-mono
```

**Action Items:**
- [ ] Change background from gradient to `bg-ink-700`
- [ ] Update label color to `text-teal-700`
- [ ] Update value color to `text-white` (currently has gradient)
- [ ] Add `font-mono` to value text
- [ ] Update font-size to `text-kpi` (after config fix)
- [ ] Remove gradient text effect (verify with Jordan first)
- [ ] Test contrast: teal-700 on ink-700 should be readable
- [ ] Test contrast: white on ink-700 should be 12.1:1 ✓

---

### 2.3 Verified Seal Badge - Fix Background Color

**File:** `frontend/components/marketing/VerifiedSealBadge.tsx`

**Issue:** Badge background is light (teal-50 to teal-100) but spec says dark card on dark ground

**Spec per DESIGN.md §8.3:**
```
"Color: --color-teal-500 border, --color-ink-800 fill, --color-white text"
OR from semantics: --cta-primary-bg, ink-900, white
```

**Current code problems:**
```tsx
// ❌ Line 24: light background
className="... bg-gradient-to-r from-teal-50 to-teal-100"

// ✅ Should be: dark background
className="... bg-ink-700 border-2 border-teal-500 text-white"
```

**Context:** Badge appears on dark pages (home hero) and light pages (validation). Needs context awareness.

**Action Items:**
- [ ] Create two variants: `BadgeOnDark` and `BadgeOnLight`
- [ ] Dark variant: bg-ink-700, border-teal-500, text-white
- [ ] Light variant: bg-white, border-teal-600, text-ink-900
- [ ] Pass context via prop to component
- [ ] Update pages to use correct variant
- [ ] Test contrast both ways

---

### 2.4 Trust Badge Cluster - Redesign

**File:** `frontend/components/marketing/TrustBadgeCluster.tsx`

**Issue:** Styling is ad-hoc gradients, not spec-aligned. Uses light page styling when used on dark pages.

**Current problems:**
```tsx
// ❌ Assumes light background
'border-teal-400/60 bg-gradient-to-br from-teal-50 to-teal-100'

// ❌ Mixing text-gray-900 dark:text-white (no spec for this)
className="text-gray-900 dark:text-white"

// ❌ Too much detail (description on each badge)
// ✅ Spec says: small badges with icon + label only
```

**Spec per DESIGN.md §8.4:**
```
"Horizontal row of small badges on homepage and Trust Center"
"Use SVG icons, no raster"
Five badges: SOC 2, Vouch, GDPR, RFC 9116, Cryptographic seal (highlighted)
```

**Redesign:**
```tsx
// ✅ Simpler structure
<div className="flex flex-wrap gap-4 justify-center items-center">
  {badges.map(badge => (
    <div className={`
      flex items-center gap-2 px-4 py-3 rounded-md
      border transition-all duration-base
      ${badge.highlight 
        ? 'border-teal-500 bg-teal-500/20 hover:bg-teal-500/30' 
        : 'border-teal-500/40 bg-teal-500/10 hover:bg-teal-500/15'
      }
    `}>
      <Icon size={24} className="text-teal-500" />
      <span className="text-small font-medium text-white">
        {badge.label}
      </span>
    </div>
  ))}
</div>

// Usage on dark pages:
<TrustBadgeCluster variant="dark" />

// Usage on light pages:
<TrustBadgeCluster variant="light" />
```

**Action Items:**
- [ ] Remove description text (show icon + label only)
- [ ] Create light/dark variants
- [ ] Use semantic colors from palette (no custom gradients)
- [ ] Highlight cryptographic seal with slightly larger icon
- [ ] Test on dark pages (home) and light pages (trust, validation)

---

## PHASE 3: Page-Level Consistency (15 hours) — P2 MEDIUM

### 3.1 Global Animation System

**Missing:** No entrance animations on hero sections, feature grids, etc.

**Required:**
```css
/* globals.css */

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Action Items:**
- [ ] Add @keyframes to globals.css
- [ ] Add prefers-reduced-motion media query
- [ ] Apply animation to: hero heading, hero CTA buttons, device frame
- [ ] Use: `animate-fadeInUp duration-slow ease-standard`
- [ ] Test on Safari (sometimes buggy with animations)

---

### 3.2 Focus State System

**Current:** Buttons have focus state ✅  
**Missing:** Inputs, links, other interactive elements

**Spec:** 2px outline in teal-500, 2px offset

**Action Items:**
- [ ] Create global focus styles in globals.css:
  ```css
  :focus-visible {
    outline: 2px solid var(--color-teal-500);
    outline-offset: 2px;
  }
  ```
- [ ] Test keyboard navigation on all pages (Tab key)
- [ ] Verify focus outline is visible on light and dark backgrounds

---

### 3.3 Typography Scale Verification

**Current:** Font sizes may not match DESIGN.md exactly

**DESIGN.md spec:**
| Token | Size | Current | Match? |
|-------|------|---------|--------|
| display | 3.5rem (56px) | 2rem (32px) | ❌ |
| h1 | 2.5rem (40px) | 2rem (32px) | ❌ |
| h2 | 2rem (32px) | 1.75rem (28px) | ❌ |
| h3 | 1.5rem (24px) | 1.5rem (24px) | ✅ |
| body | 1rem (16px) | 1rem (16px) | ✅ |
| small | 0.875rem (14px) | 0.875rem (14px) | ✅ |

**Action Items:**
- [ ] Update tailwind fontSize to match spec exactly
- [ ] Test on 5 P0 pages (home, platform, trust, validation, solutions)
- [ ] Ensure mobile scaling is still readable (no smaller than 16px base)

---

### 3.4 Responsive Behavior Audit

**Tests to run:**
- [ ] iPhone 12 (375px) - text readable, buttons clickable
- [ ] iPad (768px) - layout doesn't break
- [ ] Desktop (1280px) - max-width respected (1280px)
- [ ] No horizontal scrolling at any width
- [ ] Touch targets all ≥ 44px height

**Action Items:**
- [ ] Test KPI strip: should be 2 cols mobile, 4 cols desktop
- [ ] Test hero: should stack on mobile, grid on desktop
- [ ] Test feature grids: should be 1 col mobile, multi col desktop

---

## PHASE 4: Testing & QA (10 hours)

### Lighthouse Audits
- [ ] Home page: ≥95 Accessibility, ≥90 Performance
- [ ] Platform page: ≥95 Accessibility, ≥90 Performance
- [ ] Trust page: ≥95 Accessibility, ≥90 Performance
- [ ] Validation page: ≥95 Accessibility, ≥90 Performance
- [ ] Solutions page: ≥95 Accessibility, ≥90 Performance

### Manual Testing
- [ ] Color contrast: use Contrast Ratio checker on all text
- [ ] Font rendering: verify Outfit, Poppins, JetBrains Mono load correctly
- [ ] Animation: verify animations on hero, KPI strip entrance
- [ ] Reduced motion: verify animations disabled when `prefers-reduced-motion` set
- [ ] Keyboard navigation: Tab through all interactive elements on one page

### Browser Testing
- [ ] Chrome/Chromium (Windows, Mac, Linux)
- [ ] Safari (Mac, iOS)
- [ ] Firefox (Windows)
- [ ] Edge (Windows)

---

## Priority & Effort Summary

| Category | Task | Effort | Priority |
|----------|------|--------|----------|
| **P0 - Critical** | Fix space- prefix | 4h | Must do first |
| | Fix KPI sizing | 2h | Must do first |
| | Fix motion timing | 1h | Must do first |
| | Color accessibility audit | 2h | Before testing |
| **P1 - High** | Hero animations | 3h | Week 1 |
| | KPI styling | 2h | Week 1 |
| | Seal badge colors | 1h | Week 1 |
| | Trust badges redesign | 4h | Week 2 |
| **P2 - Medium** | Global animations | 3h | Week 2 |
| | Focus state system | 2h | Week 2 |
| | Typography audit | 2h | Week 2 |
| | Responsive tests | 3h | Week 3 |
| **P3 - Testing** | Lighthouse audits | 5h | Week 4 |
| | Manual testing | 5h | Week 4 |
| **TOTAL** | | **40h** | 4 weeks |

---

## Next Steps

1. **Immediately:** Fix Phase 1 (spacing prefix, KPI size, motion timing)
2. **Review:** Share Phase 1 fixes with Jordan & Bilal for approval
3. **Execute:** Phase 2 (components) in order of priority
4. **Test:** Phase 3 (pages & accessibility) in parallel with Phase 2
5. **Verify:** Phase 4 (QA & final testing)

---

**Audit Completed By:** Claude Code  
**Date:** 2026-09-12  
**Next Review:** After Phase 1 completion

