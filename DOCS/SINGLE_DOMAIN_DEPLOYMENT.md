# Single Domain Deployment on Vercel

## Architecture
Both frontend and API will run on a single Vercel domain:
- **Frontend**: `https://qrs-app-git-main-jordan-7964s-projects.vercel.app`
- **API Routes**: `https://qrs-app-git-main-jordan-7964s-projects.vercel.app/api/*`
- **Auth**: `/api/auth/login`, `/api/auth/signup`, `/api/auth/logout`, `/api/auth/me`, `/api/auth/profile`
- **Pages**: `/api/pages` (CRUD operations)

## What Changed

### 1. API Routes Created in Frontend
Moved all API endpoints from separate Express server to Next.js API routes:

```
frontend/app/api/
├── auth/
│   ├── login/route.ts
│   ├── signup/route.ts
│   ├── logout/route.ts
│   ├── me/route.ts
│   └── profile/route.ts
└── pages/route.ts
```

### 2. Environment Variables Updated
- `NEXT_PUBLIC_PAYLOAD_URL=/api` (relative URL)
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secure random string
- `NEXT_PUBLIC_SITE_URL`: Your domain

### 3. Configuration Files
- `vercel.json`: Configured for single Next.js build
- `.env.local`: Local development settings
- `.env.production`: Production settings for Vercel

## Deployment Steps

### Step 1: Add Environment Variables in Vercel Dashboard

Go to **Project Settings → Environment Variables**

Add these variables (they will be automatically available to API routes):

```
Name: DATABASE_URL
Value: postgresql://neondb_owner:npg_JkuPtB1MWK7U@ep-cool-block-at41gwhk.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require
Environments: Production
```

```
Name: JWT_SECRET
Value: aB3cD4eF5gH6iJ7kL8mN9oPqRsTuVwXyZ1a2b3c4d5e6f7g8h9
Environments: Production
```

```
Name: NEXT_PUBLIC_SITE_URL
Value: https://qrs-app-git-main-jordan-7964s-projects.vercel.app
Environments: Production
```

### Step 2: Update Root Directory in Vercel Dashboard

Go to **Project Settings → General**

Make sure **Root Directory** is set to: `./frontend`

### Step 3: Push Code to GitHub

```bash
git add .
git commit -m "Deploy both frontend and API on single Vercel domain"
git push origin main
```

Vercel will automatically detect the changes and redeploy.

### Step 4: Verify Deployment

Check these URLs after deployment completes:

```
✓ Frontend: https://qrs-app-git-main-jordan-7964s-projects.vercel.app
✓ Login: https://qrs-app-git-main-jordan-7964s-projects.vercel.app/login
✓ Signup: https://qrs-app-git-main-jordan-7964s-projects.vercel.app/signup
✓ Admin: https://qrs-app-git-main-jordan-7964s-projects.vercel.app/admin
✓ Dashboard: https://qrs-app-git-main-jordan-7964s-projects.vercel.app/dashboard
✓ API Health: https://qrs-app-git-main-jordan-7964s-projects.vercel.app/api/pages
```

## How It Works

### Request Flow

1. User visits `https://your-domain.vercel.app`
2. Next.js frontend loads and renders
3. Frontend makes API calls to `/api/auth/*` or `/api/pages`
4. Vercel serverless functions handle the requests
5. API routes connect to PostgreSQL database
6. Response sent back to frontend

### API Routes as Serverless Functions

Each API route becomes a serverless function on Vercel:
- `app/api/auth/login/route.ts` → `/api/auth/login`
- `app/api/auth/signup/route.ts` → `/api/auth/signup`
- `app/api/pages/route.ts` → `/api/pages`

Vercel automatically handles:
- Scaling
- Cold starts
- Timeout management
- Environment variable injection

## Local Development

Run locally with both frontend and API:

```bash
# Terminal 1: Frontend (3000)
cd frontend
npm run dev

# Terminal 2: API Server (3001) - OPTIONAL (not needed for dev)
cd qrs-cms
node server.js
```

Update `frontend/.env.local`:
```
NEXT_PUBLIC_PAYLOAD_URL=/api
DATABASE_URL=your_local_database_url
```

## Advantages of This Approach

✅ **Single Domain**: Everything on one URL
✅ **No CORS Issues**: Same-origin requests
✅ **Easier to Deploy**: One Vercel project
✅ **Better Performance**: No separate service overhead
✅ **Simpler Configuration**: One set of environment variables
✅ **Native Serverless**: Uses Vercel's native function support

## Troubleshooting

### API Returns 401 Unauthorized
- Check JWT_SECRET matches in Vercel environment variables
- Verify cookie is being sent with requests (`credentials: 'include'`)

### Database Connection Fails
- Verify DATABASE_URL is correct in Vercel
- Check Neon allows Vercel IPs
- Test connection string locally first

### CORS Errors
- Should not happen (same domain)
- If it does, check request headers and origins

### 404 on API Routes
- Clear `.next` folder and rebuild
- Push to GitHub to trigger Vercel rebuild
- Check vercel.json routing configuration

## Next.js API Route Limits

- Max timeout: 60 seconds (configurable)
- Max body size: 5MB
- Cold start: ~1-2 seconds first request

For longer operations, consider:
- Adding job queue (Bull, AWS SQS)
- Splitting into multiple smaller functions
- Using serverless containers

## Security Notes

- JWT_SECRET should be strong and random
- Never commit `.env.production` or secrets
- Use Vercel's environment variables for all secrets
- Credentials: include is required for cookie auth
- Database connection uses SSL

## Migration from Separate Services

No data migration needed - same database:
- PostgreSQL/Neon connection remains the same
- Same schema and tables
- Same users and pages data

Just update frontend to use `/api` instead of external domains.
