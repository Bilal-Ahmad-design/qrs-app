# Payload Admin Setup Guide

## Quick Start

### Access Payload Admin (Production Build)

**Why production build?**
- Dev mode uses Turbopack which conflicts with Payload's database driver
- Production build uses standard Next.js bundler (no conflicts)
- Same as production deployment - good for testing

### Steps:

```bash
# 1. Build for production
npm run build

# 2. Start production server
npm start

# 3. Open browser
# Visit: http://localhost:3000/admin
```

**Server will run on:** http://localhost:3000

---

## Payload Admin Features

Once admin UI loads, you can:

✅ **Create & Manage Collections:**
- Pages
- Blog posts
- Validation reports
- Peril status indicators
- Form submissions
- Redirects

✅ **Edit Content:**
- Add/edit pages
- Manage blog posts
- Upload media
- View form submissions

✅ **User Management:**
- Create admin users
- Manage permissions
- Set roles

---

## Database

**Database Status:** ✅ Ready
- Type: PostgreSQL (Neon)
- Tables: 21 initialized
- All collections configured

**Connection:** 
```
postgresql://neondb_owner:...@ep-cool-block-at41gwhk-pooler.c-9.us-east-1.aws.neon.tech/neondb
```

---

## Development vs Production

### Development Mode (`npm run dev`)
- ❌ Admin UI won't load (Turbopack issue)
- ✅ Frontend pages work fine
- ✅ Fast refresh
- Use for UI/styling work

### Production Mode (`npm run build && npm start`)
- ✅ Admin UI fully works
- ✅ Payload API works
- ❌ No hot reload
- Use for testing before deployment

---

## Next Steps

1. **Test Admin:** Run production build and access admin UI
2. **Add Content:** Create sample pages/blog posts
3. **Verify Frontend:** Check if content displays on frontend
4. **Deploy to Vercel:** Push to production

---

## Troubleshooting

**Q: Admin UI not loading?**
- Make sure you ran `npm run build` first
- Make sure you're running `npm start` (not `npm run dev`)
- Check http://localhost:3000/admin

**Q: Database errors?**
- DATABASE_URL in .env.local is correct
- Neon PostgreSQL is accessible
- All 21 tables are initialized

**Q: Can't see my content on frontend?**
- Pages must have `status: "published"`
- Homepage slug must be `"home"`
- Check payload-fetch.ts for API calls

---

## Production Deployment

When deploying to Vercel:
1. Same build command: `npm run build`
2. Same start command: `npm start`
3. Admin UI will work at: `https://your-vercel-url.vercel.app/admin`
4. Full Payload API available

No changes needed - it just works! 🚀
