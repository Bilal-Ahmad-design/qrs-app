# Media Management Guide

## Directory Structure

```
frontend/
├── public/
│   ├── media/
│   │   ├── images/      # Static images (PNG, JPG, WebP, SVG)
│   │   ├── videos/      # Video files (MP4, WebM)
│   │   └── documents/   # PDFs, documents
│   └── [other static files]
└── app/
    └── api/
        └── media/
            └── route.ts # Media listing API
```

## Adding Media Files

### Images
1. Add image files to `public/media/images/`
2. Supported formats: PNG, JPG, WebP, SVG
3. Recommended sizes:
   - Hero images: 1920x1080 or larger
   - Thumbnails: 300x200 minimum
   - Icons: 64x64 or SVG

### Videos
1. Add video files to `public/media/videos/`
2. Supported formats: MP4 (H.264), WebM (VP9)
3. Recommended:
   - MP4 for broad compatibility
   - Include both for optimal performance
   - Keep under 50MB for web

### Documents
1. Add documents to `public/media/documents/`
2. Supported: PDF, Word (docx), Excel (xlsx)

## Using Media in Components

### Direct URL (Public Files)
```tsx
<img src="/media/images/hero.jpg" alt="Hero" />
<video src="/media/videos/demo.mp4" controls />
```

### Via Media API
```tsx
import { useState, useEffect } from 'react'

export default function MediaGallery() {
  const [media, setMedia] = useState([])

  useEffect(() => {
    fetch('/api/media?type=image')
      .then(res => res.json())
      .then(data => setMedia(data.docs))
  }, [])

  return (
    <div>
      {media.map(file => (
        <img key={file.id} src={file.url} alt={file.filename} />
      ))}
    </div>
  )
}
```

### Media API Endpoints

#### List all media
```bash
GET /api/media
```

#### List by type
```bash
GET /api/media?type=image
GET /api/media?type=video
GET /api/media?type=document
```

Response:
```json
{
  "docs": [
    {
      "id": "hero-banner",
      "filename": "hero-banner.jpg",
      "type": "image",
      "url": "/media/images/hero-banner.jpg",
      "size": 245000,
      "createdAt": "2026-08-22T23:34:00.000Z"
    }
  ],
  "totalDocs": 1
}
```

## Integration with Admin Dashboard

Media can be managed in the admin dashboard:
- View all media files
- Filter by type (images, videos, documents)
- See file metadata (size, creation date)
- Download/preview files

## Best Practices

1. **File Naming**: Use lowercase with hyphens
   - ✅ `hero-banner.jpg`
   - ❌ `Hero Banner.jpg`

2. **File Sizes**: Keep files optimized
   - Images: Compress before uploading (use WebP for web)
   - Videos: Keep under 50MB, use MP4 for compatibility

3. **Organization**: Group by type
   - Marketing images → `/media/images/marketing/`
   - Demo videos → `/media/videos/demos/`

4. **Serving Static Files**: Next.js automatically serves from `public/`
   - No API needed for direct access
   - Use `/media/images/file.jpg` directly in HTML
   - Use API endpoint when you need metadata

## Example: Adding Sample Media

```bash
# Create sample image placeholder
cp public/hero-placeholder.png public/media/images/sample-hero.png

# Create sample video (minimal MP4)
# Add real video files to public/media/videos/
```

## Troubleshooting

**Images not showing?**
- Check path: `/media/images/filename.ext`
- Verify file exists in `public/media/images/`
- Clear browser cache

**API returning empty?**
- Ensure files are in correct subdirectory
- Check file permissions (should be readable)
- Restart dev server

**Video not playing?**
- Use MP4 format for broad compatibility
- Check video codec (H.264 video, AAC audio)
- Verify file size isn't too large

## Future: Database Integration

When moving to real Payload CMS:
- Upload media through admin UI
- Store file references in database
- Serve from CDN or cloud storage
- Current setup is for development/testing
