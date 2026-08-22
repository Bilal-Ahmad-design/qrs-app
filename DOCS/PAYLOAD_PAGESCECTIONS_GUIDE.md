# Payload CMS - Page Sections Guide

**✅ VERIFIED Configuration**

---

## PageSections Collection Fields

### Always Available (for all section types):

1. **Page** (Select) - Choose which page
   - Home
   - Platform
   - About
   - Trust & Security
   - Validation
   - Solutions
   - Verify
   - Regulatory

2. **Section Type** (Select) - Choose section layout
   - Hero
   - Feature Grid
   - Text + Image
   - CTA Block
   - Stats
   - Workflow Steps
   - Product Evidence
   - Regulatory Grid
   - Security Compliance
   - Security Features Grid

3. **Section Title (Internal)** (Text) - Label for CMS only

4. **Background Color** (Select)
   - Light (cream-50)
   - White
   - Light Institutional
   - Dark (ink-800)
   - Deep Dark (ink-900)

5. **Display Order** (Number) - Priority for rendering

6. **Published** (Checkbox) - Enable/disable this section

---

## Conditional Fields (appear based on Section Type)

### Hero Section ONLY shows:

✅ **Subtitle/Badge Text** (Text)
- The text in the top badge above heading

✅ **Heading** (Rich Text)
- Main title/headline

✅ **Description** (Rich Text)
- Subtitle/description text

✅ **Image URL** (Text)
- Background/device frame image URL
- **REQUIRED for device frame to display**

✅ **Video URL (MP4)** (Text)
- Background video URL
- **ONLY appears for Hero sections**
- Must be MP4 format

✅ **Button Text** (Text)
- Primary CTA button label

✅ **Button URL** (Text)
- Primary CTA button link

✅ **Secondary Button Text** (Text)
- Secondary button label (optional)

✅ **Secondary Button URL** (Text)
- Secondary button link (optional)

---

## Feature Grid Section shows:

- Heading (Rich Text)
- Description (Rich Text)
- Items/Cards (Array) with:
  - Title
  - Description
  - Icon (emoji)
  - Status Badge (Validated/Illustrative/Roadmap)
  - Link URL

---

## Text + Image Section shows:

- Heading (Rich Text)
- Description (Rich Text)
- Image URL (Text) - Right side image
- Button Text (Text)
- Button URL (Text)

---

## CTA Block Section shows:

- Heading (Rich Text)
- Description (Rich Text)
- Button Text (Text)
- Button URL (Text)

---

## Stats Section shows:

- Heading (Rich Text)
- Items/Cards (Array) with:
  - Title
  - Value/Number
  - Icon (emoji)

---

## How Fields Appear

```
1. Select Section Type: "Hero" ↓

2. Hero-specific fields appear:
   ✅ Subtitle/Badge Text
   ✅ Image URL
   ✅ Video URL (MP4) ← ONLY for Hero!
   ✅ Button Text
   ✅ Button URL
   ✅ Secondary Button Text
   ✅ Secondary Button URL
   
3. Fill them in → Save

4. Frontend fetches and renders
```

---

## To Add Hero with Video & Device Frame

### Step-by-Step:

1. **Go to Payload Admin**
   - http://localhost:3000/admin
   - Click "Page Sections" (in sidebar)

2. **Click "+ Create new"**

3. **Fill in base fields:**
   - Page: `Home`
   - Section Type: **Select "Hero"** ← This enables video/image fields
   - Title: `Home Hero` (internal name)
   - Display Order: `1`

4. **After selecting "Hero", new fields appear:**
   - Heading: `<h1>Run catastrophe models in seconds</h1>`
   - Description: `Release billions in trapped capital`
   - Subtitle: `Enterprise Risk Platform`

