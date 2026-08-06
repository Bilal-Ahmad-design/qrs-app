# QRS Phase 1 Testing Guide

## Quick Start: Local Development Testing

### 1. Start the Dev Server
```bash
cd frontend
npm run dev
# Server runs on http://localhost:3000
```

### 2. Test Coverage by Component

#### A. Marketing Components (No DB Required)
All components render with hardcoded/fallback data without DATABASE_URL:

**ProductShowcase** → Test at `http://localhost:3000/`
- ✅ Should show video/image carousel with play button
- ✅ Click play button → video plays with controls
- ✅ Without video → shows fallback image
- ✅ Respects `prefers-reduced-motion` browser setting
- ✅ Responsive on mobile (aspect-video scales properly)

**VerificationFlow** → Test at `http://localhost:3000/`
- ✅ Should show 4-step flow with arrows (desktop) or stacked (mobile)
- ✅ Step icons visible (📊 🔐 ✓ 📋)
- ✅ Key benefits grid below with correct text
- ✅ Responsive spacing on small screens

**RiskEngineShowcase** → Manual import test
```tsx
// In any page
import { RiskEngineShowcase } from '@/components/marketing/RiskEngineShowcase'

// Renders 2x2 grid: Real-Time Calculation, Multi-Dimensional, etc.
<RiskEngineShowcase />
```

**QuantumArchitecture** → Manual import test
```tsx
import { QuantumArchitecture } from '@/components/marketing/QuantumArchitecture'

// Renders 4 stacked layers with arrows and items
<QuantumArchitecture />
```

**SolutionCard** → Manual import test
```tsx
import { SolutionCard } from '@/components/marketing/SolutionCard'

<SolutionCard
  title="Underwriter Solutions"
  tagline="Faster underwriting, better pricing"
  challenges={['Manual CAT model review', 'Silent assumptions', 'Model disagreement']}
  value={['Instant recalculation', 'Transparent inputs', 'Independent proof']}
/>
```

**ComplianceBadge** → Manual import test
```tsx
import { ComplianceBadge } from '@/components/marketing/ComplianceBadge'

<ComplianceBadge
  framework="SOC 2"
  status="in-progress"
  description="Audit via Vanta"
/>
```

**LightThemeWrapper** → Manual import test
```tsx
import { LightThemeWrapper } from '@/components/marketing/LightThemeWrapper'

<LightThemeWrapper sectionId="features">
  <h2>Features Section</h2>
  <p>Light background applied</p>
</LightThemeWrapper>
```

#### B. Pages (Fallback Content, No DB)

Test each page to ensure fallback content renders when CMS unavailable:

| Page | URL | Expected Content |
|------|-----|-----------------|
| **Home** | `/` | Hero + Active Models + Verifiable by Design + AI-Native + Crisis + How It Works + Validation + CTA |
| **About** | `/about/` | Mission + Why Verifiable + Built by Risk Experts |
| **Platform** | `/platform/` | Quantitative Risk Platform + Core Capabilities + Features list |
| **Trust & Security** | `/trust/` | Security + Compliance section + Verified Seal Badge + Trust Badge Cluster |
| **Validation** | `/validation/` | Independently Verified + Validation Reports + Methodology |
| **Docs** | `/docs/` | Documentation landing |
| **Privacy** | `/privacy/` | Static: Coming soon (no DB dependency) |
| **Terms** | `/terms/` | Static: Coming soon |
| **Security** | `/security/` | Static with VDP link |
| **Support** | `/support/` | Static: Contact form placeholder |
| **Cookies** | `/cookies/` | Cookie policy + preferences button |

**Fallback Rendering Verification:**
1. Start dev server WITHOUT starting Payload CMS (DATABASE_URL not set or invalid)
2. Navigate to each page
3. Should NOT see errors in browser console (only console.log warnings about CMS unavailable)
4. Should see hardcoded fallback content, not blank pages

#### C. Color Theme Testing

Test light institutional theme is applied correctly:

**Light Theme Colors:**
```bash
# Should use these CSS classes:
bg-light-bg-primary      # #F4F6F6 (light gray background)
bg-light-section         # #FFFFFF (white)
bg-light-bg-dark         # #1B3B3A (dark teal)
bg-light-bg-deep         # #0C0D0E (deep black)
text-light-text-primary  # #1A1A1A (dark text)
text-light-text-light    # #FFFFFF (light text on dark)
text-light-accent-primary # #5BBAB5 (teal accent)
```

