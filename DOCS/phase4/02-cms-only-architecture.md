# Phase 4 Final: CMS-Only Authentication Architecture

**Date:** 2026-08-21  
**Correction:** Removed frontend auth system - authentication moved to CMS admin panel only

---

## Architecture Decision

### Previous (Incorrect):
- Frontend login/signup endpoints
- Frontend RBAC middleware
- Separate frontend auth system

### Current (Correct):
- **Frontend (port 3000):** Public marketing site only
  - No authentication
  - Public form endpoints with security (rate limiting + Turnstile)
  - Reads content from CMS via REST API

- **Payload CMS (port 3001):** Admin panel with authentication
  - Payload's built-in auth for admin login
  - RBAC enforced on all collections
  - User role-based access to manage content

---

## Frontend Architecture

```
Frontend (Next.js 16 @ port 3000)
├── Pages (public)
│   ├── / (Home)
│   ├── /about
│   ├── /platform
│   ├── /trust
│   ├── /validation
│   └── ... (all public)
│
├── API Routes
│   ├── /api/contact → Rate limit + Turnstile + Audit logging
│   ├── /api/privacy-request → Rate limit + Turnstile + Audit logging
│   └── /api/pages → Fetch from CMS
│
└── Libraries
    ├── rate-limit.ts → Per-endpoint IP tracking (5 req/min)
    ├── turnstile.ts → Cloudflare verification
    ├── audit.ts → Log form submissions to CMS
    └── cms-fetch.ts → REST API client to Payload
```

**No auth endpoints** - Frontend is public-facing.

---

## CMS Architecture

```
Payload CMS (Next.js 16 @ port 3001)
├── Admin Panel (/:3001/admin)
│   └── Requires Payload auth
│
├── Collections (with RBAC)
│   ├── Users
│   │   ├── read: users:read (admin+)
│   │   ├── create: users:create (admin+)
│   │   ├── update: users:update (admin+)
│   │   └── delete: users:delete (super-admin)
│   │
│   ├── Pages, ProductShowcase, Solutions, etc.
│   │   ├── read: content:read (published or admin+)
│   │   ├── create: content:create (admin+)
│   │   ├── update: content:update (admin+)
│   │   └── delete: content:delete (super-admin)
│   │
│   ├── FormSubmissions
│   │   ├── read: forms:read (admin+, read-only)
│   │   ├── create: API only (no UI access)
│   │   ├── update: forms:read (admin+)
│   │   └── delete: audit:read (super-admin)
│   │
│   └── AuditLogs
│       ├── read: audit:read (admin+)
│       ├── create: System only (append-only)
│       ├── update: Disabled
│       └── delete: Disabled
│
├── RBAC System
│   ├── 5 Roles: super-admin, admin, editor, reviewer, read-only
│   ├── lib/rbac/roles.ts → Role hierarchy + permissions
│   └── Collections enforce via access control functions
│
└── APIs
    └── REST endpoints
        ├── /api/collections/* (Payload standard)
        └── Authenticated via Payload session
```

**All auth via Payload CMS** - Centralized admin authentication.

---

## Security Features

### Rate Limiting (Frontend)
- **Location:** `frontend/lib/rate-limit.ts`
- **Per-endpoint tracking:** `/api/contact` and `/api/privacy-request` have separate limits
- **Limit:** 5 requests/minute per IP
- **Returns:** 429 Too Many Requests with Retry-After header

### Turnstile Verification (Frontend)
- **Location:** `frontend/lib/turnstile.ts`
- **Server-side verification:** Validates token against Cloudflare API
- **Endpoints:** /api/contact, /api/privacy-request
- **Fallback:** Returns false if Cloudflare is unreachable (fail secure)

### Audit Logging (Frontend → CMS)
- **Location:** `frontend/lib/audit.ts`
- **Logged events:** Form submissions (contact, privacy-request)
- **Fields:** user_id, table_name, action, changes, ip_address, timestamp
- **Database:** PostgreSQL `audit_logs` table
- **Access:** Admins only, append-only, no delete

