# QRS CMS Phase 2: End-to-End Testing Checklist

**Objective:** Verify all operations work with real Payload data, not mocks.

---

## TEST A: DASHBOARD LOADS WITH REAL DATA

**URL:** `http://localhost:3000/cms/admin`

- [ ] Page redirects to `/cms/dashboard`
- [ ] Dashboard loads without errors
- [ ] Welcome message shows logged-in user
- [ ] All 4 KPI cards load:
  - [ ] Total Users (should be > 0 if users exist)
  - [ ] Published Pages (should be > 0 if pages exist)
  - [ ] Page Sections (should be > 0 if sections exist)
  - [ ] Form Submissions (should be > 0 if submissions exist)
- [ ] Recent CMS Activity shows audit logs (if any exist)
- [ ] System status shows "Operational"
- [ ] Database shows "Connected"

**Expected:** Real numbers, not hardcoded values.

---

## TEST B: NAVIGATE TO PAGES COLLECTION

**URL:** `http://localhost:3000/cms/collections/pages`

- [ ] Page loads
- [ ] Title shows "Pages"
- [ ] Table displays existing pages (if any)
- [ ] "+ Add New" button visible
- [ ] "← Back" button works

**Expected:** Actual page records from Payload, not empty form.

---

## TEST C: CREATE NEW PAGE

**Action:** Click "+ Add New" → Fill form → Save

- [ ] Form appears with input fields
- [ ] All fields are accessible (title, slug, content, etc.)
- [ ] Can enter data in all fields
- [ ] "Save" button works
- [ ] Page saves without errors
- [ ] New item appears in table
- [ ] Table count increments

**Expected:** Actual database INSERT via Payload.

---

## TEST D: VERIFY AUDIT LOG CREATED

**URL:** `http://localhost:3000/cms/dashboard/audit-logs`

**Action:** After creating page (TEST C), check audit logs

- [ ] New audit log entry appears
- [ ] Action shows "CREATE"
- [ ] Collection shows "pages"
- [ ] User email is correct
- [ ] Timestamp is recent (within last minute)

**Expected:** Real audit entry in PostgreSQL via Payload hooks.

---

## TEST E: EDIT CREATED PAGE

**Action:** Click "Edit" on the newly created page

- [ ] Edit form opens with existing data
- [ ] Data matches what was created
- [ ] Can modify fields
- [ ] "Save" button works
- [ ] Page updates in table
- [ ] Changes persist (refresh page, data still there)

**Expected:** Actual database UPDATE via Payload.

---

## TEST F: VERIFY UPDATE AUDIT LOG

**URL:** `http://localhost:3000/cms/dashboard/audit-logs`

**Action:** After editing page (TEST E), check audit logs

- [ ] New audit log entry appears
- [ ] Action shows "UPDATE"
- [ ] Collection shows "pages"
- [ ] User email is correct
- [ ] Entry is newer than CREATE entry

**Expected:** Real UPDATE entry in audit logs.

---

## TEST G: DELETE CREATED PAGE

**Action:** Click "Delete" on the page → Confirm deletion

- [ ] Confirmation dialog appears
- [ ] Deletion executes
- [ ] Item removed from table
- [ ] Table count decrements

**Expected:** Actual database DELETE via Payload.

---

## TEST H: VERIFY DELETE AUDIT LOG

**URL:** `http://localhost:3000/cms/dashboard/audit-logs`

**Action:** After deleting page (TEST G), check audit logs

- [ ] New audit log entry appears
- [ ] Action shows "DELETE"
- [ ] Collection shows "pages"
- [ ] Entry is most recent

**Expected:** Real DELETE entry in audit logs.

---

## TEST I: TEST PAGE SECTIONS COLLECTION

**URL:** `http://localhost:3000/cms/collections/page-sections`

**Action:** Repeat TEST C-H for page sections

- [ ] Can create section
- [ ] Audit log shows CREATE
- [ ] Can edit section
- [ ] Audit log shows UPDATE
- [ ] Can delete section
- [ ] Audit log shows DELETE

**Expected:** Same workflow as Pages collection.

---

## TEST J: TEST USERS COLLECTION

**URL:** `http://localhost:3000/cms/collections/users`

- [ ] Table shows existing users
- [ ] User count matches dashboard metric
- [ ] Can view user data
- [ ] Status shows (active/inactive)

**Expected:** Real user list from Payload.

---

## TEST K: TEST PAGINATION

**URL:** `http://localhost:3000/cms/collections/pages` (if > 50 items)

