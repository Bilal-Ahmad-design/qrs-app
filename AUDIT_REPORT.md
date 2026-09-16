# QRS Payload CMS + Dashboard Audit Report

**Date:** 2026-09-16  
**Status:** IN PROGRESS

## 1. ARCHITECTURE OVERVIEW

**CURRENT STATE: Single Next.js 16 deployment**
- Payload CMS embedded
- PostgreSQL database
- Custom Next.js dashboard UI at `/cms/dashboard`
- Frontend site at root `/`

## 2. CRITICAL ISSUES FOUND

### 🔴 CRITICAL: Direct Database Access Bypasses Payload

**File:** `/api/db-crud/route.ts`

**Problem:**
- Direct PostgreSQL access via `pg` Pool
- Bypasses Payload's access controls
- Bypasses Payload's validation
- Bypasses Payload's hooks (audit logging, etc.)
- Operates without RBAC enforcement

**Impact:**
- Audit logs not created for db-crud operations
- No validation of data
- No permission checking
- Security vulnerability

**Required Fix:**
- Remove `/api/db-crud` endpoint
- Replace all usage with Payload REST API via `/api/payload/[...slug]`

---

## 3. CURRENT IMPLEMENTATION STATUS

### Dashboard Pages
- ✅ `/cms/dashboard` - Overview page (EXISTS)
- ✅ `/cms/dashboard/analytics` - Analytics (EXISTS, mock data)
- ✅ `/cms/dashboard/users` - User listing (fetching from /api/payload/users)
- ✅ `/cms/dashboard/audit-logs` - Audit logs (fetching from /api/payload/audit-logs)
- ✅ `/cms/dashboard/submissions` - Form submissions (fetching from /api/payload/form-submissions)

### Sidebar Navigation
**INCOMPLETE:** Only 5 items configured
- Missing: Pages, PageSections, Blog, Media, Solutions, etc.

### Collections (in Payload)
**DEFINED BUT NOT WIRED TO UI:**
- Users
- Pages
- PageSections
- Blog
- Media
- Solutions
- RegulatoryCompliance
- PlatformCapability
- Documentation
- ProductShowcase
- FormSubmissions
- AuditLogs
- Redirects
- ValidationReports
- PerilStatus
- EmailSettings
- EmailLogs
- FormEntries

### Globals (in Payload)
**DEFINED BUT NOT WIRED TO UI:**
- Settings
- Navigation
- Homepage
- TrustCenter

---

## 4. MOCK DATA PROBLEMS

### Dashboard Overview (`DashboardOverview.tsx`)
All metrics use mock data:
- ❌ "Total Visitors" - hardcoded
- ❌ "Page Views" - hardcoded
- ❌ "Form Submissions" - should be real count
- ❌ "CMS Users" - should be real count from Users collection
- ❌ "Content Updates" - should be real count from AuditLogs
- ❌ "Active Now" - not relevant for CMS

**Should replace with:**
- FormSubmissions count from Payload
- Users count from Payload
- Recent AuditLogs entries
- Content statistics

---

## 5. COLLECTION MANAGEMENT ROUTE

**Path:** `/cms/collections/[slug]/page.tsx`

**Status:** EXISTS but uses db-crud (problematic)

**Issue:** Uses `/api/db-crud` instead of `/api/payload/` proxy

**Should be rewritten to:**
- Use `/api/payload/[collection]` endpoints
- Support proper Payload operations
- Enforce Payload permissions
- Create audit logs

---

## 6. AUTHENTICATION & SESSION

**Current:**
- `/cms/login` exists
- localStorage used for session storage
- Middleware checks for payload-session cookie

**Issue:** localStorage alone is not a security boundary
- Middleware must verify server-side
- Session must be validated via Payload API

---

## 7. API ENDPOINTS STATUS

### Working
- ✅ `/api/payload/[...slug]` - Proxy to Payload (with health checks)
- ✅ `/api/health` - Health check endpoint
- ✅ `/api/auth/login`, `/api/auth/logout`, `/api/auth/me`

### Problematic
- ❌ `/api/db-crud` - Bypasses Payload access controls
- ❌ `/api/cms-auth/login` - Duplicate auth system

### Partially Working
- ⚠️ `/api/payload/users` - Works but needs RBAC enforcement
- ⚠️ `/api/payload/audit-logs` - Works but needs filtering

---

## 8. MEDIA MANAGEMENT

**Status:** No Media management UI in dashboard

**Required:**
- Media upload handler
- Media gallery view
- Media selection for PageSections
- Production URL generation

---

## 9. PAGE SECTIONS & PAGE ASSEMBLY

**Status:** No UI for managing relationship between Pages and PageSections

**Required:**
- Add sections to page
- Reorder sections
- Remove sections
- Configure section data

---

## 10. MISSING DASHBOARD SECTIONS

### Content Management
- [ ] Pages management
- [ ] PageSections management
- [ ] Blog management
- [ ] Media library
- [ ] Solutions management
- [ ] Product Showcase
- [ ] Regulatory Compliance
- [ ] Documentation
- [ ] Platform Capabilities

### Administration
- [ ] Settings management (global)
- [ ] Navigation management (global)
- [ ] Homepage settings (global)
- [ ] Trust Center settings (global)
- [ ] Email Settings
- [ ] Email Logs
- [ ] Redirect management
- [ ] Validation Reports
- [ ] Peril Status

---

## 11. RBAC & PERMISSIONS

**Status:** Defined in Payload but not enforced in dashboard UI

**Roles defined:**
- SUPER_ADMIN
- ADMIN
- EDITOR
- VIEWER
- REVIEWER
- MANAGER

**Issue:** Dashboard doesn't check roles before showing options

**Required:**
- Show/hide UI elements based on user role
- Enforce permissions server-side on all Payload operations

---

## 12. FORM SUBMISSIONS

**Status:** View-only working

**Missing:**
- Form entry details view
- Reply/followup functionality

---

## 13. REVALIDATION & FRONTEND SYNC

**Status:** Unknown

**Question:** When admin updates a PageSections, does frontend immediately reflect the change?

**Requirement:**
- Test CMS → Frontend update flow
- Verify revalidation works

---

## 14. BUILD STATUS

**Last build:** ✅ SUCCESS (npm run build)

---

## SUMMARY: WHAT NEEDS TO BE DONE

### IMMEDIATE (Critical)
1. Remove `/api/db-crud` endpoint
2. Replace all db-crud usage with Payload API
3. Update `/cms/collections/[slug]` to use Payload API

### HIGH PRIORITY
1. Expand sidebar navigation with all collections
2. Create dynamic collection management pages
3. Replace mock dashboard metrics with real Payload data
4. Add Pages/PageSections management UI
5. Add Media management UI
6. Add Globals (Settings, Navigation, etc.) management

### MEDIUM PRIORITY
1. Implement RBAC enforcement in dashboard UI
2. Verify frontend sync (CMS → Website)
3. Add remaining collection UIs
4. Email settings/logs handling

### LOW PRIORITY
1. Analytics enhancements
2. Advanced filtering/search
3. Bulk operations

---

## IMPLEMENTATION PLAN

**Phase 1:** Fix architecture (remove db-crud, use Payload API)
**Phase 2:** Build collection management framework
**Phase 3:** Wire up all collections to UI
**Phase 4:** Add Globals management
**Phase 5:** Test end-to-end workflows
**Phase 6:** Verify production readiness

