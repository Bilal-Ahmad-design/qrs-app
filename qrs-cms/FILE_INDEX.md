# CMS File Index - Complete Reference

Quick lookup table for all files in the CMS codebase.

---

## Root Level Files

| File | Size | Purpose |
|------|------|---------|
| **payload.config.ts** | 70 lines | Main CMS configuration, imports all collections & globals |
| **package.json** | 30 lines | Dependencies and build scripts |
| **tsconfig.json** | 30 lines | TypeScript configuration |
| **.env.local** | 10 lines | Environment variables (DATABASE_URL, PAYLOAD_SECRET, etc) |
| **README.md** | 400 lines | CMS overview and quick start |
| **CODE_STRUCTURE.md** | 350 lines | Visual guide to code organization |
| **FILE_INDEX.md** | This file | Complete file reference |

---

## Collections (18 Files)

### Content Management Collections

#### **PageSections.ts** (270 lines)
**Purpose:** Store page content blocks with 10 section types  
**Used By:** All 8 frontend pages  
**Key Fields:**
- page (select): home, platform, verify, solutions, regulatory, trust, validation, about
- sectionType (select): hero, feature-grid, text-image, cta, stats, workflow-steps, product-evidence, regulatory-grid, security-compliance, security-features-grid
- heading, description, items (array)
- backgroundStyle: light, white, light-institutional, dark, deep-dark
- order: display sequence
- published: visibility flag

**Example:** Hero section for /verify page with custom heading and CTA

---

#### **Blog.ts** (150 lines)
**Purpose:** Blog post management  
**Used By:** Potential blog section (not currently used)  
**Key Fields:**
- title, slug, excerpt, content
- author, featured image
- categories, tags
- published date, status
- SEO fields

**Example:** Future blog posts about QRS platform

---

#### **Pages.ts** (100 lines)
**Purpose:** Generic page storage  
**Used By:** Could be used for dynamic pages  
**Key Fields:**
- title, slug, content
- layout configuration
- SEO metadata
- status (draft/published)

**Example:** Future flexible page creation

---

#### **Media.ts** (80 lines)
**Purpose:** File upload and media management  
**Used By:** Referenced by other collections (images, PDFs)  
**Key Fields:**
- filename, mimetype, filesize
- url, alt text
- media type (image/pdf/video)
- upload date, uploader

**Example:** Hero images, showcase screenshots, PDF documents

---

#### **Documentation.ts** (120 lines)
**Purpose:** Technical documentation storage  
**Used By:** /docs page or knowledge base  
**Key Fields:**
- title, slug, content (richText)
- section (docs, guides, api-reference)
- order, status
- author, last-modified

**Example:** API documentation, user guides, troubleshooting

---

#### **ValidationReports.ts** (100 lines)
**Purpose:** Validation report documents  
**Used By:** /validation page  
**Key Fields:**
- title, description
- report file (PDF upload)
- report date, version
- status (draft/published)
- methodology notes

**Example:** SSRN validation study, third-party audit reports

---

### Data Collections

#### **Solutions.ts** (150 lines)
**Purpose:** Role-based solutions (5 personas)  
**Used By:** /solutions page  
**Key Fields:**
- roleTitle: Underwriters, Portfolio Managers, Reinsurance Buyers, ILS Managers, Chief Risk Officers
- description, features (array)
- order, published

**Data Count:** 5 items (one per role)  
**Example:** Solution for Underwriters with 4 features

---

#### **RegulatoryCompliance.ts** (140 lines)
**Purpose:** Regulatory framework information  
**Used By:** /regulatory page  
**Key Fields:**
- framework: Solvency II, NAIC RBC, ORSA, Lloyd's/BMA
- region: European Union, United States, Multi-Region, Bermuda & Lloyd's
- description, capabilities (array)
- order, published

**Data Count:** 4 items (one per framework)  
**Example:** Solvency II framework with EU region and 4 capabilities

---

#### **RegulatoryCompliance.ts** (140 lines)
**Purpose:** Platform capabilities and features  
**Used By:** /platform page, feature grids  
**Key Fields:**
- title, description
- category: risk-engine, ai-intelligence, compliance, integration
- icon (optional), details (array)
- order, published

**Data Count:** 12+ items  
**Example:** "Multi-Peril Modeling" capability with description

---

#### **PerilStatus.ts** (120 lines)
**Purpose:** Peril/model status tracking  
**Used By:** Home page peril grid  
**Key Fields:**
- perilName: Hurricane, Flood, Earthquake, Severe Convective Storm, Wildfire, Cyber, Space Weather
- status (select): validated, illustrative, roadmap
- description, details
- order, published

