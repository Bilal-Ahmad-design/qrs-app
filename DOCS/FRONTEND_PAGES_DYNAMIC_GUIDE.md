# Frontend Pages - Dynamic Content Guide

**Date:** August 22, 2026  
**Status:** ✅ All frontend pages are FULLY DYNAMIC and fetching from Payload CMS  

---

## Quick Summary

✅ **Home** - Dynamic sections + hero with video/image support  
✅ **Platform** - Dynamic sections  
✅ **Solutions** - Dynamic sections  
✅ **Regulatory** - Dynamic sections  
✅ **Trust** - Dynamic sections  
✅ **Verify** - Dynamic sections  
✅ **About** - Dynamic sections  

All pages fetch their content from Payload CMS with fallback to hardcoded defaults if CMS data is unavailable.

---

## How It Works

### 1. Page Structure

Every page follows this pattern:

```typescript
// frontend/app/(frontend)/[page]/page.tsx
import { getPageSections } from '@/lib/cms-fetch'
import { getDefaultSections } from '@/lib/default-sections'
import { SectionRenderer } from '@/components/marketing/SectionRenderer'

export default async function Page() {
  // Fetch from CMS first
  let sections = await getPageSections('page-slug')
  
  // Fall back to defaults if CMS is down
  if (!sections || sections.length === 0) {
    sections = getDefaultSections('page-slug')
  }

  // Sort by order priority
  sections = sections.sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <main>
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </main>
  )
}
```

### 2. Section Types Supported

SectionRenderer handles multiple section types:

#### Hero Section
```typescript
{
  sectionType: 'hero',
  backgroundStyle: 'light-institutional',
  heading: '<h1>Run catastrophe models in seconds</h1>',
  description: 'Release billions in trapped capital.',
  subtitle: 'Enterprise Risk Platform',
  
  // ✅ VIDEO SUPPORT - Now available!
  videoUrl: '/uploads/hero-background.mp4',
  
  // ✅ DEVICE FRAME IMAGE - Now available!
  imageUrl: '/uploads/dashboard-screenshot.png',
  
  buttonText: 'Start Free Trial',
  buttonUrl: '/signup',
  secondaryButtonText: 'Learn More',
  secondaryButtonUrl: '/platform'
}
```

**Hero Features:**
- Background video with autoplay, muted, looping
- Poster image (shown while video loads)
- Gradient overlay for text readability
- Responsive design (mobile to desktop)
- Device frame rendering (laptop mockup with screenshot)
- CTA buttons with link support

#### Feature Grid
```typescript
{
  sectionType: 'feature-grid',
  backgroundStyle: 'light',
  title: 'Key Capabilities',
  items: [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Run models in seconds',
      status: 'validated',
      link: '/learn/speed'
    },
    // ... more items
  ]
}
```

#### Text + Image Section
```typescript
{
  sectionType: 'text-image',
  backgroundStyle: 'light',
  heading: 'Enterprise-Grade Platform',
  description: 'Built for institutional investors.',
  imageUrl: '/uploads/platform-screenshot.png',
  buttonText: 'Explore Platform',
  buttonUrl: '/platform'
}
```

#### Call-to-Action
```typescript
{
  sectionType: 'cta',
  backgroundStyle: 'deep-dark',
  heading: 'Ready to transform your risk analysis?',
  description: 'Start with a free trial.',
  buttonText: 'Get Started',
  buttonUrl: '/signup'
}
```

#### Stats Grid
```typescript
{
  sectionType: 'stats',
  items: [
    { value: '50%', label: 'Faster modeling' },
    // ... more stats
  ]
}
```

#### Other Types
- `workflow-steps` - Step-by-step process
- `regulatory-grid` - Compliance framework grid
- `security-features` - Security highlights with icons
- `data-cards` - 3-column card layout

---

## Home Page Hero - Video & Device Frame

### Current Implementation

The home page hero already supports both video backgrounds and device frame images:

**File:** `frontend/app/(frontend)/page.tsx`

```typescript
export default async function HomePage() {
  const cmsUrl = env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

  // Fetch sections from CMS
  let sections = await getPageSections('home')
  if (!sections || sections.length === 0) {
    sections = getDefaultSections('home')
  }

  sections = sections.sort((a, b) => (a.order || 0) - (b.order || 0))

  return (
    <main className="bg-light-bg-primary">
      {sections.map((section) => (
        <SectionRenderer key={section.id} section={section}>
          {/* Device Frame renders below hero */}
          {section.sectionType === 'hero' && (
            <DeviceFrame
              imageSrc={section.imageUrl ? `${cmsUrl}${section.imageUrl}` : undefined}
              imageAlt={section.title}
            />
          )}
        </SectionRenderer>
      ))}
    </main>
  )
}
```

### SectionRenderer Hero Implementation

**File:** `frontend/components/marketing/SectionRenderer.tsx` (lines 72-160)

Features:
- ✅ Background video with `section.videoUrl`
- ✅ Video poster image (shows while loading)
- ✅ Gradient overlay for text readability
- ✅ Responsive text (mobile to desktop)
- ✅ Call-to-action buttons
- ✅ Subtitle badge
- ✅ autoPlay, muted, loop, playsInline attributes

