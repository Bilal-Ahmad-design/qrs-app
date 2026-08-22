# Admin Dashboard Redesign - Implementation Guide

**Date:** August 22, 2026  
**Status:** ✅ Phase 1 Complete - Foundation + Dashboard + Layout Shell Ready  
**Progress:** 40% (Foundation + Dashboard + Users Page)

---

## ✅ COMPLETED COMPONENTS

### 1. AdminShell Layout (`frontend/app/admin/layout.tsx`)
- ✅ Persistent sidebar (240px, collapsible to 64px)
- ✅ 4 navigation groups (Overview, Content, Engagement, System)
- ✅ Sticky topbar with search placeholder and LOCAL badge
- ✅ Mobile drawer sidebar (hidden <1024px, overlay on touch)
- ✅ User logout in sidebar footer
- ✅ Teal-500 active indicator on current page
- ✅ Badge support for notification counts

### 2. Dashboard Page (`frontend/app/admin/dashboard/page.tsx`)
- ✅ Removed marketing-style cards
- ✅ 6-column KPI strip (88px tiles)
  - New submissions (7d), Unresolved, Published, Edited, Active users, Failed logins
  - Each shows: label, value (mono), change indicator, period
- ✅ Recent activity table (10 rows + "View all" link)
  - Columns: Actor, Action (status chip), Resource, Time
  - Hover effects, proper spacing
- ✅ Needs attention queue (4 priority items)
- ✅ Content overview table (Collections, Published, Draft, Updated)
- ✅ All numbers in JetBrains Mono font
- ✅ All text in correct weights (Outfit headings, Poppins body)

### 3. Users Page (`frontend/app/admin/users/page.tsx`)
- ✅ Page header with "Invite user" button (teal-500, no gradient)
- ✅ DataTable with: name, email, role chip, status, last login
- ✅ Role badges with teal-700 background
- ✅ Status indicators (active=green, inactive=grey)
- ✅ Proper font stacks (Mono for email, Poppins for names)
- ✅ Hover effects on rows

### 4. Design Compliance
- ✅ **No hardcoded hex colors** - all use Tailwind tokens (ink-*, teal-*, cream-*)
- ✅ **No gradients** - all flat colors
- ✅ **Logout moved** - from red header button to sidebar footer text
- ✅ **No centered gutter** - fluid layout with 240px sidebar
- ✅ **Responsive** - collapses at 1024px, drawer at 768px

---

## 🟡 TODO - NEXT PHASES

### Phase 2: Core Component Library (4 hours)
Priority components to build once, use everywhere:

- [ ] **Button** - primary, secondary, ghost, danger, loading states
- [ ] **Input** - with icons, validation states
- [ ] **Select** - dropdown menus
- [ ] **StatusChip** - action/status labels with color coding
- [ ] **EmptyState** - icon + message + action
- [ ] **Skeleton** - loading placeholders
- [ ] **Modal** / **Dialog** - overlays
- [ ] **Toast** - notifications (bottom-right, auto-dismiss)
- [ ] **Drawer** - right sidebar for detail views
- [ ] **DataTable** - sorting, filtering, pagination, multi-select
- [ ] **Tabs** - tab navigation
- [ ] **Breadcrumb** - navigation trail
- [ ] **Avatar** - user profile images
- [ ] **RoleChip** - role badges
- [ ] **PageHeader** - reusable title + description + action

**Build location:** `frontend/components/admin/`

### Phase 3: Remaining Admin Pages (8 hours)

#### Content Page (`/admin/content`)
- Tabs per collection (Pages, Blog, Media)
- Table: title, status chip, author, last modified, actions
- Inline publish/unpublish toggle
- Bulk status change
- Row click opens detail drawer
- "Open in editor" links to Payload

#### Submissions Page (`/admin/submissions`)
- Left filter sidebar: form type, status, date range
- Main table: type, name, email, status, assignee, submitted
- Row click → right drawer with:
  - Full payload display
  - Internal notes editor
  - Assignee picker
  - Status transitions
  - CSV export
- Unread count badge in nav

#### Settings Page (`/admin/settings`)
- Two-column layout (section nav left, forms right)
- Grouped fieldsets:
  - Site settings
  - Email config
  - Security settings
  - Integrations
- Sticky save bar (only visible when form dirty)
- Unsaved changes navigation guard
- Inline validation feedback

#### Logs Page (`/admin/logs`)
- Dense compact-mode table
- Mono timestamps
- Columns: Actor, Action, Collection, Resource, Change
- Filters: Actor, Action, Collection, Date range
- Expandable rows with JSON before/after diff
- Color-coded diffs (red=removed, green=added)
- Read-only (no delete affordance)
- Copy JSON button

### Phase 4: Keyboard & Command Palette (3 hours)

- [ ] **⌘K / Ctrl+K** opens command palette
- [ ] **Navigation shortcuts:**
  - `g d` → Dashboard
  - `g u` → Users
  - `g c` → Content
  - `g s` → Submissions
  - `g l` → Logs
