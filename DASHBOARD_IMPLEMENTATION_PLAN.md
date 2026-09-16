# QRS Dashboard UI Integration Plan

## Current State Analysis

**Existing Components:**
- ✅ Custom admin components in `frontend/components/admin/`
- ✅ DataTable, Badge, Button, Input, StatusChip, KPICard
- ✅ Tailwind CSS configured
- ✅ DESIGN.md color system (ink/teal palette)
- ✅ Payload CMS backend with 18 collections

**UI Library Status:**
- ❌ NextUI not yet integrated
- ✅ Faceless-ui for modals
- ✅ Lucide React for icons (assumed)

---

## Integration Strategy

### Option 1: Hybrid Approach (RECOMMENDED)
- Keep existing custom components
- Import NextUI dashboard structure/patterns
- Adapt NextUI components to use Tailwind + DESIGN.md tokens
- Reuse existing admin components where possible

### Option 2: Full NextUI Replacement
- Add NextUI to dependencies
- Replace all admin components with NextUI
- Higher complexity, breaking changes

### Option 3: NextUI Parallel
- Create new dashboard alongside existing CMS admin
- Separate routes
- More work, but safer

---

## Proposed Architecture

### Routes
```
/cms/admin                    → Current collection management (keep)
/dashboard                    → New NextUI-based dashboard
  ├── /dashboard/overview     → KPI cards, charts, activity
  ├── /dashboard/portfolios   → Portfolio management
  ├── /dashboard/runs         → Model run history
  ├── /dashboard/verification → Seal/verification status
  └── /dashboard/users        → User & roles (admin only)
```

### Component Structure
```
frontend/components/
├── admin/                    (existing - keep)
├── dashboard/                (NEW)
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   ├── DashboardCard.tsx
│   ├── DataTable.tsx
│   ├── MetricCard.tsx
│   ├── StatusBadge.tsx
│   ├── ChartContainer.tsx
│   ├── EmptyState.tsx
│   └── (other dashboard components)
└── layout/
    └── DashboardLayout.tsx   (NEW - wraps dashboard pages)
```

### Services Layer
```
frontend/services/
├── payload/                  (NEW)
│   ├── client.ts             (Payload API client)
│   ├── users.ts              (User operations)
│   ├── portfolios.ts         (Portfolio operations)
│   ├── runs.ts               (Model run operations)
│   └── analytics.ts          (Dashboard metrics)
└── auth.ts                   (Authentication helpers)
```

---

## Design System Mapping

### Colors (from DESIGN.md)
```
--color-ink-900: #0C0D0E      → bg-ink-900
--color-ink-800: #1B3B3A      → bg-ink-800
--color-ink-700: #1f2124      → bg-ink-700
--color-teal-500: #5BBAB5     → accent, buttons
--color-cream-50: #F4F6F6     → light backgrounds
--color-white: #FFFFFF        → text on dark
```

### Typography (from DESIGN.md)
```
font-display: Outfit
font-body: Poppins
font-mono: JetBrains Mono

h1: 2.5rem (40px)
h2: 2rem (32px)
h3: 1.5rem (24px)
body: 1rem (16px)
small: 0.875rem (14px)
```

### Spacing
```
4px unit scale
space-2: 8px
space-4: 16px
space-6: 24px
space-8: 32px
```

---

## Implementation Phases

### Phase 1: Dashboard Shell
- Create `/dashboard` layout and page structure
- Sidebar component with navigation
- Header with user menu
- Apply QRS color scheme
- No data yet (static mockups)

### Phase 2: Design System Application
- Adapt NextUI dashboard components to DESIGN.md
- Replace default colors with ink/teal palette
- Update typography to QRS fonts
- Fix spacing and border radius
- Ensure accessibility (contrast, focus states)