**Manual Check:**
```bash
# In browser DevTools:
# 1. Go to http://localhost:3000/
# 2. Inspect LightThemeWrapper sections
# 3. Should show bg-light-* classes in computed styles
```

#### D. Responsive Design Testing

Test on different breakpoints:

**Mobile (375px - iPhone SE)**
- [ ] Header stacks correctly (MobileNav shows)
- [ ] Grid components stack to 1 column
- [ ] Text scales down (no overflow)
- [ ] Buttons stay tappable (48px+ height)

**Tablet (768px - iPad)**
- [ ] 2-column grids render
- [ ] Navigation visible (not mobile-only)
- [ ] Typography at medium scale

**Desktop (1024px+)**
- [ ] 3-4 column grids render
- [ ] Arrows between steps in flows visible
- [ ] Max-width container (screen-xl) centers

**Test with:**
```bash
# Chrome DevTools: Toggle device toolbar (Ctrl+Shift+M)
# Test these viewports:
# - iPhone SE (375x667)
# - iPad (768x1024)
# - Desktop (1440x900)
```

---

## CMS Collections Testing (Requires DATABASE_URL)

### Prerequisites
1. PostgreSQL database (Neon Cloud or local)
2. `DATABASE_URL` set in `.env.local`
3. Payload CMS running on `http://localhost:3001`

### 1. Admin Panel Access
```bash
# Start CMS
cd qrs-cms
npm run dev
# Admin at http://localhost:3001/admin
# Login with admin user (see seed instructions)
```

### 2. Collection Testing

#### ProductShowcase Collection
```bash
# In Payload Admin:
# 1. Collections → ProductShowcase
# 2. Create new entry:
#    - Title: "Dashboard Demo"
#    - Category: "hero"
#    - Published: true
# 3. Upload screenshot image
# 4. Set videoUrl: "https://example.com/demo.mp4"
# 5. Save
# 6. Verify at http://localhost:3000/
```

**Expected:** ProductShowcase component displays image + play button

#### Solutions Collection
```bash
# Collections → Solutions
# Create entry:
#   - roleTitle: "underwriter"
#   - displayName: "Underwriter Solution"
#   - tagline: "Faster underwriting"
#   - challenges: ["Manual review", "Silent assumptions"]
#   - qrsValue: ["Instant recalc", "Full transparency"]
#   - published: true
```

**Test Fetch:**
```bash
# In browser console:
fetch('http://localhost:3001/api/solutions?where[roleTitle][equals]=underwriter')
  .then(r => r.json())
  .then(d => console.log(d.docs[0]))
```

#### RegulatoryCompliance Collection
```bash
# Collections → RegulatoryCompliance
# Create entry:
#   - region: "global"
#   - framework: "soc2"
#   - description: "In progress via Vanta"
#   - published: true
```

#### PlatformCapability Collection
```bash
# Collections → PlatformCapability
# Create entry:
#   - category: "risk-engine"
#   - title: "Real-Time Risk"
#   - description: "Microsecond latency calculations"
#   - published: true
```

#### Documentation Collection
```bash
# Collections → Documentation
# Create entry:
#   - section: "getting-started"
#   - title: "First Steps"
#   - slug: "first-steps"
#   - content: (richText with examples)
#   - codeExamples: [{language: "javascript", code: "const result = qrs.run(...)"}]
#   - published: true

# Test fetch:
# http://localhost:3001/api/documentation?where[slug][equals]=first-steps
```

---

## TypeScript & Build Validation

### 1. Type Checking
```bash
# Frontend type check
cd frontend
npx tsc --noEmit

# Should pass with 0 errors
```

### 2. Build Test
```bash
# Full build
cd c:/laragon/www/qrs-app
npm run build

# Expected output:
# ✓ Compiled successfully
# ✓ Running TypeScript ...
# ✓ Generating static pages
```

**Expected Duration:** 20-30 seconds

### 3. Production Build Preview
```bash
# After npm run build:
cd frontend
npm run start

# Server at http://localhost:3000
# Test 5-10 key routes verify prerendered correctly
```

---

## Component Import Verification

### Ensure All New Components Are Exported

**Check these files export correctly:**

```bash
# Check component exports
grep -r "export.*function" frontend/components/marketing/ | grep -E "(ProductShowcase|VerificationFlow|RiskEngineShowcase|QuantumArchitecture|SolutionCard|ComplianceBadge|LightThemeWrapper)"
```