5. **Now add media (IMPORTANT):**
   - **Image URL:** Upload to Media collection first, then enter path
     - Example: `/uploads/hero-device-frame.png`
     - This shows in device frame mockup
   
   - **Video URL:** Upload to Media collection first, then enter path
     - Example: `/uploads/hero-background.mp4`
     - This plays as hero background
     - **ONLY appears if section type is "Hero"**

6. **Add buttons:**
   - Button Text: `Start Free Trial`
   - Button URL: `/signup`
   - Secondary Button Text: `Learn More`
   - Secondary Button URL: `/platform`

7. **Save** → Frontend loads automatically

---

## Why You Might Not See Video/Image Fields

### ❌ Common Issues:

1. **Section Type not selected**
   - Fields are conditional — they don't show until Section Type is chosen
   - Solution: Select "Hero" from Section Type dropdown first

2. **Wrong Section Type selected**
   - Video URL only shows for Hero sections
   - Image URL only shows for Hero, Text+Image, Product Evidence
   - Solution: Make sure "Hero" is selected

3. **Fields below the fold**
   - Long form, fields might be lower on page
   - Solution: Scroll down to find Image URL and Video URL fields

4. **CMS not fully loaded**
   - Payload admin sometimes needs refresh
   - Solution: Refresh browser (Ctrl+R or Cmd+R)

---

## Media Library Setup

### Upload Files First:

1. **Go to Media collection**
   - Sidebar → Media

2. **Upload video:**
   - Click "+ Create new"
   - Upload `.mp4` file
   - Note the path (e.g., `/uploads/your-video.mp4`)

3. **Upload poster/screenshot:**
   - Click "+ Create new"
   - Upload `.png` or `.jpg`
   - Note the path (e.g., `/uploads/poster.png`)

4. **Copy paths to Page Sections**
   - Image URL: `/uploads/poster.png`
   - Video URL: `/uploads/your-video.mp4`

---

## Field Conditions (Why they appear/disappear)

```typescript
// From PageSections collection config:

// Subtitle only for Hero
condition: (data) => data?.sectionType === 'hero'

// Image URL for Hero, Text+Image, Product Evidence
condition: (data) =>
  data?.sectionType === 'hero' ||
  data?.sectionType === 'text-image' ||
  data?.sectionType === 'product-evidence'

// Video URL ONLY for Hero
condition: (data) => data?.sectionType === 'hero'

// Buttons for Hero, Text+Image, CTA
condition: (data) =>
  data?.sectionType === 'hero' ||
  data?.sectionType === 'text-image' ||
  data?.sectionType === 'cta'
```

---

## Available Pages

✅ Home  
✅ Platform  
✅ About  
✅ Trust & Security  
✅ Validation  
✅ Solutions  
✅ Verify  
✅ Regulatory  

---

## Frontend Rendering

Once you save a section in Payload:

1. Frontend fetches via `/api/page-sections?page=home`
2. SectionRenderer handles rendering based on sectionType
3. Hero sections:
   - Display video as background (if videoUrl provided)
   - Show poster while video loads (if imageUrl provided)
   - Render device frame with image (if imageUrl provided)
   - Display heading, description, buttons
   - Apply gradient overlay for text readability

---

## Quick Checklist

- [ ] Section Type selected: **"Hero"**
- [ ] Heading filled in
- [ ] Description filled in
- [ ] Image URL added (device frame image)
- [ ] Video URL added (background video)
- [ ] Buttons configured
- [ ] Published checkbox: **checked ✓**
- [ ] Display Order: **1** (for first section)
- [ ] Click **Save**

✅ Done! Frontend will render automatically.

---

## Summary

✅ All fields exist in PageSections collection  
✅ Fields are conditional based on Section Type  
✅ Select "Hero" type to see Video URL field  
✅ Upload media files first, then reference paths  
✅ Frontend fetches and renders automatically  

**If fields still don't appear:**
1. Refresh Payload admin (Ctrl+R)
2. Select Section Type = "Hero"
3. Scroll down to find Image URL and Video URL fields