### RBAC (CMS)
- **Location:** `qrs-cms/lib/rbac/roles.ts`
- **5-role hierarchy:** super-admin > admin > editor > reviewer > read-only
- **14 permissions:** Granular control over users, content, forms, audit, settings
- **Enforcement:** Collection-level access control functions
- **Collections protected:** Users, Pages, ProductShowcase, FormSubmissions, AuditLogs, all content

---

## Data Flow Examples

### Public User Visits Marketing Site
```
1. Browser → Frontend homepage (/)
2. Frontend renders published content (no auth needed)
3. User fills contact form
4. POST /api/contact
   ├─ Rate limiter checks IP (global: 5/min)
   ├─ Turnstile verifies widget token
   ├─ Form inserted into form_submissions table
   ├─ Audit log created (user_id=null, anonymous)
   └─ Response: 200 Success
```

### Admin Manages Content
```
1. Admin → CMS admin panel (/:3001/admin)
2. Payload auth (login required)
3. Payload validates role
4. Admin views Users collection
   ├─ Payload checks: access.read({ req: { user } })
   ├─ RBAC: hasPermission(user.role, 'users:read')
   ├─ Admin (role) has permission → ✅ List visible
   └─ Editor (role) lacks permission → ✅ Access denied
5. Admin creates page
   ├─ Payload checks: access.create({ req: { user } })
   ├─ RBAC: hasPermission(user.role, 'content:create')
   ├─ Editor (role) has permission → ✅ Can create
   └─ Reviewer (role) lacks permission → ✅ Access denied
6. Page created
   ├─ Audit log entry created
   └─ Frontend fetches via REST API next deploy
```

---

## Removed Components

The following were removed because frontend doesn't have auth:

| Component | Why Removed | Alternative |
|-----------|------------|-------------|
| `/api/auth/login` | Frontend is public | Payload CMS auth |
| `/api/auth/signup` | Frontend is public | Payload CMS users |
| `/api/users` | No frontend user management | CMS user management |
| `/admin` page | No frontend admin | CMS admin panel |
| `/dashboard` page | No user accounts on frontend | Not needed |
| `middleware.ts` | No JWT extraction needed | Payload handles internally |
| `lib/rbac/middleware.ts` | RBAC is CMS-only | CMS collection access control |
| Playwright tests | Frontend auth no longer exists | Manual CMS testing |

---

## Production Architecture Summary

```
┌─────────────────────────────────────┐
│ User (Browser)                      │
└────────────┬────────────────────────┘
             │
       ┌─────┴──────┐
       │            │
       ▼            ▼
   Frontend      CMS Admin
  (port 3000)   (port 3001)
       │            │
       ├─ Public    └─ Payload Auth
       ├─ Forms       (login required)
       │  (rate limit)
       │  (Turnstile) └─ Collections
       │  (audit log)    (RBAC enforced)
       │
       └─ REST API ──────────────┐
                                 │
                          PostgreSQL
                          (Shared DB)
                          ├─ Users
                          ├─ Content
                          ├─ form_submissions
                          └─ audit_logs
```

---

## Testing Strategy

### Frontend
- **Manual:** POST to /api/contact, /api/privacy-request
- **Verify:** Rate limiting, Turnstile verification, audit logs appear in CMS

### CMS
- **Admin login:** Verify Payload auth works
- **RBAC:** Test collection access with different roles
- **Audit logs:** Verify form submissions are logged with correct fields

---

## Next Steps

1. ✅ Remove frontend auth
2. ✅ Verify CMS RBAC enforcement
3. 🔄 Test end-to-end flow (frontend forms → CMS audit logs)
4. 🔄 Document in RUNBOOK.md for team
5. 🔄 Proceed to P1 items (input validation, Lighthouse, redirects, etc.)

---

**Status:** Phase 4 architecture corrected. Frontend is now a simple public site. All authentication and RBAC moved to Payload CMS.