### Phase 3: Payload Integration
- Create Payload service layer
- Fetch users from Payload
- Fetch portfolio data (mock if collection doesn't exist)
- Fetch analytics/metrics
- Implement error states and loading states

### Phase 4: Collections & Data
- Determine which Payload collections map to dashboard
- Update services to fetch real data
- Wire up tables and cards to actual data
- Implement filters and search

### Phase 5: Real-time & Polish
- Add status change animations
- Implement polling for updates (if needed)
- Add empty states
- Test responsive design
- Performance optimization

### Phase 6: QA
- Cross-browser testing
- Responsive testing (mobile, tablet, desktop)
- Accessibility audit
- Performance profiling
- User feedback

---

## Collections to Expose

From existing Payload setup:

| Collection | Dashboard Section | Fields to Display |
|---|---|---|
| Users | Users & Roles | email, fullname, role, isActive, createdAt |
| AuditLogs | Activity / Audit | user, action, collectionName, timestamp |
| FormSubmissions | Form Submissions | formType, email, submittedAt, status |
| Media | Media Library | filename, filesize, createdAt |
| PageSections | Content Management | title, sectionType, order |

**Missing collections (may need to create):**
- Portfolios (if not exists)
- ModelRuns (if not exists)
- Verifications/Seals (if not exists)

---

## Payload API Endpoints to Use

```
GET /api/payload/users
GET /api/payload/users?limit=50&page=1
GET /api/payload/audit-logs?limit=100&page=1
GET /api/payload/form-submissions?limit=50
GET /api/payload/media?limit=30
GET /api/payload/page-sections

POST /api/payload/users (admin only)
PUT /api/payload/users/[id] (admin only)
DELETE /api/payload/users/[id] (admin only)
```

---

## Questions to Ask During Implementation

1. **Dashboard Data:**
   - What should the overview dashboard show? (KPIs, charts, metrics?)
   - Do you have Portfolio and ModelRun collections or should I create them?
   - What constitutes a "successful" run?

2. **Authentication:**
   - Should dashboard be accessible to all authenticated users or admin only?
   - Different permission levels per dashboard section?

3. **Real-time Updates:**
   - Should model run status update automatically?
   - Polling interval preference (5s, 10s, 30s)?

4. **Charts & Visualization:**
   - Which charting library? (Recharts - already used, Chart.js, etc?)
   - What metrics to display?

5. **Responsiveness:**
   - Mobile support required?
   - Tablet layout needed?

---

## Dependencies to Add

```json
{
  "recharts": "^2.x",           // Charts (if not exists)
  "react-icons": "^4.x",        // Icon library (fallback)
  "clsx": "^1.x",               // Class name utility
  "date-fns": "^2.x"            // Date formatting
}
```

**No NextUI dependency needed if using existing Tailwind approach.**

---

## File Summary (to be created)

**New Pages:**
- `frontend/app/(frontend)/dashboard/page.tsx`
- `frontend/app/(frontend)/dashboard/overview/page.tsx`
- `frontend/app/(frontend)/dashboard/portfolios/page.tsx`
- `frontend/app/(frontend)/dashboard/runs/page.tsx`
- `frontend/app/(frontend)/dashboard/verification/page.tsx`
- `frontend/app/(frontend)/dashboard/users/page.tsx`

**New Components:**
- `frontend/components/dashboard/DashboardLayout.tsx`
- `frontend/components/dashboard/Sidebar.tsx`
- `frontend/components/dashboard/Header.tsx`
- `frontend/components/dashboard/DashboardCard.tsx`
- `frontend/components/dashboard/MetricCard.tsx`
- `frontend/components/dashboard/ChartContainer.tsx`
- `frontend/components/dashboard/DataTable.tsx`
- `frontend/components/dashboard/StatusBadge.tsx`
- `frontend/components/dashboard/UserMenu.tsx`

**New Services:**
- `frontend/services/payload/client.ts`
- `frontend/services/payload/users.ts`
- `frontend/services/payload/portfolios.ts`
- `frontend/services/payload/runs.ts`
- `frontend/services/payload/analytics.ts`

**New Hooks:**
- `frontend/hooks/usePayloadData.ts` (generic data fetching)
- `frontend/hooks/useDashboard.ts` (dashboard-specific logic)

---

## Next Steps

1. ✅ Present this plan to user
2. ⏳ Get answers to questions above
3. ⏳ Start Phase 1 implementation (shell)
4. ⏳ Progress through phases 2-6

---

*Status: Plan Ready for Review*
*Ready to proceed? Answer the questions above when ready.*
