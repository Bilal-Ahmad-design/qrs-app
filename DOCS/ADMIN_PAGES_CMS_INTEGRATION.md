# Admin Pages - Payload CMS Integration

**Date:** August 22, 2026  
**Status:** ✅ All admin pages now fetch live data from Payload CMS  
**Pages Updated:** 4 (Content, Submissions, Users, Logs)

---

## Architecture Overview

Each admin page follows a **Server Component + Client Component** pattern:

1. **Server Component** (page.tsx) - Fetches data from Payload CMS
2. **Client Component** (*-client.tsx) - Handles interactivity and UI rendering

### Why This Pattern?

- **Server fetch:** Reduces waterfall delay, ensures data is fresh on page load
- **Client component:** Enables tabs, filters, search, and other interactive features
- **No loading spinner:** Data is already available before hydration
- **Type safety:** TypeScript interfaces for all CMS data shapes

---

## Pages & Their Data Sources

### 1. Content Page (`/admin/content`)

**Server Component:** `frontend/app/admin/content/page.tsx`  
**Client Component:** `frontend/app/admin/content/content-client.tsx`

**Data Fetched:**
- Pages collection (admin pages, not marketing pages)
- Blog posts collection
- Media files collection

**Features:**
- Tabbed interface (Pages | Blog | Media)
- Item count per tab
- Status badges (published/draft)
- Author/creator information
- Last modified timestamp
- Empty state when no items exist

**API Endpoints:**
```
GET /api/pages
GET /api/blog
GET /api/media
```

**Data Transformation:**
- Normalizes different field names (e.g., `filename` for media, `title` for pages)
- Handles author object vs. string
- Formats dates relative to today
- Shows "Draft" when status is missing

---

### 2. Submissions Page (`/admin/submissions`)

**Server Component:** `frontend/app/admin/submissions/page.tsx`  
**Client Component:** `frontend/app/admin/submissions/submissions-client.tsx`

**Data Fetched:**
- FormSubmissions collection
- Sorted by creation date (newest first)

**Features:**
- Left sidebar with status filters (All, New, Reviewed, Resolved)
- Search across name, email, form type
- Badge showing count of new submissions
- Row selection/highlighting
- Status color coding:
  - 🔵 New = teal
  - 🟡 Reviewed = yellow
  - ✅ Resolved = green

**API Endpoints:**
```
GET /api/form-submissions?limit=100&sort=-createdAt
```

**Data Transformation:**
- Displays `formType` or `type` field
- Handles assignee as object or string
- Shows "Unassigned" when no assignee
- Calculates relative submitted date

---

### 3. Logs Page (`/admin/logs`)

**Server Component:** `frontend/app/admin/logs/page.tsx`  
**Client Component:** `frontend/app/admin/logs/logs-client.tsx`

**Data Fetched:**
- AuditLogs collection
- Sorted by creation date (newest first)

**Features:**
- Dense, compact table design
- Expandable rows showing before/after JSON diffs
- Color-coded actions:
  - 🟢 CREATE = green-400
  - 🟡 UPDATE = yellow-400
  - 🔴 DELETE = red-400
- Search across actor, action, collection, resource
- Copy JSON button for expanded entries
- Monospace timestamps

**API Endpoints:**
```
GET /api/audit-logs?limit=100&sort=-createdAt
```

**Data Transformation:**
- Normalizes timestamp field (handles both `timestamp` and `createdAt`)
- Formats date as ISO string (YYYY-MM-DD HH:MM)
- Uppercases action names
- Displays before/after as formatted JSON

---

### 4. Users Page (`/admin/users`)

**Server Component:** `frontend/app/admin/users/page.tsx`  
**Client Component:** `frontend/app/admin/users/users-client.tsx`

**Data Fetched:**
- Users collection
- Sorted by creation date (newest first)

**Features:**
- User count in header
- Role badges with teal styling
- Status indicator (active = green, inactive = grey)
- Last login time (relative: "2 min ago", "3 hours ago", etc.)
- "Invite user" button for adding new users
- Empty state when no users

**API Endpoints:**
```
GET /api/users?limit=100&sort=-createdAt
```

**Data Transformation:**
- Falls back to email prefix if name is missing
- Formats role names (removes hyphens/underscores)
- Calculates relative last login time
- Shows "Never" if no last login recorded

---

## CMS Fetch Utility

**Location:** `frontend/lib/cms-fetch.ts`

**New Functions Added:**

```typescript
// Fetch all pages (not published filter - for admin view)
export async function getAdminPages(limit = 100): Promise<any[]>

// Fetch blog posts (all, not just published)
export async function getBlogPosts(limit = 100): Promise<any[]>

// Fetch media files
export async function getMediaFiles(limit = 100): Promise<any[]>

// Fetch form submissions (newest first)
export async function getFormSubmissions(limit = 100): Promise<any[]>

// Fetch audit logs (newest first)
export async function getAuditLogs(limit = 100): Promise<any[]>

// Fetch users
export async function getAdminUsers(limit = 100): Promise<any[]>
```

