# QRS App - Local Development Setup

## Folder Structure

Your project is now organized as:

```
qrs-app/
├── frontend/              # Next.js frontend (port 3000)
│   ├── app/
│   ├── components/
│   ├── public/
│   ├── package.json
│   ├── .env.local
│   └── ...
├── qrs-cms/              # Standalone Payload CMS (port 3001)
│   ├── payload.config.ts # Payload configuration
│   ├── package.json
│   ├── .env.local
│   ├── tsconfig.json
│   └── README.md
├── scripts/
├── .github/
└── README.md
```

## Getting Started (Local Development)

### Prerequisites
- Node.js 22 LTS (or 18+)
- PostgreSQL via Neon Cloud

### Step 1: Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**CMS (Payload):**
```bash
cd qrs-cms
npm install
```

### Step 2: Start Both Applications

Open **two terminal windows**:

**Terminal 1 - Frontend (port 3000):**
```bash
cd frontend
npm run dev
```
Access: http://localhost:3000

**Terminal 2 - CMS Payload (port 3001):**
```bash
cd qrs-cms
npm run dev
```
Access: http://localhost:3001/admin

### Step 3: Create Admin User

1. Visit http://localhost:3001/admin
2. Create your admin account
3. Start managing content!

### Step 4: Add Test Content

1. Go to Collections → Pages
2. Create a page:
   - **title**: "Platform"
   - **slug**: "platform"
   - **content**: Add rich text content
   - **Publish** it
3. Frontend will fetch from http://localhost:3001/api/pages

## Environment Variables

Already configured in:
- `frontend/.env.local` - Points to `NEXT_PUBLIC_PAYLOAD_URL=http://localhost:3001`
- `qrs-cms/.env.local` - Payload CMS configuration

Both connect to the same Neon PostgreSQL database:
```
DATABASE_URL=postgresql://neondb_owner:npg_JkuPtB1MWK7U@ep-cool-block-at41gwhk-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

## Deployment Strategy

### Frontend → Vercel
```bash
cd frontend
npm run build
# Deploy via Vercel
```
- Env vars: `NEXT_PUBLIC_PAYLOAD_URL`, `DATABASE_URL`
- Current: https://qrs-app-eight.vercel.app

### CMS (Payload) → Hostinger (Node.js Hosting)
```bash
cd qrs-cms
npm run build
npm run start
```
- Set env vars: `DATABASE_URL`, `PAYLOAD_SECRET`, `PORT=3001`
- Admin UI: `https://cms.yourdomain.com/admin`
- API: `https://cms.yourdomain.com/api`

## API Endpoints

Frontend fetches from Payload CMS REST API:

```javascript
// Development
const API = 'http://localhost:3001';

// Production
const API = 'https://cms.yourdomain.com';

// Fetch published pages
const res = await fetch(`${API}/api/pages?where[slug][equals]=platform`);
const data = await res.json();
console.log(data.docs); // Array of pages
```

## Troubleshooting

### Port 3000 or 3001 Already in Use

Windows:
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

Mac/Linux:
```bash
lsof -ti:3000 | xargs kill -9
```

### Database Connection Issues

Verify `.env.local` has correct connection string in both folders:
```
DATABASE_URL=postgresql://neondb_owner:npg_JkuPtB1MWK7U@...
```

### Payload Admin Not Loading

1. Check qrs-cms is running: `npm run dev` on port 3001
2. Admin URL: http://localhost:3001/admin
3. Verify database connection
4. Check browser console for errors

## Next Steps

1. ✅ Install: `npm install` in frontend and qrs-cms
2. ✅ Start frontend: `cd frontend && npm run dev`
3. ✅ Start CMS: `cd qrs-cms && npm run dev`
4. ✅ Create admin user at http://localhost:3001/admin
5. ✅ Create Pages collection content
6. ✅ Test API: http://localhost:3001/api/pages
7. ✅ Update frontend to fetch from CMS API
8. 🚀 Deploy to production

See [README.md](README.md) for architecture details.
