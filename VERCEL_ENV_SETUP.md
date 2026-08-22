# Vercel Environment Variables Setup
**Domain:** https://qrs-app-eight.vercel.app

## Required Environment Variables for Production

Go to **Vercel Dashboard** → Select **qrs-app** → **Settings** → **Environment Variables**

### Public Variables (safe to commit)
These can be set and are visible in frontend code:

```
NEXT_PUBLIC_SITE_URL=https://qrs-app-eight.vercel.app
NEXT_PUBLIC_API_URL=https://qrs-app-eight.vercel.app/api
NEXT_PUBLIC_PAYLOAD_URL=/api/payload
NEXT_PUBLIC_CMS_URL=
NEXT_PUBLIC_TURNSTILE_SITE_KEY=<your_turnstile_site_key>
```

### Secret Variables (set in Vercel only)
Set these in Vercel Dashboard - do NOT commit to git:

| Variable | Value | Source |
|----------|-------|--------|
| `DATABASE_URL` | Pooled connection from Neon | Neon Dashboard |
| `TURNSTILE_SECRET_KEY` | Your Turnstile secret | Cloudflare Dashboard |
| `JWT_SECRET` | Random 32+ char string | Generate new or use existing |
| `PAYLOAD_SECRET` | Random 32+ char string | Generate new or use existing |
| `SESSION_SECRET` | Random 32+ char string | Generate new or use existing |
| `ADMIN_EMAIL` | Your admin email | Your choice |
| `SMTP_HOST` | Email provider SMTP host | Your email provider |
| `SMTP_PORT` | Email provider SMTP port | Your email provider (usually 587) |
| `SMTP_USER` | Email provider username | Your email provider |
| `SMTP_PASS` | Email provider password | Your email provider |
| `SMTP_FROM` | From email address | Your choice |

## Steps to Configure

### 1. Set Public Variables (Production)
```
Environment: Production
NEXT_PUBLIC_SITE_URL = https://qrs-app-eight.vercel.app
NEXT_PUBLIC_API_URL = https://qrs-app-eight.vercel.app/api
NEXT_PUBLIC_PAYLOAD_URL = /api/payload
NEXT_PUBLIC_CMS_URL = (leave empty)
NEXT_PUBLIC_TURNSTILE_SITE_KEY = <your_key>
```

### 2. Set Secret Variables (Production)
```
Environment: Production
DATABASE_URL = postgresql://... (from Neon pooled connection)
TURNSTILE_SECRET_KEY = <your_secret>
JWT_SECRET = <random_32_chars>
PAYLOAD_SECRET = <random_32_chars>
SESSION_SECRET = <random_32_chars>
ADMIN_EMAIL = admin@qrs.app
```

### 3. Optional: Email Configuration (Production)
If you want form submissions to send emails:
```
SMTP_HOST = your-smtp-host.com
SMTP_PORT = 587
SMTP_USER = your-email@domain.com
SMTP_PASS = your-app-password
SMTP_FROM = noreply@qrs.app
```

## Verification

After setting variables:

1. ✅ Push changes to GitHub
2. ✅ Trigger manual redeploy in Vercel
3. ✅ Check deployment logs for errors
4. ✅ Visit https://qrs-app-eight.vercel.app/
5. ✅ Test:
   - Homepage loads with sections
   - Images/videos display correctly
   - Forms submit without errors
   - Admin endpoints work (if accessing)

## Important Notes

- **NEXT_PUBLIC_CMS_URL** should be empty for production (uses relative paths)
- **DATABASE_URL** must use pooled connection (not unpooled) for Vercel
- Never commit `.env.local` with secrets to git
- Secrets set in Vercel Dashboard are not synced locally
- Each environment (Production/Preview) can have different variables

## Troubleshooting

If images/videos don't load:
- Check NEXT_PUBLIC_SITE_URL matches your domain
- Verify media files exist in `/public/media/`
- Check CSP headers in next.config.js

If API calls fail:
- Verify NEXT_PUBLIC_API_URL is correct
- Check DATABASE_URL is pooled (not unpooled)
- Test with `/api/health` endpoint

If Turnstile fails:
- Verify NEXT_PUBLIC_TURNSTILE_SITE_KEY is set
- Verify TURNSTILE_SECRET_KEY is set in Vercel
- Check Cloudflare project settings
