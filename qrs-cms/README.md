# QRS CMS - Payload CMS Backend

**What is this?** Headless CMS backend that manages all content for the QRS frontend  
**Port:** 3001  
**Technology:** Payload CMS 3.87.0 (Next.js + Express + PostgreSQL)  
**Admin UI:** http://localhost:3000/admin (proxied from frontend)

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development
npm run dev
# Runs on http://localhost:3001

# Production build
npm run build

# Production start
npm start
```

---

## Folder Structure

```
qrs-cms/
├── collections/                    # Database collections (18 total)
│   ├── Users.ts                   # User management + RBAC
│   ├── Pages.ts                   # Generic pages
│   ├── PageSections.ts            # Page content sections (10 types)
│   ├── Blog.ts                    # Blog posts
│   ├── Media.ts                   # Images/PDFs/uploads
│   ├── ProductShowcase.ts         # Demo content
│   ├── Solutions.ts               # Role-based solutions (5 personas)
│   ├── RegulatoryCompliance.ts    # Regulatory frameworks (4 types)
│   ├── PlatformCapability.ts      # Platform features
│   ├── Documentation.ts           # Technical documentation
│   ├── PerilStatus.ts             # Peril/model status
│   ├── ValidationReports.ts       # Validation reports
│   ├── Redirects.ts               # URL redirects (301/302)
│   ├── FormSubmissions.ts         # Form submission logs
│   ├── FormEntries.ts             # Form entries
│   ├── AuditLogs.ts               # Audit trail (append-only)
│   ├── EmailSettings.ts           # Email configuration
│   └── EmailLogs.ts               # Email send logs
│
├── globals/                        # Singleton configuration
│   ├── Settings.ts                # Hero content, KPIs, branding
│   └── TrustCenter.ts             # Trust center information
│
├── lib/                            # Shared utilities
│   ├── rbac/
│   │   └── roles.ts               # Role-based access control (5 roles, 14 permissions)
│   ├── validation/
│   │   ├── schemas.ts             # Zod validation schemas
│   │   └── responses.ts           # API response builders
│   └── config/
│       └── env.ts                 # Environment variable access
│
├── hooks/                          # Lifecycle hooks
│   └── auditLog.ts                # Audit logging on collection changes
│
├── payload.config.ts              # Main CMS configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── .env.local                     # Environment variables (DATABASE_URL, JWT_SECRET, etc)
└── README.md                      # This file
```

---

## Key Files Explained

### Collections (Database Schema)

#### **Users.ts** - User Management & Authentication
- Email + password authentication
- Role-based access control (5 roles: super-admin, admin, editor, reviewer, read-only)
- Custom permissions array for granular control
- Status field (active, inactive, suspended)

**Used by:** Payload CMS admin authentication

#### **PageSections.ts** - Content Blocks
- Page sections for all frontend pages
- 10 section types: hero, feature-grid, text-image, cta, stats, workflow-steps, product-evidence, regulatory-grid, security-compliance, security-features-grid
- Conditional fields based on section type
- Background style options (light, white, light-institutional, dark, deep-dark)
- Order field for display sequence
- Published checkbox for visibility

**Used by:** All 8 frontend pages (home, platform, verify, solutions, regulatory, trust, validation, about)

#### **Solutions.ts** - Role-Based Solutions
- Solutions for 5 personas: Underwriters, Portfolio Managers, Reinsurance Buyers, ILS Managers, CROs
- Role title, description, features array
- Order for sorting
- Published flag

**Used by:** /solutions page

#### **RegulatoryCompliance.ts** - Regulatory Frameworks
- 4 frameworks: Solvency II (EU), NAIC RBC (US), ORSA (Multi-Region), Lloyd's/BMA (Bermuda)
- Framework name, region, description, capabilities
- Order and published flag

**Used by:** /regulatory page

#### **PerilStatus.ts** - Model Status Tracking
- 7 perils: Hurricane, Flood, Earthquake, Severe Convective Storm, Wildfire, Cyber, Space Weather
- Status field: validated, illustrative, roadmap
- Order for display
- Published flag

**Used by:** Home page peril grid

#### **ProductShowcase.ts** - Demo Content
- Product demonstrations/screenshots
- Title, description, image/video URL
- Category for filtering
- Order and published flag

**Used by:** Platform page, hero sections

#### **PlatformCapability.ts** - Feature Catalog
- Platform capabilities and features
- Title, description, icon
- Category for grouping
- Order and published flag

**Used by:** Platform page

#### **PerilStatus.ts** - Model Statuses
- Tracks which models are: validated, illustrative, or roadmap
- Links to perils with status badges

#### **Redirects.ts** - URL Redirects
- Source path and destination path
- Type: 301 (permanent) or 302 (temporary)
- Used for legacy URLs from WordPress migration

**Used by:** next.config.js redirects

#### **FormSubmissions.ts** - Form Logging
- All form submissions (contact, privacy-request)
- Email, name, message, form type
- IP address, Turnstile verification status
- Timestamp, published flag

**Used by:** Admin dashboard form view

#### **AuditLogs.ts** - Compliance Audit Trail
- Append-only audit log
- Table name, record ID, action (create, update, delete, publish)
- Changes (JSON diff)
- User ID, IP address, timestamp

**Used by:** Compliance auditing, SOC 2 requirements

#### **Others**
- **Pages.ts** - Generic CMS pages (for future use)
- **Blog.ts** - Blog posts
- **Media.ts** - File uploads (images, PDFs)
- **Documentation.ts** - Technical documentation
- **ValidationReports.ts** - Validation report documents
- **EmailSettings.ts** - SMTP configuration
- **EmailLogs.ts** - Email send logs
- **FormEntries.ts** - Form entry storage

---

### Globals (Singleton Configuration)

#### **Settings.ts**
- **hero** group: title, subtitle, CTA text, background image
- **kpis** group: portfolio_tiv, monitored_policies, avg_var_reduction, active_users
- **branding** group: company name, tagline, support email, support phone

**Used by:** Frontend to fetch global settings via `getSettings()` API call

#### **TrustCenter.ts**
- Trust-related information and messaging
- Can be extended with certifications, security info, etc.

---

### Library Files

#### **lib/rbac/roles.ts** - Role-Based Access Control
```typescript
5 Roles:
- super-admin: Full access
- admin: Manage collections + users
- editor: Create/update content
- reviewer: Review-only access
- read-only: View-only access