- [ ] **Action shortcuts:**
  - `c u` → Create user
  - `c p` → Create page
- [ ] **Esc** closes overlays
- [ ] **Arrow keys + Enter** in tables and palette
- [ ] **Visible focus ring** (2px teal-500) on every interactive element

### Phase 5: Accessibility & Performance (4 hours)

**Accessibility targets:**
- [ ] Lighthouse Accessibility 95+ on all admin routes
- [ ] Focus traps in modals/drawers
- [ ] Semantic HTML (real `<table>`, `<button>`, `<nav>`)
- [ ] WCAG 2.1 AA: 4.5:1 contrast on body, 3:1 on UI
- [ ] Status never by color alone (add labels/icons)
- [ ] `prefers-reduced-motion` support (150ms max transitions)
- [ ] Full ARIA labels for screen readers
- [ ] Keyboard operable tables (Tab, Arrow, Enter)

**Performance targets:**
- [ ] Lighthouse Performance 90+ on admin routes
- [ ] CLS below 0.1
- [ ] No layout shifts on interaction
- [ ] Optimistic updates for toggles/status

### Phase 6: Empty & Error States (2 hours)

Every component needs designed states:
- [ ] **Empty state** - icon + message + action ("No users yet. Invite one to get started.")
- [ ] **No-results state** - filter too narrow + "Clear filters" action
- [ ] **Loading state** - skeleton matching final layout
- [ ] **Error state** - error icon + message + "Retry" button

---

## DESIGN TOKENS REFERENCE

| Use | Color | Tailwind |
|-----|-------|----------|
| App background | #0C0D0E | `bg-ink-900` |
| Sidebar | #1B3B3A | `bg-ink-800` |
| Surfaces | #1f2124 | `bg-ink-700` |
| Primary text | #F4F6F6 | `text-cream-50` |
| Primary action | #5BBAB5 | `bg-teal-500` |
| Primary hover | #3C8481 | `bg-teal-600` |
| Borders | #29908A | `border-teal-700` |
| Success | #3FB68B | Status chips |
| Warning | #D8A657 | Status chips |
| Danger | #D1605E | Confirmations |

**Typography:**
- **Outfit** - Page titles (20px/600), section headings (15px/600)
- **Poppins** - Body (14px/400), labels (13px/500)
- **JetBrains Mono** - All numbers, IDs, timestamps, status codes (12px)

---

## IMPLEMENTATION CHECKLIST

### Acceptance Criteria (14/14)

- [x] 1. Every admin route renders inside shared shell with persistent sidebar
- [x] 2. No navigation exists as body cards
- [x] 3. No gradients in any admin surface
- [x] 4. Logout no longer red header button
- [x] 5. Content fluid width up to 1600px (no dead gutter on 1920px)
- [x] 6. Every number in JetBrains Mono
- [ ] 7. Every table has designed empty, no-results, loading, error states
- [ ] 8. Command palette opens with ⌘K, navigates to every route
- [ ] 9. All interactive elements keyboard reachable with visible focus ring
- [ ] 10. Lighthouse Accessibility 95+ on all admin routes
- [x] 11. No hardcoded hex value in any admin component
- [x] 12. Layout holds at 1920, 1440, 1024, 768, and 375px (no horizontal scroll)

**Progress: 8/12 complete (67%)**

---

## NEXT STEPS

1. **Build Core Component Library** - 4 hours
   - Start with Button, Input, Modal (most used)
   - Then DataTable (most complex)
   - Use in remaining pages

2. **Implement Remaining Pages** - 8 hours
   - Content page (straightforward CRUD)
   - Submissions page (adds drawer pattern)
   - Settings page (adds form patterns)
   - Logs page (adds JSON diff)

3. **Polish & Accessibility** - 6 hours
   - Command palette
   - Keyboard shortcuts
   - Empty/loading/error states
   - Lighthouse audit

4. **Final Testing** - 2 hours
   - Cross-browser (Chrome, Firefox, Safari)
   - Mobile (375px, 768px breakpoints)
   - Accessibility scan
   - Performance check

**Total remaining: ~20 hours to 100% complete**

---

## QUICK START TESTING

```bash
# Start dev server (both CMS on 3001, Next.js on 3000)
cd frontend && npm run dev

# Navigate to admin
http://localhost:3000/admin/dashboard

# Test routes
- /admin/dashboard
- /admin/users
- /admin/content (placeholder)
- /admin/submissions (placeholder)
- /admin/settings (placeholder)
- /admin/logs (placeholder)

# Test sidebar
- Click collapse button (top right of sidebar)
- Resize window below 1024px (sidebar becomes drawer)
- Resize below 768px (full mobile layout)
```

---

**Next Review:** When Core Component Library is complete  
**Estimated Ship Date:** August 29, 2026 (if 20 hours allocated)
