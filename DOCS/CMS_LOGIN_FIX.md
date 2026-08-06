# CMS Login Fix

## Problem
The CMS was running a custom Express server instead of Payload CMS, causing the admin panel to fail with 404 errors on `/api/auth/login`.

## Solution Applied

### 1. Updated package.json
Changed from custom server to Payload CMS:
```json
{
  "scripts": {
    "dev": "payload dev",      // was: "node server.js"
    "build": "payload build",
    "start": "NODE_ENV=production node dist/server.js"
  },
  "dependencies": {
    "payload": "latest",
    "@payloadcms/db-postgres": "latest",
    "@payloadcms/richtext-lexical": "latest",
    // ... existing dependencies
  }
}
```

### 2. Install Payload CMS
```bash
cd qrs-cms
npm install
```

### 3. Run Payload CMS
```bash
npm run dev
# Payload admin will be at http://localhost:3001/admin
```

## Database Setup

Payload will automatically:
- Create database schema
- Initialize required tables
- Set up admin authentication

### Default Admin User
Create the first admin user when prompted:
- Email: Any email address
- Password: Strong password
- Role: admin

**Current admin credentials (from frontend):**
- Email: `clients.1356@gmail.com`
- Password: `Client1122#`

## Verification

After starting Payload:
1. Go to `http://localhost:3001/admin`
2. You should see the Payload CMS login
3. Login with admin credentials
4. Navigate to **Collections** to see all CMS collections:
   - PageSections ✅
   - ProductShowcase ✅
   - Solutions ✅
   - RegulatoryCompliance ✅
   - PlatformCapability ✅
   - Documentation ✅
   - (and others)

## If Login Still Fails

### Check Database Connection
```bash
# Verify DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL

# Should show: postgresql://...neondb...
```

### Check Payload Install
```bash
# Verify Payload is installed
npm ls payload

# Should show: payload@X.X.X
```

### Clear Cache & Rebuild
```bash
rm -rf .next dist node_modules
npm install
npm run dev
```

## Expected Output When Starting

```
✅ Payload CMS Ready
📍 Admin Panel: http://localhost:3001/admin
🗄️  Database: PostgreSQL (Neon)
🔐 Authentication: Enabled
```

## Next Steps

1. ✅ Install Payload CMS
2. ✅ Start Payload dev server (`npm run dev`)
3. ✅ Go to http://localhost:3001/admin
4. ✅ Login with admin credentials
5. ✅ Start creating Page Sections to edit your website!

---

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL is set in `.env.local`
- Verify Neon database is accessible
- Try connection test:
  ```bash
  psql $DATABASE_URL -c "SELECT 1"
  ```

### "Module not found: payload"
- Run `npm install` again
- Delete `node_modules` and reinstall
- Check internet connection

### "Payload admin is blank"
- Wait 30 seconds for build to complete
- Check console for errors
- Clear browser cache (Ctrl+Shift+Delete)
- Try incognito window

### "Login redirects to home page"
- Logout and clear cookies
- Wait for Payload to fully initialize (check console)
- Try different browser
