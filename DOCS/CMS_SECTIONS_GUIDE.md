# CMS Sections Management Guide

## Overview

Every section on the website is now **fully editable from the Payload CMS admin panel**. You can add, edit, delete, and reorder sections without touching code.

### Key Benefits
✅ **No coding required** to change content
✅ **Placeholder content** always shows if CMS data unavailable
✅ **Multiple section types** (hero, grid, text+image, CTA, stats)
✅ **Instant updates** - save in CMS, see live immediately
✅ **Per-page organization** - all sections for each page grouped together

---

## CMS-Driven Pages

These pages pull all content from **PageSections** collection:
- **Home** (`/`)
- **About** (`/about/`)
- **Platform** (`/platform/`)
- **Trust & Security** (`/trust/`)
- **Validation** (`/validation/`)

### How It Works

```
User visits /
  ↓
Frontend fetches: GET /api/page-sections?where[page][equals]=home
  ↓
CMS returns all published sections for "home" page
  ↓
Sorted by `order` field (0, 1, 2, ...)
  ↓
SectionRenderer renders each based on `sectionType`
  ↓
If CMS unavailable → fallback to placeholder sections
  ↓
Browser shows complete page with CMS or placeholder content
```

---

## Creating a Section in Admin

### Step 1: Go to Payload Admin
```
http://localhost:3001/admin
```

### Step 2: Navigate to Collections → Page Sections
Click on **Page Sections** in the left sidebar

### Step 3: Click "Create New"
Fill out the form:

```
Page:              [home, about, platform, trust, validation, etc]
Section Type:      [hero, feature-grid, text-image, cta, stats, custom]
Title:             My Section Title
Subtitle:          Optional tagline
Heading:           H1/H2 text (HTML supported)
Description:       Main body text (HTML supported)
Background Style:  [dark, light, white, light-institutional, deep-dark]
Button Text:       "Request Demo" (optional)
Button URL:        "/platform" (optional)
Secondary Button:  (optional)
Items:             Array of cards/features
Order:             0 (comes first), 1, 2, etc
Published:         ☑ true (to show on website)
```

### Step 4: Save
Click **Save** → Section appears on website immediately

---

## Section Types

### 1. **Hero Section**
Full-width banner with title + subtitle + buttons

**Fields used:**
- `heading` - Main H1 title
- `subtitle` - Badge text above title
- `description` - Subheading text
- `buttonText` + `buttonUrl` - Primary CTA
- `secondaryButtonText` + `secondaryButtonUrl` - Secondary CTA
- `backgroundStyle` - Background color

**Example:** Home page hero (patent badge + headline + demo button)

---

### 2. **Feature Grid**
2-4 column grid of cards/features

**Fields used:**
- `title` - Section heading
- `items[]` - Array of features with:
  - `title` - Feature name
  - `description` - Feature detail
  - `icon` - Emoji or icon name
  - `value` - Number/stat (for stats section)
  - `link` - URL (optional)

**Example:** Platform "Core Capabilities" section (3 cards)

---

### 3. **Text + Image**
Side-by-side layout with text on left, image on right

**Fields used:**
- `heading` - Section title
- `description` - Body text (HTML OK)
- `imageUrl` - Image URL
- `buttonText` + `buttonUrl` - CTA (optional)

**Example:** Mission section with team image

---

### 4. **CTA (Call-to-Action)**
Centered banner for promotions

**Fields used:**
- `heading` - Large title
- `description` - Subheading
- `buttonText` + `buttonUrl` - Button
- `backgroundStyle` - Background

**Example:** "Ready to move institutional capital?" banner

---

### 5. **Stats**
Multi-column stat display with large numbers

**Fields used:**
- `title` - Section heading
- `items[]` - Stats with:
  - `value` - Number/statistic ($10B+, 14x, etc)
  - `title` - Stat name (Insured Losses, Model Divergence, etc)
  - `description` - Explanation

**Example:** "The Crisis" section with $10B+, $8-12B, 300%, 14x

---

### 6. **Custom**
Generic section with heading + description + content

**Fields used:**
- `heading`
- `description`
- `content` - JSON object for custom data
- `backgroundStyle`

---

## Reordering Sections

1. Go to **Page Sections**
2. View all sections for a page
3. Click on each section → Edit → Update **Order** field
4. Save each section
5. Refresh website to see new order

**Order values:** 0 (first), 1, 2, 3, etc

---

## Editing Existing Sections

### Find the Section
1. **Page Sections** → Filter by page (home, about, etc)
2. Click the section title to open

### Update Content
- Edit `heading`, `description`, button text, etc
- Add/remove items from array
- Change background style
- Adjust order
- Toggle **Published** checkbox to hide/show

### Save
Click **Save** → Updates appear on website

---

## Default/Placeholder Content

Each page has **default sections** that appear when CMS is unavailable.

### For Home Page:
```
1. Hero (Patent badge + headline)
2. Active Models (4 peril indicators)
3. Verifiable by Design
4. AI-Native Architecture
5. The Crisis (stats)
6. How It Works (4 steps)
7. Independently Validated (reports)
8. Enterprise CTA
```

### For About Page:
```
1. Hero
2. Our Mission
3. Why Verifiable Risk?
4. Built by Risk Experts
```

