# QRS Quick Reference Guide

## 🚀 Start Here

### Local Development
```bash
# Terminal 1: Frontend
cd frontend
npm run dev
# Visit: http://localhost:3000

# Terminal 2 (Optional): CMS Admin
cd qrs-cms
npm run dev
# Visit: http://localhost:3001/admin (with admin user)
```

### Check Build
```bash
npm run build  # From project root
# Should output: ✓ Compiled successfully
```

---

## 📋 What's Been Built (Phase 1 ✅)

### 7 New Marketing Components
```
ProductShowcase          → Video/image carousel with play button
VerificationFlow         → 4-step verification process
RiskEngineShowcase       → Feature grid for risk engine
QuantumArchitecture      → 4-layer architecture visualization
SolutionCard             → Role-specific challenge/value cards
ComplianceBadge          → Certification status badges
LightThemeWrapper        → Light theme container
```

**Status:** All TypeScript-validated, render with fallback data

### 5 New CMS Collections
```
ProductShowcase          → Hero/demo content (videos, screenshots)
Solutions                → Role-specific pages (underwriter, portfolio, etc)
RegulatoryCompliance     → Framework tracking (SOC2, GDPR, TCFD, etc)
PlatformCapability       → Feature catalog (risk-engine, quantum, ai, etc)
Documentation            → Technical docs with code examples
```

**Status:** Created, not yet seeded (awaiting assets)

### Light Institutional Theme
```
Colors:
  light-bg-primary       #F4F6F6 (light gray background)
  light-bg-dark          #1B3B3A (dark teal)
  light-accent-primary   #5BBAB5 (teal accent)
  light-text-primary     #1A1A1A (dark text)
  
Usage:
  <div className="bg-light-bg-primary text-light-text-primary">
    Light themed content
  </div>
```

**Status:** Added to tailwind.config.ts, ready to use

### CMS Fetch Utilities (11 Functions)
```
getProductShowcaseItems()
getProductShowcaseByCategory(category)
getSolutions()
getSolutionByRole(roleTitle)
getRegulatoryCompliance()
getRegulatoryByRegion(region)
getPlatformCapabilities()
getPlatformCapabilityByCategory(category)
getDocumentation()
getDocumentationBySection(section)
getDocumentationBySlug(slug)
```

**Status:** All written, tested in browser console

---

## 🧪 Testing Components (No DB Required)

### Visual Inspection
```bash
# 1. Start dev server
npm run dev

# 2. Visit each page
http://localhost:3000/              # Home (TrustBadgeCluster visible)
http://localhost:3000/about         # About page
http://localhost:3000/platform      # Platform page
http://localhost:3000/trust         # Trust & Security (VerifiedSealBadge, TrustBadgeCluster)
http://localhost:3000/validation    # Validation page

# 3. Check console for CMS warnings (expected if DB not set)
# 4. Verify light theme sections have correct bg colors
```

### Component Import Test
```tsx
// In any page:
import { ProductShowcase } from '@/components/marketing/ProductShowcase'
import { RiskEngineShowcase } from '@/components/marketing/RiskEngineShowcase'
import { QuantumArchitecture } from '@/components/marketing/QuantumArchitecture'
import { SolutionCard } from '@/components/marketing/SolutionCard'
import { ComplianceBadge } from '@/components/marketing/ComplianceBadge'

// All should render without errors
<ProductShowcase title="Test" imageUrl="/test.jpg" />
<RiskEngineShowcase />
<QuantumArchitecture />
<SolutionCard 
  title="Test" 
  tagline="Test" 
  challenges={['a']}
  value={['b']}
/>
<ComplianceBadge framework="SOC2" status="in-progress" />
```

### Responsive Testing
```bash
# Chrome DevTools: Ctrl+Shift+M (Device Toolbar)
# Test: iPhone SE (375px), iPad (768px), Desktop (1440px)

# Should NOT see:
# - Horizontal scrolling
# - Text overflow
# - Broken layouts
# - Unreadable type
```

---

## 🏗️ Architecture Overview

### Page Structure
```
Public Pages (no auth required)
  / (home)
  /about
  /platform
  /trust
  /validation
  /docs
  /privacy, /terms, /security, /cookies, /support (static stubs)

Auth Pages
  /login
  /signup
  
User Dashboard (auth required)
  /dashboard (profile, settings)
  /admin (admin/super-admin only)
```

