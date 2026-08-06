# Vercel Deployment Guide for QRS App

## Project Structure
```
qrs-app/
├── frontend/          # Next.js application (Port 3000)
├── qrs-cms/           # Express API server (Port 3001)
├── package.json       # Root monorepo config
├── vercel.json        # Vercel build config
└── .vercelignore      # Files to ignore during deployment
```

## Step 1: Fix Current Vercel Deployment (Frontend)

### In Vercel Dashboard:
1. Go to **Project Settings** → **General**
2. Set **Root Directory** to `./frontend`
3. Confirm **Build Command** is set to: `npm run build`
4. Confirm **Output Directory** is set to: `.next`
5. Confirm **Install Command** is set to: `npm install`

### Environment Variables
Add these to **Settings → Environment Variables**:

```
NEXT_PUBLIC_PAYLOAD_URL=https://qrs-cms-api.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
NODE_ENV=production
```

## Step 2: Deploy API Server Separately

You have two options:

### Option A: Deploy API to Separate Vercel Project (Recommended)
1. Create a new Vercel project
2. Connect the same repository
3. Set **Root Directory** to `./qrs-cms`
4. Add environment variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `NODE_ENV=production`
   - `JWT_SECRET`: Generate a secure random string
5. Update the frontend's `NEXT_PUBLIC_PAYLOAD_URL` to point to this deployment

### Option B: Use Vercel Serverless Functions
Add this to your `vercel.json`:

```json
{
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next@latest"
    },
    {
      "src": "qrs-cms/server.js",
      "use": "@vercel/node@latest",
      "config": {
        "includeFiles": "qrs-cms/**"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/.*",
      "dest": "qrs-cms/server.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

## Step 3: Update Environment Variables

### Frontend (.env.production)
```
NEXT_PUBLIC_PAYLOAD_URL=https://qrs-cms.vercel.app
NEXT_PUBLIC_SITE_URL=https://qrs-app-git-main-jordan-7964s-projects.vercel.app
NODE_ENV=production
```

### API Server (.env.production)
```
DATABASE_URL=postgresql://user:password@neon-host/database
PORT=3001
NODE_ENV=production
JWT_SECRET=your-secure-random-string
PAYLOAD_PUBLIC_SERVER_URL=https://qrs-cms.vercel.app
```

## Step 4: Push to GitHub

```bash
git add .
git commit -m "Configure Vercel deployment for monorepo structure"
git push origin main
```

Vercel will automatically redeploy when you push to the main branch.

## Troubleshooting

### Error: "npm install fails because the configured build root lacks a package.json"
**Fix:** Update Root Directory in Vercel Settings to `./frontend`

### Error: "Cannot find module" during build
**Fix:** Ensure all dependencies are in the correct package.json files

### Database Connection Issues
**Fix:** 
1. Check DATABASE_URL in Vercel environment variables
2. Ensure Neon database allows Vercel IP addresses
3. Test connection locally before deploying

### API Not Responding
**Fix:**
1. Check Vercel Function logs
2. Verify environment variables are set
3. Ensure API domain is correct in NEXT_PUBLIC_PAYLOAD_URL

## Deployment URLs

After successful deployment:
- **Frontend**: https://qrs-app-git-main-jordan-7964s-projects.vercel.app
- **API (Option A)**: https://qrs-cms-api.vercel.app
- **API (Option B)**: https://qrs-app-git-main-jordan-7964s-projects.vercel.app/api

## Next Steps

1. Configure Root Directory in Vercel Dashboard
2. Add Environment Variables
3. Trigger a new deployment
4. Test the application in production