**Data Count:** 7 items  
**Example:** Hurricane marked as "validated" status

---

#### **ProductShowcase.ts** (140 lines)
**Purpose:** Product demo content and screenshots  
**Used By:** Platform page showcase sections  
**Key Fields:**
- title, description
- imageUrl or videoUrl
- category: risk-map, ep-curve, war-room, quantum-arch, etc
- order, published

**Data Count:** 3+ items  
**Example:** "Risk Map" showcase with screenshot

---

### Compliance & Logging Collections

#### **FormSubmissions.ts** (130 lines)
**Purpose:** Log all form submissions for audit trail  
**Used By:** Admin dashboard form view  
**Key Fields:**
- email, name, message
- form_type: contact, privacy-request
- ip_address, turnstile_verified (boolean)
- timestamp, published

**Example:** Contact form submission with verification status

---

#### **AuditLogs.ts** (160 lines)
**Purpose:** Append-only compliance audit trail (SOC 2 requirement)  
**Used By:** Compliance auditing, regulatory review  
**Key Fields:**
- table_name: which collection was changed
- record_id: which record was affected
- action: create, update, delete, publish
- changes: JSON diff of what changed
- user_id, ip_address, timestamp

**Access:** Read-only, append-only (no deletion)  
**Example:** "Updated PageSections record abc123: changed heading from 'Old' to 'New'"

---

#### **EmailLogs.ts** (100 lines)
**Purpose:** Track all email sends for delivery monitoring  
**Used By:** Email troubleshooting, delivery verification  
**Key Fields:**
- email_to, email_from
- subject, body (template)
- send_status: sent, failed, bounced
- error_message (if failed)
- timestamp

**Example:** Contact form email sent to support@qrs.io

---

#### **EmailSettings.ts** (90 lines)
**Purpose:** Email configuration (SMTP settings)  
**Used By:** Email service configuration  
**Key Fields:**
- smtp_host, smtp_port, smtp_user, smtp_pass
- sender_email, sender_name
- reply_to_email
- status: active, inactive

**Example:** SMTP configuration for transactional emails

---

### Infrastructure Collections

#### **Users.ts** (200 lines)
**Purpose:** User management, authentication, and RBAC  
**Used By:** CMS admin authentication, permission checking  
**Key Fields:**
- email (unique), fullname
- password (hashed via bcrypt)
- role: super-admin, admin, editor, reviewer, read-only
- permissions (array of objects: resource + actions)
- status: active, inactive, suspended
- created_at, last_login

**Features:**
- 5 roles with pre-defined permissions
- Custom permissions per user
- 7-day JWT token expiry
- Password minimum 8 characters
- Email format validation

**Example:** Admin user with full permissions, Editor user with content-only access

---

#### **Redirects.ts** (110 lines)
**Purpose:** URL redirect management (legacy URL migration)  
**Used By:** next.config.js redirects function  
**Key Fields:**
- sourcePath: old URL path
- destinationPath: new URL path
- type: 301 (permanent), 302 (temporary)
- description, active (boolean)

**Used By:** WordPress → QRS migration URLs  
**Example:** /old-wordpress-article → /verify (301 redirect)

---

#### **FormEntries.ts** (100 lines)
**Purpose:** Store form entries/responses  
**Used By:** Forms with multiple fields  
**Key Fields:**
- form_id, form_name
- entries (JSON of form fields)
- submitted_by (optional email)
- timestamp

**Example:** Multi-field form submission storage

---

## Globals (2 Files)

#### **Settings.ts** (180 lines)
**Purpose:** Global site settings and configuration  
**Used By:** Frontend via `getSettings()` API call  
**Key Fields:**
- hero
  - title, subtitle, cta_text, background_image
- kpis
  - portfolio_tiv, monitored_policies, avg_var_reduction, active_users
- branding
  - company_name, tagline, support_email, support_phone

**Example:** Update hero title without touching code

---

#### **TrustCenter.ts** (100 lines)
**Purpose:** Trust and security related information  
**Used By:** Trust page, security messaging  
**Key Fields:**
- certifications (array)
- security_contact
- compliance_info
- trust_badges

**Example:** SOC 2 certification status, security team contact

---

## Lib Directory (5 Files)

### lib/rbac/roles.ts (100 lines)
**Purpose:** Role-Based Access Control configuration  
**Exports:**
- `ROLE_PERMISSIONS`: Map of 5 roles → 14 permissions
- `hasPermission(role, permission)`: Check if user has permission
- `canAccessCollection(user, collection)`: Check collection access