### Component Hierarchy
```
Pages (app/*/page.tsx)
  ↓
Layout Components (Header, Footer, SiteChrome)
  ↓
Marketing Components (ProductShowcase, QuantumArchitecture, etc)
  ↓
UI Primitives (Button, Badge, Card, etc)
  
Data Flow:
Pages fetch from cms-fetch.ts
  ↓
CMS REST API (http://localhost:3001/api/*)
  ↓
Fallback hardcoded data if CMS unavailable
```

### File Locations
```
frontend/
  app/               # Pages & routes
  components/        # React components
    marketing/       # Brand components (NEW)
    layout/         # Header, Footer, Chrome
    ui/             # Primitives
  lib/               # Utilities
    cms-fetch.ts    # CMS client (NEW)
    payload.ts      # Local API skeleton (NOT USED)
  styles/            # Global styles
  tailwind.config.ts # Theme colors (UPDATED)

qrs-cms/
  collections/       # CMS data models
    ProductShowcase.ts  # (NEW)
    Solutions.ts        # (NEW)
    RegulatoryCompliance.ts  # (NEW)
    PlatformCapability.ts    # (NEW)
    Documentation.ts         # (NEW)
  payload.config.ts  # Register collections
```

---

## 🔧 Common Tasks

### Test a Component in Isolation
```bash
# Create temporary test file
cat > frontend/test-component.tsx << 'EOF'
import { ProductShowcase } from '@/components/marketing/ProductShowcase'

export default function Test() {
  return (
    <ProductShowcase
      title="Test Component"
      description="This is a test"
      imageUrl="https://via.placeholder.com/800x600"
    />
  )
}
EOF

# Import in a page to test, then delete
# rm frontend/test-component.tsx
```

### Check Component Props
```bash
# Find interface definition
grep -A 20 "interface.*Props" frontend/components/marketing/ProductShowcase.tsx

# Should show all available props with types
```

### Fetch CMS Data in Browser Console
```javascript
// Check if data is being fetched
fetch('http://localhost:3001/api/product-showcase?where[published][equals]=true')
  .then(r => r.json())
  .then(d => console.log(d.docs))

// Should return array of ProductShowcase entries (or empty if none seeded)
```

### Verify TypeScript
```bash
cd frontend
npx tsc --noEmit

# Should output:
# (no output means 0 errors)
```

### Check Build Output
```bash
npm run build 2>&1 | tail -50

# Look for:
# ✓ Compiled successfully
# ✓ Generating static pages (31/31)
# 0 errors
```

---

## 📊 Feature Status Dashboard

| Feature | Status | Notes |
|---------|--------|-------|
| **ProductShowcase** | ✅ Ready | Render test on home |
| **VerificationFlow** | ✅ Ready | Test import in page |
| **RiskEngineShowcase** | ✅ Ready | Test import in page |
| **QuantumArchitecture** | ✅ Ready | Test import in page |
| **SolutionCard** | ✅ Ready | Test with sample props |
| **ComplianceBadge** | ✅ Ready | Test status variants |
| **LightThemeWrapper** | ✅ Ready | Check bg-light-* classes |
| **CMS Collections** | ✅ Ready | Awaiting seed data |
| **CMS Fetch** | ✅ Ready | Test in browser console |
| **Light Theme** | ✅ Ready | Apply to pages |
| **Build** | ✅ Passing | TypeScript: 0 errors |
| **Cookie Consent** | 🔴 TODO | Components ready, not wired |
| **Redirect Manager** | 🔴 TODO | Collection/fetch ready, no route |

---

## ⚠️ Known Issues & Workarounds

### Issue: CMS Fetch Returns Empty Array
**Cause:** DATABASE_URL not set or CMS server not running
**Solution:** Start CMS or use fallback content (components handle this)
```bash
# Check env
echo $NEXT_PUBLIC_CMS_URL  # Should be http://localhost:3001
echo $DATABASE_URL          # Should be set if using CMS

# Test CMS is running
curl http://localhost:3001/api/pages
# Should return {"docs": [...]}
```