14 Permissions:
- users:read, users:create, users:update, users:delete
- content:read, content:create, content:update, content:delete, content:publish
- forms:read
- audit:read
- settings:update
```

#### **lib/validation/schemas.ts** - Input Validation
- Zod schemas for form validation
- Contact form, privacy request, custom validation rules

#### **lib/validation/responses.ts** - API Response Builders
- Success response builder
- Error response builder with field-level errors
- Standard response format

---

## API Endpoints

All endpoints run on `http://localhost:3001/api/`

### Collections

```bash
# Example: Get all page sections
GET /api/page-sections?page=verify&published=true&sort=order

# Example: Get solutions
GET /api/solutions?published=true&sort=order

# Example: Get regulatory frameworks
GET /api/regulatory-compliance?published=true
```

### Globals

```bash
# Settings
GET /api/globals/settings

# Trust Center
GET /api/globals/trust-center
```

### Authentication

```bash
# Login
POST /api/users/login
Body: { email: string, password: string }

# Logout
POST /api/users/logout
```

---

## Environment Variables

Create `.env.local` with:

```bash
# Database
DATABASE_URL=postgresql://user:pass@host/dbname

# CMS Security
PAYLOAD_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret

# Email (optional)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=user@example.com
SMTP_PASS=password
```

---

## RBAC (Role-Based Access Control)

### 5 Roles

1. **Super Admin** - Full system access
   - Create/update/delete users
   - Manage all collections
   - Access audit logs
   - Update settings

2. **Admin** - Content management
   - Create/update/delete content
   - Manage users (except role assignment)
   - View audit logs
   - Publish content

3. **Editor** - Content creation
   - Create/update own content
   - Publish content
   - View forms
   - Cannot delete

4. **Reviewer** - Content review
   - View-only access
   - Comment/review capability
   - Cannot create/edit/delete

5. **Read-Only** - View-only
   - View published content only
   - No editing capabilities

### 14 Permissions

```
users:read, users:create, users:update, users:delete
content:read, content:create, content:update, content:delete, content:publish
forms:read
audit:read
settings:update
```

---

## Development Tips

### Add a New Collection

1. Create file: `collections/NewCollection.ts`
2. Define CollectionConfig with fields
3. Import in `payload.config.ts`
4. Add to collections array in config
5. Restart CMS
6. New collection appears in admin

### Add a New Global

1. Create file: `globals/NewGlobal.ts`
2. Define GlobalConfig
3. Import in `payload.config.ts`
4. Add to globals array
5. Restart CMS

### Add API Endpoint

Endpoints are auto-generated by Payload CMS:
- Collections auto-get: GET `/api/{collection}`
- Collections auto-post: POST `/api/{collection}`
- Globals auto-get: GET `/api/globals/{global}`
- Globals auto-put: PUT `/api/globals/{global}`

### Test API with curl

```bash
# Get published page sections for verify page
curl -s http://localhost:3001/api/page-sections?page=verify&published=true | jq

# Get settings
curl -s http://localhost:3001/api/globals/settings | jq

# Login
curl -X POST http://localhost:3001/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

---

## Troubleshooting

### "Database connection failed"
- Check DATABASE_URL in `.env.local`
- Verify PostgreSQL is running (Neon cloud or local)
- Test connection: `psql $DATABASE_URL`

### "Cannot find module"
- Run: `npm install`
- Delete: `node_modules` and `.next`
- Run: `npm install` again

### "Admin UI not loading"
- CMS runs on port 3001
- Frontend proxies to `/admin`
- Go to: http://localhost:3000/admin (not 3001/admin)

### Payload crashes on startup
- Check for TypeScript errors: `npm run build`
- Check DATABASE_URL format
- Ensure all imports are correct in payload.config.ts

---

## Production Deployment

### Option 1: Vercel (Node.js Function)
```bash
# Deploy to Vercel
vercel deploy
```

### Option 2: Railway / Render.com
```bash
# Deploy to Railway
railway up

# Or Render
# Connect GitHub repo to render.com
```

### Option 3: Self-hosted VPS
```bash
# Build and start on VPS
npm run build
npm start
```

---

## Related Documentation

- [MONOREPO_GUIDE.md](../MONOREPO_GUIDE.md) - How to run frontend + CMS together
- [CMS_SETUP_GUIDE.md](../CMS_SETUP_GUIDE.md) - Content editor guide
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System architecture

---

## Payload CMS Resources

- Official Docs: https://payloadcms.com/docs
- GitHub: https://github.com/payloadcms/payload
- Community: https://discord.gg/r6sCXqVk3d

---

**Need help?** Check the collection files or payload.config.ts for examples.
