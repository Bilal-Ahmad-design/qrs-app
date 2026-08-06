# QRS - Quantitative Risk Systems

Separate frontend and standalone Payload CMS applications.

## Project Structure

```
qrs-app/
├── frontend/        # Next.js frontend application (port 3000)
│                    # Marketing website
│                    # Fetches content from qrs-cms via REST API
├── qrs-cms/         # Standalone Payload CMS (port 3001)
│                    # Content management admin panel
│                    # REST API endpoints
│                    # PostgreSQL database management
├── scripts/         # Shared scripts
└── .github/         # CI/CD configuration
```

## Quick Start

### 1. Install Dependencies

```bash
cd frontend && npm install
cd ../qrs-cms && npm install
```

### 2. Start Both Applications

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

**Terminal 2 - Strapi CMS:**
```bash
cd qrs-cms
npm run develop
# Admin UI: http://localhost:3001/admin
# API: http://localhost:3001/api
```

### 3. Create Admin User & Add Content

1. Visit http://localhost:3001/admin
2. Create an admin account
3. Go to Content Manager → Pages
4. Create a test page and publish it
5. Frontend will fetch content from Strapi API

## Architecture

### Frontend (Next.js)
- Marketing website displaying content
- Fetches dynamic content from Strapi API
- Deployed to Vercel
- Runs on port 3000 locally

### CMS (Strapi)
- Headless CMS for managing pages, blog, validation reports
- REST API endpoints (`/api/pages`, `/api/blogs`, etc.)
- Admin UI for content management
- Deployed to Hostinger (or any Node.js hosting)
- Runs on port 3001 locally

## Environment Variables

**Frontend** (`frontend/.env.local`):
```
DATABASE_URL=postgresql://... # Legacy, kept for compatibility
NEXT_PUBLIC_CMS_URL=http://localhost:3001
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

**CMS** (`cms/.env.local`):
```
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://...
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
APP_KEYS=key1,key2,key3,key4
API_TOKEN_SALT=strapi_token_salt_qrs
ADMIN_JWT_SECRET=admin_jwt_secret_qrs_app
HOST=0.0.0.0
PORT=3001
NODE_ENV=development
```

## API Endpoints (Strapi)

### Fetch All Published Pages
```bash
curl http://localhost:3001/api/pages?filters[publishedAt][$notNull]=true
```

### Fetch Page by Slug
```bash
curl "http://localhost:3001/api/pages?filters[slug][$eq]=platform&populate=*"
```

### Fetch Blogs
```bash
curl http://localhost:3001/api/blogs?filters[publishedAt][$notNull]=true
```

See [Strapi REST API Docs](https://docs.strapi.io/dev-docs/api/rest) for full API reference.

## Content Types

Default content types in Strapi:

- **Pages** - Marketing pages (Platform, Why QRS, About, etc.)
  - Fields: title, slug, description, content, seoTitle, seoDescription, publishedAt
- **Blogs** (create as needed)
  - Fields: title, slug, excerpt, content, author, publishedAt
- **Validation Reports** (create as needed)
  - Fields: title, slug, summary, publishedDate, reportFile, status

Add more content types in Strapi admin UI → Content-type Builder.

## Deployment

### Frontend → Vercel

```bash
cd frontend
npm run build
# Deploy to Vercel using Git or Vercel CLI
```

**Environment variables on Vercel:**
```
NEXT_PUBLIC_CMS_URL=https://cms.yourdomain.com
DATABASE_URL=postgresql://... # If used for API routes
```

### CMS (Strapi) → Hostinger

1. Deploy `cms/` folder to Hostinger Node.js hosting
2. Set environment variables:
   ```
   DATABASE_URL=postgresql://...
   DATABASE_CLIENT=postgres
   APP_KEYS=<generate-new-keys>
   ADMIN_JWT_SECRET=<generate-new-secret>
   NODE_ENV=production
   PORT=3001
   ```
3. Build: `npm run build`
4. Start: `npm run start`
5. Admin UI: `https://cms.yourdomain.com/admin`

## Production API Usage

Update frontend's `NEXT_PUBLIC_CMS_URL` to point to your production Strapi:

```javascript
// In frontend, e.g., app/platform/page.tsx
const cms = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001';
const response = await fetch(`${cms}/api/pages?filters[slug][$eq]=platform&populate=*`);
```

## Database

Both applications connect to the **same PostgreSQL database** on Neon Cloud:
```
DATABASE_URL=postgresql://neondb_owner:npg_JkuPtB1MWK7U@ep-cool-block-at41gwhk-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Tables managed by Strapi:**
- `strapi_content_types` - Content type definitions
- `strapi_core_store` - Core configuration
- `up_pages` - Pages content type
- `up_blogs` - Blogs content type (if created)
- `up_users_permissions_user` - Admin users
- etc.

## Notes

✅ **Benefits of this setup:**
- Frontend and CMS are independent applications
- Can deploy at different times to different hosts
- Strapi is simpler than Payload (no bundler issues)
- Easy to extend with new content types
- REST API is standard and well-documented

🚀 **Next steps:**
1. Create content types in Strapi admin UI
2. Add sample content
3. Update frontend to fetch from API
4. Test locally
5. Deploy to production