### Issue: Components Not Showing on Page
**Cause:** Not imported or not rendered
**Solution:** 
```bash
# Check component exists
ls frontend/components/marketing/ProductShowcase.tsx

# Check import in page
grep "ProductShowcase" frontend/app/(frontend)/page.tsx

# Check render in JSX
grep "<ProductShowcase" frontend/app/(frontend)/page.tsx
```

### Issue: TypeScript Errors at Build
**Cause:** Wrong component props
**Solution:**
```bash
# Check props interface
grep -A 15 "interface.*Props" frontend/components/marketing/ProductShowcase.tsx

# Check page usage
grep -C 3 "<ProductShowcase" frontend/app/(frontend)/page.tsx

# Align props with interface
```

### Issue: Light Theme Colors Not Applying
**Cause:** Typo in class name
**Solution:**
```bash
# Check config has light colors
grep "light-bg-primary" frontend/tailwind.config.ts

# Check class name spelling
# ✅ bg-light-bg-primary  (correct)
# ❌ bg-light-primary     (wrong)
# ❌ light-bg-primary     (missing bg- prefix)
```

---

## 📚 Key Files to Know

| File | Purpose | Last Updated |
|------|---------|--------------|
| `frontend/components/marketing/ProductShowcase.tsx` | Video carousel component | 2026-08-03 |
| `frontend/components/marketing/VerificationFlow.tsx` | Verification flow component | 2026-08-03 |
| `frontend/components/marketing/RiskEngineShowcase.tsx` | Risk engine grid | 2026-08-03 |
| `frontend/components/marketing/QuantumArchitecture.tsx` | Architecture layers | 2026-08-03 |
| `frontend/components/marketing/SolutionCard.tsx` | Solution cards | 2026-08-03 |
| `frontend/components/marketing/ComplianceBadge.tsx` | Compliance badges | 2026-08-03 |
| `frontend/components/marketing/LightThemeWrapper.tsx` | Light theme wrapper | 2026-08-03 |
| `frontend/lib/cms-fetch.ts` | CMS client utilities | 2026-08-03 |
| `frontend/tailwind.config.ts` | Theme configuration | 2026-08-03 |
| `qrs-cms/payload.config.ts` | CMS setup | 2026-08-03 |
| `qrs-cms/collections/ProductShowcase.ts` | ProductShowcase model | 2026-08-03 |
| `qrs-cms/collections/Solutions.ts` | Solutions model | 2026-08-03 |
| `qrs-cms/collections/RegulatoryCompliance.ts` | Compliance model | 2026-08-03 |
| `qrs-cms/collections/PlatformCapability.ts` | Capabilities model | 2026-08-03 |
| `qrs-cms/collections/Documentation.ts` | Documentation model | 2026-08-03 |

---

## 🎯 Next Steps

### Week 1: Asset Collection
- [ ] Gather product screenshots from team
- [ ] Save to `/public/` directory
- [ ] Seed CMS collections with asset URLs

### Week 2: Homepage Integration
- [ ] Update home page with ProductShowcase
- [ ] Add QuantumArchitecture section
- [ ] Add RiskEngineShowcase section
- [ ] Wire up PerilStatus collection

### Week 3: New Pages
- [ ] Create /solutions/ page (SolutionCard grid)
- [ ] Create /product/ page (ProductShowcase + details)
- [ ] Create /regulatory/ page (ComplianceBadge grid)

### Week 4: Compliance
- [ ] Implement cookie consent
- [ ] Add legal content to static pages
- [ ] Set up form submission logging

---

## 📞 Support

### Documentation Files
- **TESTING_GUIDE.md** — How to test everything
- **ARCHITECTURE.md** — Complete architecture overview
- **IMPLEMENTATION_CHECKLIST.md** — Detailed status of all work

### Quick Checks
```bash
# Everything working?
npm run build

# TypeScript OK?
npx tsc --noEmit

# Components exist?
ls frontend/components/marketing/

# CMS collections registered?
grep "ProductShowcase\|Solutions\|RegulatoryCompliance\|PlatformCapability\|Documentation" qrs-cms/payload.config.ts

# Local dev running?
curl http://localhost:3000/
```

### Last Commit
```
87d5837 - Phase 1 Foundation Complete
  - 5 CMS collections created
  - 7 marketing components built
  - Light theme palette added
  - 11 fetch utilities ready
```