```typescript
{section.videoUrl && (
  <video
    className="absolute inset-0 w-full h-full object-cover"
    autoPlay={typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches}
    muted
    loop
    playsInline
    poster={`${cmsUrl}${section.imageUrl || '/placeholder.png'}`}
  >
    <source src={`${cmsUrl}${section.videoUrl}`} type="video/mp4" />
  </video>
)}
```

### DeviceFrame Component

**File:** `frontend/components/marketing/DeviceFrame.tsx`

Renders:
- ✅ MacBook frame with traffic lights
- ✅ 16:10 aspect ratio screen
- ✅ Screenshot from CMS (imageUrl)
- ✅ Fallback placeholder if no image
- ✅ Rounded corners with shadow

---

## To Add/Edit Content via Payload CMS

### Step 1: Create a Page Section in Payload

1. Go to `http://localhost:3000/admin` (Payload CMS admin)
2. Navigate to "Page Sections" collection
3. Create a new section with:
   - **Page:** `home` (or any other page slug)
   - **Section Type:** `hero`
   - **Order:** `1` (display first)
   - **Heading:** Your hero title
   - **Description:** Your hero subtitle
   - **Video URL:** `/uploads/your-video.mp4` (from media library)
   - **Image URL:** `/uploads/poster-or-device-frame.png` (from media library)
   - **Button Text:** `Try Now`
   - **Button URL:** `/signup`

### Step 2: Upload Media

1. In Payload admin, go to "Media" collection
2. Upload your video file (MP4 format recommended)
3. Upload your poster/screenshot image (PNG/JPG)
4. Note the file paths (e.g., `/uploads/video.mp4`)
5. Reference these paths in your page section

### Step 3: Frontend Fetches Automatically

The Next.js page will:
1. ✅ Fetch sections on page build (server-side)
2. ✅ Load video and images from CMS
3. ✅ Render hero with video background
4. ✅ Display device frame with screenshot
5. ✅ Show buttons with links

---

## Data Flow

```
┌─────────────────┐
│ Payload CMS     │
│ (Admin Console) │
└────────┬────────┘
         │
         │ REST API
         │ /api/page-sections
         │
┌────────▼────────────────────┐
│ Next.js Server Component    │
│ getPageSections('home')     │
└────────┬────────────────────┘
         │
         │ Renders sections
         │
┌────────▼────────────────────┐
│ SectionRenderer Component   │
│ (handles all types)         │
└────────┬────────────────────┘
         │
         │ Renders HTML
         │
┌────────▼────────────────────┐
│ Browser                     │
│ (displays video, images)    │
└─────────────────────────────┘
```

---

## Fallback System

If Payload CMS is down or unavailable:

1. **Fetch fails** → `getPageSections()` returns `undefined`
2. **Check fails** → Use `getDefaultSections('page-slug')`
3. **Defaults provided** → Page renders with hardcoded sections
4. **User experience** → Site stays online, content shown from defaults

Defaults are stored in: `frontend/lib/default-sections.ts`

---

## Performance Optimizations

✅ **ISR (Incremental Static Regeneration)** - Pages cache for 1 hour  
✅ **Server-side rendering** - Content fetched at build time  
✅ **Image optimization** - Next.js Image component used  
✅ **Video optimization** - Lazy loading with poster  
✅ **Responsive design** - Mobile-first CSS  

---

## Supported Video Formats

- MP4 (recommended) - best browser support
- WebM - better compression
- Ogg - fallback format

**Payload CMS automatically optimizes** uploaded videos for web.

---

## Supported Image Formats

- PNG (recommended for graphics)
- JPG (best for photos)
- WebP (for advanced compression)

**Payload CMS automatically generates** multiple sizes for responsive display.

---

## Testing Locally

### 1. Start Dev Server
```bash
cd frontend
npm run dev
```

### 2. Visit Admin
```
http://localhost:3002/admin
```

### 3. Create Test Section
- Create a new page section for "home"
- Upload a test video and image
- Save

### 4. View Page
```
http://localhost:3002/
```

The home page hero should now display your custom video and device frame!

---

## All Pages That Are Dynamic

| Page | URL | CMS Fetch | Device | Status |
|------|-----|-----------|--------|--------|
| Home | `/` | ✅ | ✅ Hero + Device Frame | ✅ Live |
| Platform | `/platform` | ✅ | ✅ All sections | ✅ Live |
| Solutions | `/solutions` | ✅ | ✅ All sections | ✅ Live |
| Regulatory | `/regulatory` | ✅ | ✅ All sections | ✅ Live |
| Trust | `/trust` | ✅ | ✅ All sections | ✅ Live |
| Verify | `/verify` | ✅ | ✅ All sections | ✅ Live |
| About | `/about` | ✅ | ✅ All sections | ✅ Live |

---

## Summary

✅ **All frontend pages are fully dynamic**  
✅ **Video backgrounds ready for use**  
✅ **Device frame images working**  
✅ **CMS fallback system active**  
✅ **Responsive and optimized**  
✅ **Ready for production**

No code changes needed — just add content via Payload CMS admin panel!