- [ ] "Previous" button disabled on page 1
- [ ] "Next" button works to go to page 2
- [ ] Page indicator updates
- [ ] Different items shown on page 2
- [ ] Can navigate back to page 1

**Expected:** Pagination works correctly.

---

## TEST L: TEST ERROR HANDLING

**Actions:**
1. Try creating item with no data → Should show error
2. Disconnect database → Collection should show error message
3. Reconnect database → Page should recover

- [ ] Error messages are clear
- [ ] No crashes or 500 errors
- [ ] Can retry after error

**Expected:** Graceful error handling.

---

## TEST M: TEST SEARCH/FILTER (If implemented)

**URL:** `http://localhost:3000/cms/collections/pages`

- [ ] Search field works (if present)
- [ ] Filters narrow results (if present)
- [ ] Can clear filters

**Expected:** Search/filter work correctly.

---

## TEST N: TEST SIDEBAR NAVIGATION

**Action:** Click different items in sidebar

- [ ] Overview → `/cms/dashboard`
- [ ] Analytics → `/cms/dashboard/analytics`
- [ ] Pages → `/cms/collections/pages`
- [ ] Page Sections → `/cms/collections/page-sections`
- [ ] Blog → `/cms/collections/blog`
- [ ] Solutions → `/cms/collections/solutions`
- [ ] Media → `/cms/collections/media`
- [ ] Users → `/cms/dashboard/users`
- [ ] Audit Logs → `/cms/dashboard/audit-logs`
- [ ] Form Submissions → `/cms/dashboard/submissions`
- [ ] Redirects → `/cms/collections/redirects`

**Expected:** All links work correctly.

---

## TEST O: TEST FRONTEND SYNC (CMS → WEBSITE)

**Setup:**
- Open website in one window: `http://localhost:3000/`
- Open CMS in another window: `http://localhost:3000/cms/dashboard`

**Action:** 
1. Create/edit content in CMS
2. Refresh website
3. Check if updated content appears

**Expected:** Website shows new/updated content from CMS.

---

## TEST P: TEST RESPONSIVE DESIGN

**Widths to test:**
- [ ] 1440px (Desktop)
- [ ] 1024px (Tablet)
- [ ] 768px (Tablet)
- [ ] 390px (Mobile)

**Check:**
- [ ] Sidebar works (collapse on mobile)
- [ ] Tables are readable
- [ ] Buttons are clickable
- [ ] Forms are usable
- [ ] No horizontal scrolling on page level

**Expected:** Responsive design works on all widths.

---

## TEST Q: TEST LOGOUT & REAUTH

**Action:**
1. Click logout
2. Try to access `/cms/dashboard` directly
3. Should redirect to `/cms/login`
4. Login again
5. Should access dashboard

**Expected:** Session management works correctly.

---

## TEST R: TEST ROLE-BASED ACCESS (If implemented)

**Setup:** Create multiple users with different roles

**Test each role:**
- [ ] Super Admin - Can access everything
- [ ] Admin - Can access content/forms/users
- [ ] Editor - Can only edit content
- [ ] Viewer - Read-only access

**Expected:** Role permissions enforced.

---

## SUMMARY TABLE

| Test | Status | Notes |
|------|--------|-------|
| A: Dashboard Loads | ⬜ | |
| B: Navigate Collections | ⬜ | |
| C: Create Item | ⬜ | |
| D: Audit Create | ⬜ | |
| E: Edit Item | ⬜ | |
| F: Audit Update | ⬜ | |
| G: Delete Item | ⬜ | |
| H: Audit Delete | ⬜ | |
| I: Test Sections | ⬜ | |
| J: Test Users | ⬜ | |
| K: Pagination | ⬜ | |
| L: Error Handling | ⬜ | |
| M: Search/Filter | ⬜ | |
| N: Sidebar Nav | ⬜ | |
| O: Frontend Sync | ⬜ | |
| P: Responsive | ⬜ | |
| Q: Auth/Logout | ⬜ | |
| R: RBAC | ⬜ | |

**Success Criteria:** All tests ✅

---

## CRITICAL VALIDATION

These must work for production readiness:

1. **No Mock Data** - All displayed numbers are from Payload
2. **Audit Trail** - Every operation creates an entry
3. **Real-Time** - CMS changes appear on website without restart
4. **No Direct DB** - All operations go through Payload
5. **Access Control** - Payload enforces permissions
6. **Error Handling** - No crashes, graceful errors
7. **Data Consistency** - No lost updates
8. **Responsive** - Works on all screen sizes

