# CMS Code Structure - Visual Guide

**Purpose:** Quick reference to understand and navigate the CMS codebase  
**Last Updated:** 2026-08-21

---

## Quick Navigation

```
qrs-cms/
│
├── 📋 Collections/               ← Database schema (18 files)
├── ⚙️  Globals/                  ← Global settings (2 files)
├── 🔧 Lib/                       ← Utilities & helpers
├── 🎣 Hooks/                     ← Lifecycle events
├── ⚡ payload.config.ts          ← Main CMS config
└── 📦 package.json               ← Dependencies
```

---

## Collections Directory (18 Files)

```
collections/

Content Management (6 files)
├── PageSections.ts          ← Page content blocks (10 section types)
├── Blog.ts                  ← Blog posts
├── Pages.ts                 ← Generic pages
├── Media.ts                 ← File uploads
├── Documentation.ts         ← Technical docs
└── ValidationReports.ts     ← Validation documents

Data & Business Logic (5 files)
├── Solutions.ts             ← Role-based solutions (5 personas)
├── RegulatoryCompliance.ts  ← Regulatory frameworks (4 types)
├── PlatformCapability.ts    ← Platform features
├── PerilStatus.ts           ← Model status (7 perils)
└── ProductShowcase.ts       ← Demo content

Compliance & Logging (4 files)
├── FormSubmissions.ts       ← Form logs (contact, privacy-request)
├── AuditLogs.ts             ← Audit trail (append-only, SOC 2)
├── EmailLogs.ts             ← Email send logs
└── EmailSettings.ts         ← Email configuration

Infrastructure (3 files)
├── Users.ts                 ← User management + RBAC + auth
├── Redirects.ts             ← URL redirects (301/302)
└── FormEntries.ts           ← Form entry storage
```

---

## Collections by Purpose

### 🎨 Frontend Content

Used to populate what appears on the website:

```
PageSections.ts
  ↓
  Provides sections for all pages:
  - Home (/)
  - Platform (/platform)
  - Verify (/verify)
  - Solutions (/solutions)
  - Regulatory (/regulatory)
  - Trust (/trust)
  - Validation (/validation)
  - About (/about)
```

**Fields:**
- page: select (home, platform, verify, solutions, etc.)
- sectionType: select (hero, feature-grid, text-image, cta, stats, workflow-steps, regulatory-grid, etc.)
- heading, description, items (array)
- backgroundStyle: light/dark/institutional
- order: display sequence
- published: visibility toggle

**Example Query:**
```javascript
// Frontend fetches sections for /verify page
GET /api/page-sections?page=verify&published=true&sort=order

// Returns:
{
  "docs": [
    {
      "id": "abc123",
      "sectionType": "hero",
      "heading": "Built to be Verified",
      "order": 0,
      "published": true
    },
    {
      "id": "def456",
      "sectionType": "feature-grid",
      "items": [...],
      "order": 1,
      "published": true
    }
  ]
}
```

---

### 📊 Data Collections

Structured data for specific frontend features:

```
Solutions.ts (5 items)
  └─ Underwriters
  └─ Portfolio Managers
  └─ Reinsurance Buyers
  └─ ILS Managers
  └─ Chief Risk Officers

RegulatoryCompliance.ts (4 items)
  └─ Solvency II (EU)
  └─ NAIC RBC (US)
  └─ ORSA (Multi-Region)
  └─ Lloyd's/BMA (Bermuda)

PerilStatus.ts (7 items)
  └─ Hurricane (validated)
  └─ Flood (illustrative)
  └─ Earthquake (illustrative)
  └─ Severe Convective Storm (illustrative)
  └─ Wildfire (illustrative)
  └─ Cyber (roadmap)
  └─ Space Weather (roadmap)

PlatformCapability.ts (12+ items)
  └─ Multi-Peril Modeling
  └─ EP Curves
  └─ Risk Maps
  └─ ... etc
```

---

### 🔐 Security & Compliance

```
Users.ts (Authentication & RBAC)
  ├─ Email + Password auth
  ├─ JWT tokens (7-day expiry)
  ├─ 5 roles (super-admin, admin, editor, reviewer, read-only)
  ├─ Custom permissions array
  └─ Status tracking (active, inactive, suspended)

AuditLogs.ts (Compliance Trail)
  ├─ Append-only log (cannot delete)
  ├─ Tracks: who, what, when, where
  ├─ Stores JSON diffs of changes
  └─ Used for SOC 2 compliance

FormSubmissions.ts (Form Logging)
  ├─ All form submissions logged
  ├─ Stores: email, name, message, IP, timestamp
  └─ Tracks Turnstile verification

EmailSettings.ts & EmailLogs.ts
  └─ Email configuration + send logs
```

---

## Globals Directory (2 Files)

Singleton data that applies site-wide:

```
globals/

Settings.ts
├─ hero
│  ├─ title: "Run catastrophe models in seconds"
│  ├─ subtitle: "Patent Pending: QRS-001-PROV"
│  ├─ cta_text: "Request Demo"
│  └─ background_image: (upload)
│
├─ kpis
│  ├─ portfolio_tiv: "$15.2T"
│  ├─ monitored_policies: "250K+"
│  ├─ avg_var_reduction: "42%"
│  └─ active_users: "5K+"
│
└─ branding
   ├─ company_name: "QRS"
   ├─ tagline: "The Intelligent QRS Platform"
   ├─ support_email: "support@qrs.io"
   └─ support_phone: "+1 (555) 123-4567"

TrustCenter.ts
└─ Trust-related information
```

