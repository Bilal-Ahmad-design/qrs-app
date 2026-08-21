# CMS Setup Guide - Making Frontend Fully Dynamic

**Status:** Frontend pages now fetch all content from Payload CMS with fallback to defaults.

## Overview

All frontend pages are now configured to be **100% CMS-driven**. The architecture works as follows:

1. Frontend pages attempt to fetch sections from CMS PageSections collection
2. If CMS is unavailable or empty, pages fall back to hardcoded defaults
3. When CMS content is available, it completely overrides defaults

**Pages Updated:**
- ✅ Home (`/`)
- ✅ Platform (`/platform`)
- ✅ Verify (`/verify`) - NEW
- ✅ Solutions (`/solutions`) - NEW
- ✅ Regulatory (`/regulatory`) - NEW
- ✅ Trust (`/trust`)
- ✅ Validation (`/validation`)
- ✅ About (`/about`)

---

## How to Populate CMS

### 1. Access Payload CMS Admin

Start both servers:
```bash
# Terminal 1: Backend (Payload CMS)
cd qrs-cms
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

Navigate to: **http://localhost:3000/admin**

### 2. Create Page Sections

1. Go to **Page Sections** collection in admin
2. Click **Create New**
3. Fill in the form:

#### Required Fields (All Sections)
- **Page:** Select which page (home, platform, verify, solutions, regulatory, trust, validation, about)
- **Section Type:** Select the section type (hero, feature-grid, text-image, cta, stats, workflow-steps, product-evidence, regulatory-grid, security-compliance, security-features-grid)
- **Title:** Internal section title (for admin use)
- **Display Order:** Order number (0, 1, 2, etc.)
- **Published:** Check this to make section live

#### Conditional Fields (Depend on Section Type)

**Hero Section (`sectionType: 'hero'`):**
- Subtitle (optional badge text)
- Heading (main title, supports HTML)
- Description (main content, supports HTML)
- Background Image (upload or URL)
- Video URL (optional MP4 background)
- Button Text & URL
- Secondary Button Text & URL

**Feature Grid (`sectionType: 'feature-grid'`):**
- Heading
- Description
- Items array:
  - Title
  - Description
  - Icon (optional)
  - Status (validated/illustrative/roadmap)
  - Link (optional)

**Workflow Steps (`sectionType: 'workflow-steps'`):**
- Heading
- Description
- Items array (3-4 items):
  - Title
  - Description

**Regulatory Grid (`sectionType: 'regulatory-grid'`):**
- Heading
- Items array:
  - Title
  - Description

**Text + Image (`sectionType: 'text-image'`):**
- Heading
- Description
- Image URL
- Button Text & URL

**CTA Block (`sectionType: 'cta'`):**
- Heading
- Description
- Button Text & URL

**Background Style (All Sections):**
- light (cream-50)
- white
- light-institutional (institutional theme)
- dark (ink-800)
- deep-dark (ink-900)

---

## Example: Creating Verify Page Sections

### Section 1: Hero
```
Page: verify
Section Type: hero
Title: Built to be Verified
Subtitle: Cryptographic Verification
Heading: Built to be Verified
Description: Every calculation is cryptographically signed. Every result can be independently verified.
Background Style: dark
Button Text: Request Demo
Button URL: /contact
Order: 0
Published: ✓
```

### Section 2: Features Grid
```
Page: verify
Section Type: feature-grid
Title: Verification Features
Heading: Lineage Verified Seal
Description: Every QRS result includes a cryptographic seal
Background Style: light-institutional
Items:
  1. Title: "Methodology"
     Description: "The exact methodology and parameters used"
     Status: validated
  2. Title: "Cryptographic Hash"
     Description: "Hash of all input data"
     Status: validated
  3. Title: "Digital Signature"
     Description: "ECDSA digital signature"
     Status: validated
  4. Title: "Timestamp & Audit"
     Description: "Timestamp and audit trail"
     Status: validated
Order: 1
Published: ✓
```

### Section 3: Workflow Steps
```
Page: verify
Section Type: workflow-steps
Title: Verification Process
Heading: Verification Workflow
Background Style: light-institutional
Items:
  1. Title: "Run Analysis"
     Description: "Execute your catastrophe model on QRS"
  2. Title: "Receive Seal"
     Description: "Get cryptographic seal with results"
  3. Title: "Independent Verify"
     Description: "Share with auditors for verification"
Order: 2
Published: ✓
```

---

## Data Flow: CMS to Frontend

```
1. User visits: https://qrs.io/verify
   ↓
2. Next.js page component: app/(frontend)/verify/page.tsx
   ↓
3. Calls getPageSections('verify') from lib/cms-fetch.ts
   ↓
4. CMS Fetch API:
   GET http://localhost:3001/api/page-sections?page=verify&published=true&sort=order
   ↓
5. If successful: Render CMS sections via SectionRenderer
   If failed: Fall back to defaultVerifySections
   ↓
6. SectionRenderer component renders each section based on sectionType
   ↓
