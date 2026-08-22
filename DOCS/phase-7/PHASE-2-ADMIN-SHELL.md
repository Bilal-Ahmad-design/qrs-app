# Phase 7 - Phase 2: Admin Shell Foundation

**Date:** 2026-08-22  
**Status:** 🚀 IN PROGRESS  
**Duration:** 2-3 days  
**Deliverable:** Role-aware admin dashboard with live Payload data, component primitives, real-time indicators

---

## Overview

Build the admin shell that connects to real Payload CMS data. Users see role-specific dashboards with live data from collections (Users, Pages, Blog, Media, etc.), and the UI responds to real-time changes via presence indicators and live updates.

---

## Architecture

### Data Flow

```
Payload CMS Collections
        ↓
   /api/payload/* routes (via cms-fetch.ts)
        ↓
Admin Pages (React Server Components)
        ↓
DataTable Component (renders with all 7 states)
        ↓
Browser Display (real-time presence dots, live counts)
```

### Component Hierarchy

```
AdminLayout (server + client)
├── Sidebar (role-filtered nav)
├── Topbar (user, presence dot, logout)
└── Page Routes
    ├── Dashboard (KPI cards, recent activity)
    ├── Users (DataTable + real data)
    ├── Pages (DataTable + real data)
    ├── Blog (DataTable + real data)
    ├── Media (DataTable + real data)
    ├── Submissions (DataTable + real data)
    └── etc.
```

---

## Files to Create/Modify

### New Components (UI Primitives)

| Component | Purpose | States |
|-----------|---------|--------|
| `components/admin/DataTable.tsx` | Reusable data table | loading, empty, no-results, error, offline, stale, conflict |
| `components/admin/KPICard.tsx` | Dashboard metric card | default, loading, error |
| `components/admin/Toast.tsx` | Notification toast | success, error, warning, info |
| `components/admin/Button.tsx` | Unified button component | default, loading, disabled, danger |
| `components/admin/Dialog.tsx` | Modal/confirmation dialog | default, loading, error |
| `components/admin/Spinner.tsx` | Loading spinner | pulse, bounce, spin |
| `components/admin/Badge.tsx` | Status badge | active, draft, published, etc. |

### Data Fetching

| File | Purpose |
|------|---------|
| `lib/admin/fetch-users.ts` | Fetch Users collection from Payload |
| `lib/admin/fetch-pages.ts` | Fetch Pages collection from Payload |
| `lib/admin/fetch-collections.ts` | Generic collection fetcher |
| `lib/admin/hooks/useRealtime.ts` | Hook for real-time updates (prep for Phase 4) |

### Updated Pages

| Page | Changes |
|------|---------|
| `app/admin/users/page.tsx` | Fetch real users, display in DataTable |
| `app/admin/content/pages/page.tsx` | Fetch real pages, display in DataTable |
| `app/admin/content/blog/page.tsx` | Fetch real blog posts, display in DataTable |
| `app/admin/dashboard/page.tsx` | Real KPI cards with live data |

### Navigation Update

| File | Changes |
|------|---------|
| `app/admin/layout.tsx` | Filter nav items by user role, hide restricted items |

---

## Acceptance Criteria

### Component Primitives
- [ ] DataTable renders all 7 states correctly
- [ ] Loading state shows skeleton matching final layout
- [ ] Empty state shows icon + action
- [ ] Error state shows message + retry
- [ ] No-results state shows filters + clear action
- [ ] Offline state shows banner, disables actions
- [ ] Stale state shows "updated N seconds ago" banner
- [ ] Conflict state shows side-by-side diff (Phase 3)

### Real Data
- [ ] Users page shows real Payload Users collection
- [ ] Pages page shows real Payload Pages collection
- [ ] Blog page shows real Payload Blog collection
- [ ] Media page shows real Payload Media collection
- [ ] Submission page shows real form submissions
- [ ] All pages sort/filter working
- [ ] Data refreshes on page load
- [ ] No mock data visible (except fallback for empty collections)

### Role-Based UI
- [ ] Super Admin sees all nav items
- [ ] Admin sees Content + Engagement + System (no Users for admin)
- [ ] Editor sees only Content + Dashboard
- [ ] Reviewer sees only Dashboard + Review queue
- [ ] Read-Only sees only Dashboard in collapsed view
- [ ] Restricted items completely removed from DOM (not disabled)

### Dashboard
- [ ] KPI tiles show real counts (submissions, pages, etc.)
- [ ] Recent activity shows real audit logs
- [ ] All numbers are live queries, not hardcoded
- [ ] Dashboard loads in under 2 seconds

### Performance & Polish
- [ ] Lighthouse Performance: 85+
- [ ] Lighthouse Accessibility: 95+
- [ ] Responsive at 375px, 768px, 1440px
- [ ] No horizontal scroll on any breakpoint
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus ring visible on all interactive elements

---

## Build Order

### Day 1: Component Primitives
1. Create DataTable with all 7 states
2. Create KPICard, Toast, Button, Badge components
3. Build Storybook demo page (optional)
4. Test all states visually

### Day 2: Data Fetching & Pages
1. Create collection fetch functions
2. Update Users page to fetch real data
3. Update Pages page to fetch real data
4. Update Dashboard with real KPIs
5. Add role-based nav filtering

### Day 3: Polish & Testing
1. Test all pages with different user roles
2. Verify data accuracy
3. Check responsive design
4. Lighthouse audit
5. Manual testing checklist

---

## Testing Checklist

**Before shipping Phase 2:**

### Super Admin (jordan@qrs.example.com)
- [ ] Can see all nav items
- [ ] Users page shows real users
- [ ] Pages page shows real pages
- [ ] Can edit/delete (UI visible, not functional yet)

### Admin (bilal@qrs.example.com)
- [ ] Can see Dashboard, Content, Engagement, System
- [ ] Users page shows real users
- [ ] Submissions page shows real data
- [ ] Cannot see restricted items

### Editor (editor@qrs.example.com)
- [ ] Can see only Dashboard and Content
- [ ] Can see Pages and Blog
- [ ] Cannot see Users or Submissions

### Accessibility
- [ ] All tables keyboard navigable
- [ ] Focus visible on all buttons
- [ ] Color not the only status indicator
- [ ] Lighthouse Accessibility 95+

### Performance
- [ ] Dashboard loads < 2s
- [ ] Data pages load < 1s
- [ ] No layout shift on data load (skeleton matches)
- [ ] Lighthouse Performance 85+

---

## Known Limitations (Will Fix Later)

1. **No CRUD yet** — Phase 3 will add create/update/delete
2. **No real-time updates** — Phase 4 adds SSE
3. **No publish workflow** — Phase 6 adds publish/schedule
4. **No search/filter** — Phase 5 adds advanced filtering
5. **No sorting UI** — Phase 5 adds column sort headers

---

## Rollback Plan

If Phase 2 breaks:
```bash
git revert HEAD
npm run dev
```

The revert will restore Phase 1 auth + working login. No data is lost.

---

## Next Phase (Phase 3)

After Phase 2 ships:
- Add CRUD operations (Create, Read, Update, Delete)
- Implement form validation
- Add success/error toasts
- Optimistic UI updates
- Conflict resolution UI

---

## References

- **Phase 1:** Cookie auth, dev users, login flow
- **Phase 4:** Real-time SSE, presence, soft locking
- **PRD:** Section 4 (Screen-by-Screen) for all page designs
- **Design System:** DESIGN.md (colors, fonts, spacing)