**API:**
```bash
GET /api/globals/settings
GET /api/globals/trust-center
```

---

## Lib Directory (Utilities)

```
lib/

rbac/roles.ts
├─ ROLE_PERMISSIONS: Map of 5 roles → 14 permissions
├─ hasPermission(): Check if user has permission
└─ canAccessCollection(): Check collection access

validation/schemas.ts
├─ contactFormSchema
├─ privacyRequestSchema
└─ Custom Zod validators

validation/responses.ts
├─ successResponse()
├─ errorResponse()
└─ Standard API response format

config/env.ts
└─ Access environment variables safely
```

---

## Complete Data Model

```
┌─────────────────────────────────────────────────────────┐
│                   PAYLOAD CMS                           │
└─────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        ▼                   ▼                   ▼
    Collections         Globals            Hooks
        │                 │                 │
        │                 │                 │
    ┌──┴──┐           ┌──┴──┐          ┌───┴───┐
    │  18 │           │  2  │          │ Audit │
    │files│           │files│          │ Log   │
    └──┬──┘           └──┬──┘          └───┬───┘
       │                │                  │
       ▼                ▼                  ▼
    Content          Settings         Events
    (Pages,        (Hero, KPIs,      (Before/
     Solutions,     Branding)         After)
     Data)

       All stored in ──→ PostgreSQL Database
```

---

## File Dependencies

```
payload.config.ts
├─ imports all 18 collections
├─ imports 2 globals
└─ configures database + auth

Each Collection File (e.g., Solutions.ts)
├─ exports CollectionConfig
├─ imports Payload types
└─ may import lib utilities

Hooks
├─ imports AuditLogs collection
└─ triggers on collection changes
```

---

## Key Files Explained

### payload.config.ts (Main Configuration)

```typescript
// This file:
1. Imports all collections
2. Imports all globals
3. Configures database connection (PostgreSQL)
4. Sets up authentication (JWT)
5. Configures admin UI
6. Specifies secret key

// Result: Complete CMS definition
```

### Collections (Database Schema)

Each collection file defines:
1. **slug** - URL path (e.g., "page-sections")
2. **fields** - Columns in database
3. **access** - Who can read/create/update/delete
4. **admin** - How it appears in admin UI
5. **hooks** - Lifecycle events (before/after)

### Globals (Singleton Configuration)

Each global file defines:
1. **slug** - URL path (e.g., "settings")
2. **fields** - Configuration fields
3. **access** - Who can read/update
4. **admin** - UI display

---

## Code Reading Guide

### To Understand Content Management
Read in this order:
1. `payload.config.ts` - See how everything is configured
2. `collections/PageSections.ts` - See how page content is defined
3. `globals/Settings.ts` - See global site settings

### To Understand Data Storage
Read:
1. `collections/Solutions.ts` - Role-based data
2. `collections/RegulatoryCompliance.ts` - Framework data
3. `collections/PerilStatus.ts` - Model status data

### To Understand Security
Read:
1. `collections/Users.ts` - User management + RBAC
2. `lib/rbac/roles.ts` - Permission definitions
3. `collections/AuditLogs.ts` - Audit trail
4. `hooks/auditLog.ts` - Audit hook

### To Understand Form Handling
Read:
1. `collections/FormSubmissions.ts` - Form storage
2. `lib/validation/schemas.ts` - Form validation
3. `lib/validation/responses.ts` - Response formatting

---

## File Naming Convention

```
Collections/
├─ [Feature].ts              (e.g., Solutions.ts, PerilStatus.ts)

Globals/
├─ [Configuration].ts        (e.g., Settings.ts, TrustCenter.ts)

Lib/
├─ [category]/[feature].ts   (e.g., rbac/roles.ts)

Hooks/
├─ [trigger].ts              (e.g., auditLog.ts)
```

---

## Size Metrics

```
Collections: 18 files, ~1000 lines total
Globals: 2 files, ~200 lines total
Lib: 5 files, ~300 lines total
Hooks: 1 file, ~50 lines total
Config: 1 file, ~70 lines total

Total: ~1,600 lines of CMS code
```

---

## Search Guide

### To find code about...

| Topic | File |
|-------|------|
| Page content blocks | collections/PageSections.ts |
| Role-based solutions | collections/Solutions.ts |
| Regulatory frameworks | collections/RegulatoryCompliance.ts |
| Model status | collections/PerilStatus.ts |
| User authentication | collections/Users.ts |
| Form submissions | collections/FormSubmissions.ts |
| Audit logging | collections/AuditLogs.ts, hooks/auditLog.ts |
| Site settings | globals/Settings.ts |
| Form validation | lib/validation/schemas.ts |
| RBAC permissions | lib/rbac/roles.ts |

---

## Quick Commands

```bash
# View all collections in admin
# http://localhost:3001/admin

# Query collections via API
curl http://localhost:3001/api/page-sections

# Check database
psql $DATABASE_URL
```

---

## Next Steps

1. **Read** `README.md` - Get overview
2. **Explore** `collections/` - See how data is defined
3. **Check** `payload.config.ts` - See how it all connects
4. **Test** API endpoints - Verify it works
5. **Create** content in admin - See it live on frontend

---

**Questions?** Check the file headers or search for comments in the code.