### For Platform Page:
```
1. Hero
2. Core Capabilities
```

### For Trust Page:
```
1. Hero
2. Security & Compliance
```

### For Validation Page:
```
1. Hero
2. Validation Reports
3. Validation Methodology
```

---

## Common Tasks

### Add a New Section to Homepage
1. Page Sections → Create New
2. Page: `home`
3. Section Type: `feature-grid`
4. Title: "Why Choose QRS"
5. Items: Add 3-4 features
6. Order: `8` (after CTA, new section at end)
7. Published: ☑
8. Save

→ Homepage now shows new section!

### Hide a Section Temporarily
1. Find section in Page Sections
2. Click to edit
3. Uncheck **Published**
4. Save

→ Section disappears from website but data is saved

### Change Section Background Color
1. Edit section
2. Update **Background Style**:
   - `dark` = Dark teal (ink-800)
   - `light` = Light gray (cream-50)
   - `white` = White
   - `light-institutional` = Light gray (#F4F6F6)
   - `deep-dark` = Very dark (ink-900)
3. Save

---

## Advanced: Custom JSON Content

The **content** field accepts JSON for custom section data:

```json
{
  "customKey": "value",
  "array": [1, 2, 3],
  "nested": {
    "field": "data"
  }
}
```

Can be accessed in future updates for special section types.

---

## Adding Images

### Upload Via Media Collection
1. Collections → Media
2. Click "Create New"
3. Upload image file
4. Click image thumbnail → Copy URL
5. Paste URL into section's `imageUrl` field

### Or Use Direct URLs
- Upload to CDN (e.g., Cloudinary, S3, Vercel Blob)
- Paste full URL in `imageUrl`

---

## HTML in Rich Text Fields

`heading` and `description` fields support HTML:

```html
<strong>Bold text</strong>
<em>Italic text</em>
<a href="/link">Link text</a>
<br>
Line break
```

### Rich Text Editor Features
- Bold, italic, underline
- Lists (bullet, numbered)
- Links
- Code blocks
- Headings (H1-H6)

---

## Testing Changes

### Live Testing (No Rebuild Required)
1. Edit section in CMS admin
2. Click **Save**
3. Refresh browser tab showing the page
4. Changes appear immediately!

### CMS Not Running?
- Sections fall back to placeholder content
- Website still renders completely
- Edit CMS and re-publish when ready

---

## Troubleshooting

### Section Not Showing on Website
1. ✓ Check **Published** checkbox is enabled
2. ✓ Verify **Page** matches the right page
3. ✓ Check **Order** value (should be sorted)
4. ✓ Refresh page browser cache (Ctrl+Shift+R)

### Images Not Loading
1. ✓ Verify `imageUrl` is correct URL (try in browser)
2. ✓ Check image exists (404 error?)
3. ✓ Use full URL, not relative path

### Text Not Appearing
1. ✓ Check **Published** is enabled
2. ✓ Verify `heading` or `description` is filled
3. ✓ Check for HTML errors if using rich text

### Sections Out of Order
1. ✓ Check each section's `order` value
2. ✓ Make sure values are sequential (0, 1, 2, 3...)
3. ✓ Save each section after updating order

---

## Collection Structure

```typescript
PageSections {
  page: "home" | "about" | "platform" | "trust" | "validation" | ...
  sectionType: "hero" | "feature-grid" | "text-image" | "cta" | "stats" | "custom"
  title: string                 // Section name in admin
  subtitle?: string             // Badge text (hero only)
  heading?: string              // H1/H2 title (HTML OK)
  description?: string          // Body text (HTML OK)
  backgroundStyle?: string      // dark | light | white | light-institutional | deep-dark
  items?: [                      // Array of cards/features
    {
      title?: string            // Item title
      description?: string      // Item description
      icon?: string             // Emoji
      value?: string            // Stat number
      link?: string             // URL
    }
  ]
  imageUrl?: string             // Featured image
  videoUrl?: string             // Featured video
  buttonText?: string           // Primary button text
  buttonUrl?: string            // Primary button URL
  secondaryButtonText?: string  // Secondary button text
  secondaryButtonUrl?: string   // Secondary button URL
  order: number                 // Sort order (0, 1, 2, ...)
  published: boolean            // Show on website
}
```

---

## Quick Reference

| Task | Steps |
|------|-------|
| **Add section** | Page Sections → Create → Fill form → Save |
| **Edit section** | Page Sections → Click title → Edit → Save |
| **Delete section** | Page Sections → Click section → Delete button |
| **Reorder** | Edit each section → Change `order` field → Save |
| **Hide section** | Edit → Uncheck `published` → Save |
| **Change colors** | Edit → Change `backgroundStyle` → Save |
| **Add image** | Upload via Media → Copy URL → Paste in `imageUrl` |
| **Test changes** | Save → Refresh browser → See updates |

---

## Next Steps

1. **Start CMS:** `cd qrs-cms && npm run dev`
2. **Login:** http://localhost:3001/admin
3. **Create section:** Collections → Page Sections → Create New
4. **Publish:** Check Published → Save
5. **View live:** http://localhost:3000/

Every section is now 100% editable from the CMS! 🎉