7. User sees fully rendered page
```

---

## CMS Collections Used

### PageSections Collection
- **Purpose:** Store page section blocks
- **Slug:** `page-sections`
- **Fields:**
  - page (select: home, platform, verify, solutions, regulatory, trust, validation, about)
  - sectionType (select: hero, feature-grid, text-image, cta, stats, workflow-steps, product-evidence, regulatory-grid, security-compliance, security-features-grid)
  - title, heading, description (text/richText)
  - items (array of cards/features)
  - backgroundStyle (select: light, white, light-institutional, dark, deep-dark)
  - order (number)
  - published (checkbox)
  - imageUrl, videoUrl, buttonText, buttonUrl (conditional)

### PerilStatus Collection
- **Purpose:** Store peril/model status information
- **Fields:**
  - name (e.g., "Hurricane")
  - status (select: validated, illustrative, roadmap)
  - order (number)
  - published (checkbox)

### Solutions Collection
- **Purpose:** Store role-based solutions
- **Fields:**
  - roleTitle (e.g., "Underwriters")
  - description
  - features (array of feature items)
  - order (number)
  - published (checkbox)

### RegulatoryCompliance Collection
- **Purpose:** Store regulatory framework information
- **Fields:**
  - framework (e.g., "Solvency II")
  - region (e.g., "European Union")
  - description
  - capabilities (array)
  - order (number)
  - published (checkbox)

---

## Testing

### 1. Test with CMS Running
```bash
# Both servers running
# Navigate to http://localhost:3000/verify
# Should show sections from CMS PageSections collection
```

### 2. Test with CMS Offline
```bash
# Stop qrs-cms server
# Navigate to http://localhost:3000/verify
# Should show default sections (fallback works)
```

### 3. Verify in Production Build
```bash
cd frontend
npm run build
# Should compile successfully
# All pages marked as ƒ (dynamic) when they fetch from CMS
```

---

## Cache Invalidation

Pages cache CMS content for 3600 seconds (1 hour):
```typescript
next: { revalidate: 3600 }
```

To refresh immediately during development:
1. Restart frontend server (Hot reload won't pick up CMS changes)
2. Or modify the revalidate value in cms-fetch.ts for development

---

## Adding New Page Sections

### Step 1: Add to PageSections Collection
Create a new section in the Payload CMS admin panel

### Step 2: Frontend Automatically Picks It Up
The page will fetch and render it automatically via SectionRenderer

### Step 3: Add Fallback Default (Optional)
Update `frontend/lib/default-sections.ts` if you want offline fallback

---

## Removing Hardcoded Content

The following have been replaced with CMS-driven content:

**Removed Hardcoded Pages:**
- ✅ /verify - Now fetches from CMS
- ✅ /solutions - Now fetches from CMS
- ✅ /regulatory - Now fetches from CMS

**Removed Hardcoded Data:**
- ✅ Crisis statistics (from home page default-sections)
- ✅ Peril grid (now uses PerilStatus collection)
- ✅ Platform capabilities (from platform collection)
- ✅ Solutions by role (from Solutions collection)
- ✅ Regulatory frameworks (from RegulatoryCompliance collection)

---

## Frontend Architecture

### Pages (All CMS-Driven)
```
(frontend)/
├── page.tsx              ← Home (CMS + defaults)
├── platform/page.tsx     ← Platform (CMS + defaults)
├── verify/page.tsx       ← Verify (CMS + defaults) ← NEW
├── solutions/page.tsx    ← Solutions (CMS + defaults) ← NEW
├── regulatory/page.tsx   ← Regulatory (CMS + defaults) ← NEW
├── trust/page.tsx        ← Trust (CMS + defaults)
├── validation/page.tsx   ← Validation (CMS + defaults)
└── about/page.tsx        ← About (CMS + defaults)
```

### Components
- **SectionRenderer:** Renders any section type dynamically
- **Components used:** ProductShowcase, VerificationFlow, SecurityFeaturesGrid, etc.

### CMS Fetch
```
lib/cms-fetch.ts:
├── getPageSections('page-name')        ← Fetch all sections for a page
├── getSettings()                        ← Fetch global settings
├── getPerilStatuses()                   ← Fetch peril data
├── getSolutions()                       ← Fetch solutions
└── getRegulatoryCompliance()           ← Fetch frameworks
```

---

## Summary

✅ **Frontend is now 100% CMS-editable:**
- Pages fetch from CMS PageSections collection
- All content can be managed without code changes
- Fallback to defaults ensures pages work offline
- Build passes with TypeScript strict mode

✅ **Next Steps:**
1. Start Payload CMS admin
2. Create sections in PageSections collection for each page
3. Set Published: true to make them live
4. Frontend automatically picks up changes (on next revalidation cycle)

---

## Troubleshooting

**Issue:** Pages show defaults instead of CMS content
- **Solution:** Check CMS is running on http://localhost:3001
- Check PageSections collection has entries for that page
- Check `published: true` is set
- Restart frontend to clear cache

**Issue:** Section doesn't render correctly
- **Solution:** Verify `sectionType` matches section handler in SectionRenderer.tsx
- Check all required fields are filled in CMS
- Verify `backgroundStyle` is valid

**Issue:** Images not showing
- **Solution:** Use absolute URLs or paths relative to CMS root
- Test image URLs directly in browser: `http://localhost:3001/path-to-image`

---

For questions or issues, refer to Payload CMS docs: https://payloadcms.com/docs