**Should output:**
```
ProductShowcase.tsx:export function ProductShowcase(
VerificationFlow.tsx:export function VerificationFlow(
RiskEngineShowcase.tsx:export function RiskEngineShowcase(
QuantumArchitecture.tsx:export function QuantumArchitecture(
SolutionCard.tsx:export function SolutionCard(
ComplianceBadge.tsx:export function ComplianceBadge(
LightThemeWrapper.tsx:export function LightThemeWrapper(
```

### Test Component Props TypeScript

```tsx
// In any page, this should type-check:
import { ProductShowcase } from '@/components/marketing/ProductShowcase'
import { SolutionCard } from '@/components/marketing/SolutionCard'

// Correct usage
<ProductShowcase title="Test" imageUrl="/test.jpg" videoUrl="https://test.mp4" />

// Should error on wrong props
// <ProductShowcase invalidProp="test" /> ❌ TypeScript error
```

---

## Fetch Utilities Testing

### Test CMS Fetch Functions

```bash
# Create test file: frontend/lib/test-fetch.ts

import {
  getProductShowcaseItems,
  getSolutions,
  getRegulatoryCompliance,
  getPlatformCapabilities,
  getDocumentation,
  getDocumentationBySlug,
} from '@/lib/cms-fetch'

async function testFetches() {
  console.log('ProductShowcase:', await getProductShowcaseItems())
  console.log('Solutions:', await getSolutions())
  console.log('Regulatory:', await getRegulatoryCompliance())
  console.log('Capabilities:', await getPlatformCapabilities())
  console.log('Docs:', await getDocumentation())
  console.log('Doc by slug:', await getDocumentationBySlug('first-steps'))
}

// Run in browser console after importing
testFetches()
```

---

## Manual Checklist

### Component Rendering ✅
- [ ] ProductShowcase renders without errors
- [ ] VerificationFlow shows 4 steps with arrows
- [ ] RiskEngineShowcase shows 4 feature cards
- [ ] QuantumArchitecture shows 4 layers
- [ ] SolutionCard shows challenges vs value
- [ ] ComplianceBadge shows with correct icon
- [ ] LightThemeWrapper applies light background

### Responsive Design ✅
- [ ] Mobile (375px): Stack correctly, no overflow
- [ ] Tablet (768px): 2-column layout works
- [ ] Desktop (1440px): Full width layouts work

### Type Safety ✅
- [ ] `npm run build` passes TypeScript
- [ ] All components have proper TypeScript interfaces
- [ ] Props required/optional correctly marked

### CMS Collections ✅
- [ ] All 5 collections registered in `payload.config.ts`
- [ ] ProductShowcase collection in admin panel
- [ ] Solutions collection in admin panel
- [ ] RegulatoryCompliance collection in admin panel
- [ ] PlatformCapability collection in admin panel
- [ ] Documentation collection in admin panel

### Fetch Utilities ✅
- [ ] `getProductShowcaseItems()` callable
- [ ] `getSolutions()` callable
- [ ] `getRegulatoryCompliance()` callable
- [ ] `getPlatformCapabilities()` callable
- [ ] `getDocumentation()` callable
- [ ] All fetch functions handle CMS unavailable gracefully

### Theme ✅
- [ ] Light theme colors in Tailwind config
- [ ] LightThemeWrapper applies correct bg class
- [ ] Text contrast meets WCAG AA (4.5:1 minimum)

---

## Debugging Tips

### No Components Showing
```bash
# Check these imports exist:
ls -la frontend/components/marketing/ | grep -E "(ProductShowcase|Verification|RiskEngine|Quantum|Solution|Compliance|Light)"

# Check tailwind.config.ts has light color palette
grep "light" frontend/tailwind.config.ts
```

### CMS Fetch Errors
```bash
# 1. Verify env variables
echo $NEXT_PUBLIC_CMS_URL
# Should output: http://localhost:3001

# 2. Check CMS is running
curl http://localhost:3001/api/product-showcase
# Should return JSON, not connection error

# 3. Check payload.config.ts imports all collections
grep "ProductShowcase\|Solutions\|RegulatoryCompliance\|PlatformCapability\|Documentation" qrs-cms/payload.config.ts
```

### TypeScript Build Fails
```bash
# Check specific file
npx tsc frontend/lib/cms-fetch.ts --noEmit

# Show all errors
npm run build 2>&1 | grep "Type error" -A 3
```

### Component Props Wrong
```bash
# Check component interface
grep "interface.*Props" frontend/components/marketing/ProductShowcase.tsx
# Verify all props optional or have defaults
```
