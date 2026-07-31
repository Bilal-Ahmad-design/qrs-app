# QRS App - Local Development Setup

## Folder Structure

Your project is now organized as:

```
qrs-app/
├── frontend/           # Next.js marketing site (port 3000)
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   ├── .env.local
│   └── ...
├── cms/               # Strapi Headless CMS (port 3001)
│   ├── src/
│   │   └── api/       # Content Types & API endpoints
│   ├── config/        # Strapi configuration
│   ├── public/        # Static files
│   ├── package.json
│   ├── .env.local
│   └── tsconfig.json
├── scripts/
├── .github/
└── README.md
```

## Getting Started (Local Development)

### Prerequisites
- Node.js 18+
- PostgreSQL (via Neon Cloud)

### Step 1: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**CMS (Strapi):**
```bash
cd cms
npm install
```

### Step 2: Start Both Applications

Open **two terminal windows** (or use a terminal multiplexer like tmux):

**Terminal 1 - Frontend (port 3000):**
```bash
cd frontend
npm run dev
```
Access: http://localhost:3000

**Terminal 2 - CMS Strapi (port 3001):**
```bash
cd cms
npm run develop
```
Access: http://localhost:3001/admin

### Step 3: Verify Setup

1. **Frontend** should load at http://localhost:3000
2. **Strapi Admin** should be accessible at http://localhost:3001/admin
3. Frontend fetches content from Strapi API at http://localhost:3001/api

### Step 4: Create Strapi Admin User

When Strapi starts for the first time, visit http://localhost:3001/admin and create an admin account.

### Step 5: Add Test Content

1. Go to http://localhost:3001/admin
2. Create a Page entry with:
   - **title**: "Platform"
   - **slug**: "platform"
   - **content**: "Test content"
   - **Publish** it
3. Verify frontend can fetch it via http://localhost:3001/api/pages

## Environment Variables

Already configured in:
- `frontend/.env.local` - Points to `NEXT_PUBLIC_CMS_URL=http://localhost:3001`
- `cms/.env.local` - Strapi configuration

Both connect to the same Neon PostgreSQL database.

## Deployment Strategy

### Frontend → Vercel
```bash
cd frontend
# Deploy the frontend folder to Vercel
```
- Current: https://qrs-app-eight.vercel.app
- Env vars: `NEXT_PUBLIC_CMS_URL` (point to Strapi domain), `DATABASE_URL`

### CMS (Strapi) → Hostinger (Node.js Hosting)
```bash
cd cms
npm run build
npm run start
```
- Set env vars: `DATABASE_URL`, `APP_KEYS`, `ADMIN_JWT_SECRET`, `PORT=3001`
- Admin UI: `https://cms.yourdomain.com/admin`
- API: `https://cms.yourdomain.com/api`

## API Endpoints (Strapi)

Frontend fetches from CMS using standard Strapi REST API:

```javascript
// Development
const API_URL = 'http://localhost:3001';

// Production
const API_URL = 'https://cms.yourdomain.com';

// Fetch published pages
const response = await fetch(`${API_URL}/api/pages?filters[slug][$eq]=platform&populate=*`);
```

## Troubleshooting

### Port 3000 or 3001 Already in Use

If you get "port already in use" error:

```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues

Ensure your PostgreSQL connection string is correct:
```
DATABASE_URL=postgresql://neondb_owner:npg_JkuPtB1MWK7U@ep-cool-block-at41gwhk-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

### Strapi Admin Not Loading

1. Make sure Strapi is running on port 3001: `npm run develop`
2. Admin UI URL: http://localhost:3001/admin
3. Database is accessible
4. Clear browser cache if needed

## Next Steps

1. ✅ Install dependencies: `npm install` in both folders
2. ✅ Start frontend: `cd frontend && npm run dev`
3. ✅ Start Strapi: `cd cms && npm run develop`
4. ✅ Create admin user in Strapi
5. ✅ Add content to Pages collection
6. ✅ Test frontend loads content from Strapi API
7. 🚀 Deploy to Vercel (frontend) and Hostinger (CMS)

See [README.md](README.md) for more details.