**5 Roles:**
- super-admin: All permissions
- admin: Create/update content, manage users, view audit logs
- editor: Create/update own content, publish
- reviewer: View-only, can comment
- read-only: View published content only

**14 Permissions:**
- users:read, users:create, users:update, users:delete
- content:read, content:create, content:update, content:delete, content:publish
- forms:read, audit:read, settings:update

**Example:** `hasPermission('editor', 'content:publish')` returns true

---

### lib/validation/schemas.ts (80 lines)
**Purpose:** Zod validation schemas for form data  
**Exports:**
- `contactFormSchema`: name (≥2), email, message (≥10)
- `privacyRequestSchema`: email, requestType, description (≥10)
- Custom validators (email format, string length, etc)

**Used By:** Frontend form validation at API boundary  
**Example:** Validate contact form before storing in database

---

### lib/validation/responses.ts (60 lines)
**Purpose:** Standardized API response builders  
**Exports:**
- `successResponse(data)`: { success: true, data, message }
- `errorResponse(errors)`: { success: false, errors: { fieldName: "error message" } }
- `ApiError`: Custom error class with field-level errors

**Used By:** All API responses for consistency  
**Example:** Return standardized error for invalid email format

---

### lib/config/env.ts (40 lines)
**Purpose:** Safely access environment variables  
**Exports:**
- `DATABASE_URL`, `PAYLOAD_SECRET`, `JWT_SECRET`
- Validates env vars are set
- Type-safe access

**Example:** `const db = process.env.DATABASE_URL` (with validation)

---

## Hooks (1 File)

### hooks/auditLog.ts (50 lines)
**Purpose:** Audit logging lifecycle hook  
**Triggers:** Before/after collection changes  
**Logs:**
- Table name, record ID, action (create/update/delete/publish)
- Changes (JSON diff)
- User ID, IP address, timestamp

**Collections With Hook:** All collections (mandatory audit trail)  
**Example:** When user updates PageSections, automatically log the change

---

## Services (Optional)

### services/emailService.ts (80 lines - if exists)
**Purpose:** Email sending service  
**Methods:**
- sendContactForm()
- sendPrivacyRequest()
- sendNotification()

**Uses:** EmailSettings collection for SMTP config  
**Example:** Send confirmation email after form submission

---

## Summary Table

| Type | Count | Total Lines | Purpose |
|------|-------|-------------|---------|
| Collections | 18 | ~1,800 | Data storage & schema |
| Globals | 2 | ~280 | Global configuration |
| Lib | 4 | ~280 | Utilities & helpers |
| Hooks | 1 | ~50 | Lifecycle events |
| Config | 1 | ~70 | CMS configuration |
| Docs | 3 | ~1,000 | Documentation |
| **Total** | **29** | **~3,500** | Complete CMS codebase |

---

## How to Find Code

### By Feature

| I want to... | Look in... |
|--------------|-----------|
| Add new page section type | collections/PageSections.ts |
| Add new solution | Admin UI or solutions.ts schema |
| Add new regulatory framework | Admin UI or regulatory-compliance.ts |
| Change hero content | globals/Settings.ts |
| Audit user actions | collections/AuditLogs.ts, hooks/auditLog.ts |
| Check user permissions | lib/rbac/roles.ts |
| Validate form data | lib/validation/schemas.ts |
| Configure emails | collections/EmailSettings.ts |

### By Layer

| Layer | Files |
|-------|-------|
| Database Schema | collections/* |
| Global Config | globals/* |
| Business Logic | lib/* |
| Events | hooks/* |
| Configuration | payload.config.ts |

---

## File Dependencies

```
payload.config.ts
  ├─ collections/PageSections
  ├─ collections/Solutions
  ├─ collections/RegulatoryCompliance
  ├─ collections/Users
  ├─ collections/AuditLogs
  ├─ ... (all 18 collections)
  ├─ globals/Settings
  ├─ globals/TrustCenter
  └─ Payload CMS core

Each Collection
  ├─ May import: lib/rbac/roles
  ├─ May import: lib/validation/schemas
  └─ May trigger: hooks/auditLog

Hooks
  └─ May write to: collections/AuditLogs
```

---

## Next Steps

1. **Read:** START HERE: README.md (overview)
2. **Explore:** CODE_STRUCTURE.md (visual guide)
3. **Reference:** FILE_INDEX.md (this file, detailed reference)
4. **Check:** payload.config.ts (see how it connects)
5. **Dive:** Open specific collection files (understand schema)
6. **Modify:** Use admin UI to create/edit content
7. **Query:** Use API endpoints to fetch data

---

**Tip:** Use Ctrl+F to search for specific words in this file, or search for file names in your IDE's file explorer to quickly navigate to what you need.