**Cache Strategy:**
- **Admin pages:** 5-minute ISR (revalidate: 300)
- **Content & Users:** 5-minute ISR
- **Submissions & Logs:** No cache (revalidate: 0) - always fresh

**Error Handling:**
- Returns empty array on fetch failure
- Logs warnings to console
- Graceful degradation with "No items found" message

---

## Data Structure Examples

### Page Object (from `/api/pages`)
```typescript
{
  id: 'page-1',
  title: 'Home',
  slug: 'home',
  status: 'published',
  createdAt: '2026-08-20T10:00:00Z',
  updatedAt: '2026-08-22T14:32:15Z',
  author?: { email: 'editor@example.com' } | 'admin@example.com'
}
```

### Blog Post Object (from `/api/blog`)
```typescript
{
  id: 'blog-1',
  title: 'Security Best Practices',
  status: 'published',
  createdAt: '2026-08-21T09:00:00Z',
  updatedAt: '2026-08-22T13:45:22Z',
  author?: string | { email: string }
}
```

### Submission Object (from `/api/form-submissions`)
```typescript
{
  id: 'submission-1',
  formType: 'contact',
  name: 'Sarah Chen',
  email: 'sarah@company.com',
  status: 'new',
  assignee?: null | string | { email: string },
  createdAt: '2026-08-22T14:00:00Z'
}
```

### Audit Log Object (from `/api/audit-logs`)
```typescript
{
  id: 'log-1',
  actor: 'admin@example.com',
  action: 'update',
  collection: 'Pages',
  resource: 'Homepage',
  timestamp: '2026-08-22T14:32:15Z',
  before?: { title: 'Home', published: false },
  after?: { title: 'Home', published: true }
}
```

### User Object (from `/api/users`)
```typescript
{
  id: 'user-1',
  name: 'Jane Smith',
  email: 'jane@example.com',
  role: 'editor',
  status: 'active',
  createdAt: '2026-08-01T00:00:00Z',
  lastLoginAt?: '2026-08-22T15:30:00Z'
}
```

---

## Testing the Integration

### 1. Ensure Payload CMS is Running
```bash
# Terminal 1: Start Payload CMS
cd frontend
npm run cms

# Or if you have a unified dev script:
npm run dev
```

### 2. Verify API Endpoints
```bash
# Check if endpoints are responding
curl http://localhost:3000/api/pages
curl http://localhost:3000/api/blog
curl http://localhost:3000/api/media
curl http://localhost:3000/api/form-submissions
curl http://localhost:3000/api/audit-logs
curl http://localhost:3000/api/users
```

### 3. Add Test Data
1. Go to Payload CMS at `http://localhost:3000/admin`
2. Create test entries in each collection
3. Navigate to `/admin/content`, `/admin/submissions`, etc.
4. Verify data appears in tables

### 4. Expected Behaviors

- **Content page:** Tabs update counts as you add/remove items
- **Submissions page:** New submissions appear immediately (no cache)
- **Logs page:** Recent actions appear in audit log
- **Users page:** New users show with roles and last login time
- **Search/Filter:** Works in real-time against fetched data
- **Empty states:** Show when collections are empty

---

## Known Limitations & Future Improvements

### Current State
✅ Server-side data fetching (fast page loads)  
✅ Real-time search and filtering (client-side)  
✅ Automatic content count display  
✅ Relative timestamps and last login calculation  
✅ Error handling and graceful degradation  

### Future Enhancements
- [ ] Pagination (for large result sets)
- [ ] Infinite scroll
- [ ] Bulk actions (delete, status update)
- [ ] Inline editing (edit without opening modal)
- [ ] CSV export
- [ ] Advanced filters (date range, status, author)
- [ ] Real-time updates (WebSocket/polling)
- [ ] Action buttons (Edit, Delete, etc.)
- [ ] Confirmation dialogs for destructive actions
- [ ] Success/error toast notifications

---

## File Structure

```
frontend/
├── app/admin/
│   ├── content/
│   │   ├── page.tsx (server component, fetches CMS)
│   │   └── content-client.tsx (client component, renders UI)
│   ├── submissions/
│   │   ├── page.tsx (server component)
│   │   └── submissions-client.tsx (client component)
│   ├── logs/
│   │   ├── page.tsx (server component)
│   │   └── logs-client.tsx (client component)
│   ├── users/
│   │   ├── page.tsx (server component)
│   │   └── users-client.tsx (client component)
│   ├── settings/
│   │   └── page.tsx (client component - configuration only)
│   └── layout.tsx (admin shell with navigation)
└── lib/
    └── cms-fetch.ts (CMS API client with new admin functions)
```

---

## Summary

All admin pages are now **fully dynamic** and pull real data from Payload CMS:

✅ **Content Management** - Live Pages, Blog, Media counts  
✅ **Submissions** - Real form submissions with status filtering  
✅ **Logs** - Audit trail of all system changes  
✅ **Users** - User roster with roles and activity  
✅ **Settings** - Configuration management (no CMS fetch needed)

Data refreshes:
- **Content/Users:** Every 5 minutes (ISR cache)
- **Submissions/Logs:** Immediately (no cache)

All pages handle empty states, errors, and data transformations gracefully.

**Status:** Production-ready for testing and use.
