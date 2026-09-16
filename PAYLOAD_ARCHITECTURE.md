# Payload CMS Architecture

**QRS Platform · Embedded Payload CMS in Next.js 16**

---

## 1. Overview

Payload CMS is embedded directly into the Next.js application (single-port deployment on Vercel). The CMS serves content to marketing pages, manages user authentication, stores form submissions, and maintains audit logs.

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Production)                      │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Next.js 16.2.10 Application (Port 3000)      │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Payload CMS (Embedded)                          │ │ │
│  │  │  - /api/payload/* routes                         │ │ │
│  │  │  - Database connection                           │ │ │
│  │  │  - Admin dashboard (/cms/admin)                  │ │ │
│  │  │  - Collections & Globals management              │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Frontend Application                            │ │ │
│  │  │  - Marketing pages                               │ │ │
│  │  │  - Dynamic content via SectionRenderer           │ │ │
│  │  │  - User authentication (/login, /cms/login)      │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          PostgreSQL (Neon)                            │ │
│  │  - Single database for CMS + app data                 │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Core Components

### 2.1 Payload Configuration
**File:** `frontend/cms/payload.config.ts`

```typescript
- Database: PostgreSQL via @payloadcms/db-postgres
- Collections: 18 collections (see 2.2)
- Globals: 4 global configs (see 2.3)
- Authentication: Custom user model with RBAC
- Hooks: After-change and after-delete audit logging
```

### 2.2 Collections (18 total)

| Collection | Purpose | Key Fields |
|---|---|---|
| **Users** | Platform users with RBAC | email, password, role, fullname, isActive |
| **PageSections** | Reusable content sections | sectionType, title, heading, content, backgroundStyle, videoUrl, imageUrl |
| **Pages** | Full page definitions | slug, title, sections array |
| **Media** | Uploaded images, videos | filename, mimeType, filesize |
| **Blog** | Blog posts | title, slug, content, author, publishedAt |
| **Solutions** | Product solutions | title, description, perils, capabilities |
| **ProductShowcase** | Feature showcase items | title, icon, description |
| **RegulatoryCompliance** | Compliance info | title, standard, status |
| **PlatformCapability** | Product capabilities | title, description, status |
| **Documentation** | Technical docs | title, slug, content |
| **FormSubmissions** | User form submissions | formType, email, data, submittedAt |
| **FormEntries** | Form entry data | type, fields, values |
| **AuditLogs** | Compliance audit trail | user, action, collection, documentId, changes, timestamp |
| **ValidationReports** | Validation results | title, content, validatedAt |
| **PerilStatus** | Peril availability status | name, status (production/validation/roadmap) |
| **Redirects** | 301 redirects | sourcePath, destinationPath, type |
| **EmailSettings** | Email configuration | provider, apiKey, fromEmail |
| **EmailLogs** | Email send history | to, subject, status, sentAt |

### 2.3 Globals (4 total)

| Global | Purpose | Use Case |
|---|---|---|
| **Settings** | Site-wide settings | General config, feature flags |
| **Navigation** | Header/footer navigation | Menu structure |
| **Homepage** | Homepage hero config | Hero section content, CTAs |
| **TrustCenter** | Trust & compliance info | Security badges, compliance status |

---

## 3. Authentication & Authorization (RBAC)

### 3.1 Role Hierarchy

```
┌─────────────────────────────────────────┐
│         Role-Based Access Control       │
├─────────────────────────────────────────┤
│ super-admin   │ Full access, user mgmt  │
│ admin         │ Content mgmt, audit log │
│ editor        │ Page sections only      │
│ viewer        │ Read-only access        │
└─────────────────────────────────────────┘
```

### 3.2 Authentication Flow

```
User Login Request
    ↓
/api/auth/login endpoint
    ↓
findDevUserByEmail() → verifyDevUserPassword()
    ↓
✓ Valid → Return user data + set payload-user in localStorage
    ↓
Redirect to /cms/admin
    ↓
Middleware checks session cookie (payload-session)
    ↓
Access granted to protected routes
```

### 3.3 Protected Routes

| Route | Required Role | Type |
|---|---|---|
| /cms/admin | super-admin, admin | Dashboard |
| /cms/collections/* | admin | Collection management |
| /api/payload/* | Authenticated | CMS API |
| /admin | super-admin, admin | Legacy admin (redirects to /cms/admin) |

---

## 4. Data Flow Architecture

### 4.1 Content Creation to Rendering Pipeline

```
┌────────────────────────────────────────────────────────────┐
│  1. CMS ADMIN CREATES CONTENT                              │
│     User navigates to /cms/admin → Opens PageSections      │
│     Creates new section with CMS form                      │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│  2. PAYLOAD PERSISTS TO DATABASE                           │
│     After-change hook triggered → Audit log entry created  │
│     Data stored in PostgreSQL (neon.tech)                  │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│  3. API FETCHES CONTENT (ISR/On-demand)                    │
│     /api/page-sections → getPageSections('home')           │
│     Returns array of section objects from database         │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│  4. FRONTEND PAGE RENDERS                                  │
│     page.tsx receives sections via getPageSections()       │
│     Maps each section to SectionRenderer                   │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│  5. SECTIONRENDERER ORCHESTRATES RENDERING                 │
│     Switch on sectionType (hero, feature-grid, text-image) │
│     Renders appropriate component with CMS data            │
└────────────────────────────────────────────────────────────┘
                           ↓
┌────────────────────────────────────────────────────────────┐
│  6. BROWSER DISPLAYS DYNAMIC CONTENT                       │
│     User sees CMS-managed content in real-time             │
└────────────────────────────────────────────────────────────┘
```

### 4.2 Example: Hero Section Workflow

```typescript
// 1. CMS stores:
{
  id: "section-123",
  sectionType: "hero",
  title: "Request Demo",
  heading: "Quantitative Risk Systems",
  description: "Run catastrophe models in seconds...",
  videoUrl: "/media/qrs-demo.mp4",
  imageUrl: "/media/qrs-hero.png",
  buttonText: "Request Demo",
  buttonUrl: "/contact"
}

// 2. Frontend fetches:
const sections = await getPageSections('home')

// 3. SectionRenderer processes:
case 'hero': {
  return (
    <section style={{ background: 'rgba(157, 183, 181, 0.13)', ... }}>
      <h1>{section.heading}</h1>
      <p>{section.description}</p>
      <DeviceFrame videoSrc={getVideoUrl(section.videoUrl)} />
      <Button href={section.buttonUrl}>{section.buttonText}</Button>
    </section>
  )
}

// 4. Browser renders glass morphism hero with video
```

---

## 5. API Routes & Endpoints

### 5.1 Payload API Routes

```
/api/payload/[...slug]  → Main CMS API proxy
  ├── GET /api/payload/collections
  ├── GET /api/payload/users
  ├── POST /api/payload/users (create user)
  ├── PUT /api/payload/users/[id] (update user)
  ├── DELETE /api/payload/users/[id]
  ├── GET /api/payload/page-sections
  ├── GET /api/payload/media
  └── ... (all collections)

/api/health                → Health check
  └── Returns: { status, database: { ok, message }, ... }

/api/page-sections         → Get sections for page
  ├── Query params: ?page=home
  └── Returns: Array<PageSection>

/api/auth/login           → User login
  └── POST { email, password } → { user, token }

/api/auth/logout          → User logout
  └── POST → Clears session

/api/cms-auth/login       → CMS-specific login
  └── POST { email, password } → { user, token }

/api/db-crud              → Generic database operations
  ├── POST (create)
  ├── GET (read with pagination)
  ├── PUT (update)
  └── DELETE (delete)
```

### 5.2 Authentication Endpoints

```typescript
POST /api/auth/login
Request:  { email: string, password: string }
Response: { 
  success: boolean,
  user: { id, email, fullname, role }
}

POST /api/auth/logout
Response: { success: boolean }

GET /api/auth/me
Response: { user: { id, email, fullname, role } }
```

---

## 6. Database Schema

### 6.1 Core Tables

```sql
-- Users (Payload automanaged)
users
├── id (UUID)
├── email (string, unique)
├── password (hashed)
├── fullname (string)
├── role (enum: super-admin, admin, editor, viewer)
├── isActive (boolean)
├── createdAt (timestamp)
└── updatedAt (timestamp)

-- Page Sections (CMS content)
page_sections
├── id (UUID)
├── sectionType (enum: hero, feature-grid, text-image, cta, stats, etc.)
├── title (string)
├── heading (string)
├── description (text)
├── backgroundStyle (string)
├── videoUrl (string)
├── imageUrl (string)
├── order (integer)
├── items (JSONB array)
└── ... (dynamic fields per sectionType)

-- Audit Logs (Compliance)
audit_logs
├── id (UUID)
├── user (UUID, foreign key to users)
├── userEmail (string)
├── action (enum: create, update, delete)
├── collectionName (string)
├── documentId (string)
├── changes (JSONB)
├── timestamp (timestamp)
└── ipAddress (string, optional)

-- Media (Files)
media
├── id (UUID)
├── filename (string)
├── mimeType (string)
├── filesize (number)
├── url (string)
└── ... (Payload-managed fields)
```

### 6.2 Relationships

```
users (1) ──────────────────→ (many) audit_logs
          Logged action author

page_sections (1) ──→ (many) items (JSONB array)
              Contains embedded content

users (many) ──→ (many) permissions
           Via roles
```

---

## 7. Admin Interface Workflow

### 7.1 User Journey: Add New Page Section

```
1. Login at /cms/login
   ├─ Email + password verified against users table
   ├─ Session created (payload-session cookie)
   └─ Redirect to /cms/admin

2. Dashboard shows Collections grid
   └─ Click "Open Collection" → PageSections

3. PageSections collection view
   ├─ Displays existing sections in table
   └─ Click "+ Add New" button

4. Form builder renders
   ├─ Field: sectionType (dropdown)
   ├─ Field: title (text input)
   ├─ Field: heading (text input)
   ├─ Field: description (rich text editor)
   ├─ Field: backgroundStyle (enum select)
   ├─ Field: videoUrl (file picker)
   ├─ Field: items[] (array builder)
   └─ Field: order (number)

5. User fills form and clicks "Save"
   ├─ Validation runs
   ├─ POST to /api/payload/page-sections
   ├─ Database insert
   ├─ After-change hook fires → Audit log created
   └─ Toast notification: "Created successfully"

6. New section appears in collection table
   └─ Ready to use in page assembly
```

### 7.2 Admin Dashboard Routes

```
/cms/login                 → Login form
/cms/admin                 → Dashboard (collections grid)
/cms/collections/[slug]    → Collection management
  ├── /cms/collections/page-sections
  ├── /cms/collections/users
  ├── /cms/collections/media
  └── ... (all 18 collections)
/cms/admin/users           → User management
/cms/admin/submissions     → Form submission view
/cms/admin/logs            → Audit logs viewer
/cms/admin/settings        → CMS configuration
```

---

## 8. Deployment & Environment

### 8.1 Production Deployment (Vercel)

```
Environment Variables (Vercel Dashboard):
├── DATABASE_URL=postgresql://user:pass@neon.tech/qrsdb
├── DATABASE_URL_UNPOOLED=postgresql://... (for migrations)
├── PAYLOAD_SECRET=<32+ char secret>
├── SESSION_SECRET=<random string>
├── JWT_SECRET=<random string>
├── NEXT_PUBLIC_PAYLOAD_URL=https://qrs-app.vercel.app/api/payload
├── NEXT_PUBLIC_CMS_URL=https://qrs-app.vercel.app
├── NEXT_PUBLIC_CMS_API_URL=https://qrs-app.vercel.app/api/payload
├── NEXT_PUBLIC_SITE_URL=https://qrs-app.vercel.app
└── NODE_ENV=production
```

### 8.2 Build & Runtime

```
Build Process (Next.js):
1. npm install (all dependencies)
2. next build (Turbopack compilation)
3. TypeScript check
4. Static page generation (ISR routes)
5. Function bundling (API routes)

Runtime:
- Cold starts: ~1-2s (Vercel auto-scaling)
- Database connections: Pooled via DATABASE_URL
- Media serving: Via /media route (Vercel CDN)
- Session management: Payload cookies + localStorage
```

### 8.3 Root Directory Configuration

```
vercel.json removed (using Vercel project settings instead)
Project Root Directory: frontend/
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

---

## 9. Content Publishing Workflow

### 9.1 Create → Publish → Display

```
Step 1: Draft in CMS
├─ Navigate to /cms/admin
├─ Create/edit page section
└─ Click Save

Step 2: Data Persisted
├─ Payload validates schema
├─ PostgreSQL INSERT/UPDATE
├─ After-change hook logs audit entry
└─ Cache invalidated

Step 3: Frontend Fetches
├─ /api/page-sections endpoint queries database
├─ Returns fresh section data
└─ No cache needed (dynamic on-demand)

Step 4: Page Renders
├─ Next.js page.tsx calls getPageSections()
├─ Sections mapped to SectionRenderer
└─ Dynamic UI rendered per CMS config

Step 5: User Sees Changes
├─ Public pages reflect CMS content
├─ No rebuild/redeploy needed
└─ Changes live within seconds
```

### 9.2 ISR (Incremental Static Regeneration)

```
Currently Disabled for CMS pages (dynamic: 'force-dynamic')
Reason: Content changes frequently, needs real-time updates

Alternative: On-Demand ISR
├─ User edits section in CMS
├─ After-change hook triggers revalidate
├─ Next.js increments version
└─ Next page load gets fresh cache
```

---

## 10. Security & Compliance

### 10.1 Authentication Security

```
Password Storage:
├─ bcryptjs (10 rounds)
├─ Stored in users.password (hashed)
└─ Never transmitted in plain text

Session Management:
├─ HTTP-only cookies (payload-session)
├─ CSRF protection via Payload config
├─ Session timeout: 24 hours (default)
└─ localStorage backup: payload-user (for hydration)

API Authentication:
├─ Middleware checks cookie validity
├─ Unauthorized requests rejected (401)
└─ Protected routes require specific role
```

### 10.2 Audit Logging

```
Triggers:
├─ After collection change (create/update)
├─ After collection delete
└─ Every audit log records:
   ├─ user (who made change)
   ├─ action (create/update/delete)
   ├─ collectionName (which table)
   ├─ documentId (which row)
   ├─ changes (before/after JSONB)
   ├─ timestamp (when)
   └─ ipAddress (from request, optional)

Access:
└─ Only super-admin + admin can view /cms/admin/logs
```

### 10.3 Data Privacy

```
User Data:
├─ Passwords: Hashed only
├─ Email: Indexed (searchable)
├─ Roles: Enforced server-side
└─ No PII in audit logs (except necessary user ID)

Media Files:
├─ Stored in /public/media
├─ Served via CDN
└─ No sensitive data in alt text/metadata

Form Submissions:
├─ Stored in form_submissions table
├─ Accessible only to admin+
└─ Email validation on submission
```

---

## 11. Common Operations

### 11.1 Add a New User

```bash
# Via CMS Admin
1. /cms/admin → Collections → Users
2. Click "+ Add New"
3. Fill form (email, password, fullname, role)
4. Click Save
5. User can now login at /login

# Via API (admin only)
POST /api/payload/users
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "fullname": "User Name",
  "role": "editor",
  "isActive": true
}
```

### 11.2 Create Page Section

```bash
# Via CMS Admin
1. /cms/admin → Collections → PageSections
2. Click "+ Add New"
3. sectionType: Select "hero" / "feature-grid" / etc.
4. Fill title, heading, description
5. Upload video/image via media picker
6. Configure buttons, links, etc.
7. Click Save
8. Section automatically appears on pages that reference it

# Check result
- Open /api/page-sections?page=home
- Should see new section in response
- Frontend auto-renders via SectionRenderer
```

### 11.3 Update Navigation

```bash
# Via CMS Admin
1. /cms/admin → Globals → Navigation
2. Edit menu items array
3. Set links, labels, order
4. Click Save
5. Changes reflect on all pages using Navigation global
```

### 11.4 Create Form Submission

```bash
# User submits form on marketing page
1. Form (contact, newsletter, demo request)
2. POST /api/forms/submit
3. Payload creates FormSubmission record
4. Admin sees in /cms/admin/submissions
5. Optional: Webhook to CRM (Segment, HubSpot)
```

---

## 12. Troubleshooting

### 12.1 CMS Not Loading

```
Symptom: /cms/admin shows 404
Solution:
├─ Check middleware.ts (protects /cms routes)
├─ Verify DATABASE_URL is set
├─ Check if logged in (go to /cms/login)
└─ Look at Vercel logs for errors

Symptom: Login fails
Solution:
├─ Verify user exists in users table
├─ Check password hash matches bcrypt
├─ Clear cookies and retry
└─ Check /api/auth/login in Vercel logs
```

### 12.2 Content Not Showing

```
Symptom: Sections created in CMS but don't appear on page
Solution:
├─ Check /api/page-sections endpoint (should return data)
├─ Verify sectionType matches a case in SectionRenderer
├─ Check if page is calling getPageSections()
├─ Clear browser cache
└─ Check console for errors (useEffect hooks)

Symptom: Old content still showing
Solution:
├─ Hard refresh browser (Ctrl+Shift+R)
├─ Vercel deployment may be caching
└─ Check if ISR revalidation is working
```

### 12.3 Database Connection Issues

```
Symptom: "DATABASE_URL not found" error
Solution:
├─ Set DATABASE_URL in Vercel environment
├─ Use DATABASE_URL_UNPOOLED for migrations
└─ Restart Vercel deployment after setting env vars

Symptom: "Too many connections" error
Solution:
├─ Use pooled DATABASE_URL (not unpooled)
├─ Check for connection leaks in /api routes
└─ Reduce max_connections if on free tier
```

---

## 13. Best Practices

### 13.1 Content Management

```
✓ DO:
├─ Keep section titles short and descriptive
├─ Use backgroundStyle enum values only
├─ Test content on mobile before publishing
├─ Use media picker (not direct URLs)
└─ Review audit logs regularly

✗ DON'T:
├─ Hardcode URLs in section content
├─ Edit database directly (use CMS)
├─ Store sensitive data in description fields
├─ Create circular content references
└─ Change sectionType after creation (recreate instead)
```

### 13.2 Performance

```
✓ Optimize:
├─ Video files: < 1.5 MB (use WebP or H.264)
├─ Images: Compress via media picker
├─ Sections: Keep items array < 50 entries
├─ API: Cache /api/page-sections at CDN level
└─ Database: Index frequently-searched fields

Monitor:
├─ Vercel analytics (Core Web Vitals)
├─ Database query times (Neon dashboard)
├─ API response times (/api/health endpoint)
└─ CMS load times (admin dashboard responsiveness)
```

### 13.3 Security

```
✓ DO:
├─ Rotate PAYLOAD_SECRET periodically
├─ Audit logs weekly for suspicious activity
├─ Use strong passwords (12+ chars, mixed case)
├─ Restrict admin role to trusted users
└─ Enable 2FA when available

✗ DON'T:
├─ Commit secrets to git (.env files)
├─ Share admin credentials
├─ Expose DATABASE_URL in client code
├─ Disable RBAC for convenience
└─ Keep deleted users in database (soft delete)
```

---

## 14. Future Roadmap

### Planned Enhancements

```
Short term (Q4 2026):
├─ Multi-language content support
├─ Scheduled publishing (future date publishing)
├─ Content versioning / rollback
└─ Bulk import from CSV

Medium term (Q1 2027):
├─ Webhook integrations (Slack, Teams)
├─ Email notification on changes
├─ Content approval workflow
└─ Advanced search filters

Long term:
├─ GraphQL API (alongside REST)
├─ Real-time collaboration (multiple editors)
├─ A/B testing framework
└─ Analytics dashboard (which sections get views)
```

---

## 15. Contact & Support

**Payload CMS Docs:** https://payloadcms.com/docs
**This Project:** QRS Quantum Risk Systems
**Maintainer:** Bilal Ahmad (PM/QA) · Claude Code (Development)
**Repository:** github.com/Bilal-Ahmad-design/qrs-app

---

*Last Updated: 2026-09-16 · Architecture v1.0 · Payload v3.87.0*
