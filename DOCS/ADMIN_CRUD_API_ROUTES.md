# Admin CRUD API Routes - Implementation Guide

**Date:** August 22, 2026  
**Status:** Ready to implement Payload CMS integration  

---

## Overview

All admin pages now have working CRUD UI:
- ✅ Edit modals for all collections
- ✅ Create functionality (Users)
- ✅ Delete confirmations
- ✅ Copy/export utilities (Logs)

The API calls are commented out and ready to be uncommented when you have Payload CMS set up.

---

## API Routes to Create

### 1. Content Management (Pages, Blog, Media)

**File:** `frontend/app/api/content/[collection]/[id]/route.ts`

```typescript
// PATCH /api/content/pages/123
// PATCH /api/content/blog/123
// PATCH /api/content/media/123
export async function PATCH(req: Request) {
  const { collection, id } = req.params
  const data = await req.json()

  // TODO: Call Payload CMS
  // const response = await fetch(
  //   `http://localhost:3000/api/${collection}/${id}`,
  //   {
  //     method: 'PATCH',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data),
  //   }
  // )

  return Response.json({ success: true })
}
```

---

### 2. Form Submissions

**File:** `frontend/app/api/form-submissions/[id]/route.ts`

```typescript
// PATCH /api/form-submissions/123
export async function PATCH(req: Request) {
  const { id } = req.params
  const data = await req.json()

  // TODO: Call Payload CMS
  // const response = await fetch(
  //   `http://localhost:3000/api/form-submissions/${id}`,
  //   {
  //     method: 'PATCH',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data),
  //   }
  // )

  return Response.json({ success: true })
}

// DELETE /api/form-submissions/123
export async function DELETE(req: Request) {
  const { id } = req.params

  // TODO: Call Payload CMS
  // const response = await fetch(
  //   `http://localhost:3000/api/form-submissions/${id}`,
  //   { method: 'DELETE' }
  // )

  return Response.json({ success: true })
}
```

---

### 3. Users Management

**File:** `frontend/app/api/users/route.ts`

```typescript
// POST /api/users (Create new user)
export async function POST(req: Request) {
  const data = await req.json()

  // TODO: Call Payload CMS
  // const response = await fetch(
  //   'http://localhost:3000/api/users',
  //   {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data),
  //   }
  // )

  return Response.json({ success: true })
}
```

**File:** `frontend/app/api/users/[id]/route.ts`

```typescript
// PATCH /api/users/123 (Update user)
export async function PATCH(req: Request) {
  const { id } = req.params
  const data = await req.json()

  // TODO: Call Payload CMS
  // const response = await fetch(
  //   `http://localhost:3000/api/users/${id}`,
  //   {
  //     method: 'PATCH',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(data),
  //   }
  // )

  return Response.json({ success: true })
}

// DELETE /api/users/123 (Delete user)
export async function DELETE(req: Request) {
  const { id } = req.params

  // TODO: Call Payload CMS
  // const response = await fetch(
  //   `http://localhost:3000/api/users/${id}`,
  //   { method: 'DELETE' }
  // )

  return Response.json({ success: true })
}
```

---

### 4. Audit Logs (Export Only)

**File:** `frontend/app/api/audit-logs/export/route.ts`

```typescript
// GET /api/audit-logs/export (Export as CSV)
export async function GET(req: Request) {
  // TODO: Call Payload CMS
  // const response = await fetch(
  //   'http://localhost:3000/api/audit-logs?limit=1000',
  //   {
  //     headers: { 'Accept': 'application/json' },
  //   }
  // )
  // const logs = await response.json()

  // Convert to CSV and return
  const csv = 'Actor,Action,Collection,Resource,Timestamp\n'

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="audit-logs.csv"',
    },
  })
}
```

---

## How to Enable API Integration

### Step 1: Uncomment API Calls

In each admin page, find the `handleSave` and `handleDelete` functions and uncomment the Payload CMS API calls:

**Content page** - `frontend/app/admin/content/page.tsx`:
```typescript
const handleSave = async (data: Record<string, any>) => {
  try {
    // UNCOMMENT THIS:
    const response = await fetch(`/api/content/${activeTab}/${editingItem?.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error('Failed to save')
```

### Step 2: Create API Routes

Create the API route files listed above in `frontend/app/api/`.

### Step 3: Test in Browser

1. Click "Edit" on any item
2. Modify the fields
3. Click "Save Changes"
4. API call will be made to your route
5. Success message appears

---

## Full Example: Implement Users API

Here's a complete example to implement the Users CRUD:

**File:** `frontend/app/api/users/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

interface User {
  name: string
  email: string
  role: string
  status: string
}

export async function POST(req: NextRequest) {
  try {
    const data: User = await req.json()

    // Validate
    if (!data.email || !data.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Call Payload CMS
    const response = await fetch(
      'http://localhost:3000/api/users',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Payload API error: ${response.statusText}`)
    }

    const user = await response.json()
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
```

**File:** `frontend/app/api/users/[id]/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await req.json()

    const response = await fetch(
      `http://localhost:3000/api/users/${id}`,
      {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      throw new Error(`Payload API error: ${response.statusText}`)
    }

    const user = await response.json()
    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const response = await fetch(
      `http://localhost:3000/api/users/${id}`,
      { method: 'DELETE' }
    )

    if (!response.ok) {
      throw new Error(`Payload API error: ${response.statusText}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Current Features (No API Needed Yet)

All pages work with mock data and local state management:

✅ **Content Page**
- Click "Edit" to modify title, status, author
- Changes update UI immediately
- Ready for API integration

✅ **Submissions Page**
- Click "Edit" to change status, assignee
- Click "Delete" with confirmation dialog
- Real-time list updates

✅ **Users Page**
- Click "Invite user" to create new user
- Click "Edit" to modify user details
- Click "Delete" with confirmation
- Supports all role types

✅ **Logs Page**
- Click rows to expand before/after JSON
- Click "Copy JSON" to copy to clipboard
- Click "Export CSV" to download audit trail
- Search across all fields

---

## Error Handling

All forms include:
- ✅ Loading state (disabled buttons, spinners)
- ✅ Success message (2-second notification)
- ✅ Error message (displays error text)
- ✅ Cancel button (closes modal)
- ✅ Delete confirmation (prevents accidental deletion)

---

## Next Steps

1. **Create the API routes** using the examples above
2. **Uncomment the API calls** in each admin page
3. **Test in development** (http://localhost:3001/admin)
4. **Monitor browser console** for API errors
5. **Verify changes** in Payload CMS admin panel

---

## File Structure

```
frontend/
├── app/admin/
│   ├── content/page.tsx (with edit modal)
│   ├── submissions/page.tsx (with edit + delete)
│   ├── users/page.tsx (with create + edit + delete)
│   ├── logs/page.tsx (with export CSV)
│   └── layout.tsx
├── app/api/
│   ├── content/[collection]/[id]/route.ts (TODO)
│   ├── form-submissions/[id]/route.ts (TODO)
│   ├── users/route.ts (TODO: POST)
│   ├── users/[id]/route.ts (TODO: PATCH + DELETE)
│   └── audit-logs/export/route.ts (TODO)
└── components/admin/
    ├── EditModal.tsx (reusable modal component)
    ├── Button.tsx
    ├── Input.tsx
    └── StatusChip.tsx
```

---

## Summary

All admin pages now have **fully functional CRUD UI** with:
- ✅ Edit modals with form validation
- ✅ Create functionality
- ✅ Delete confirmations
- ✅ Loading and error states
- ✅ Success notifications
- ✅ Export/copy utilities

**Ready to integrate** with Payload CMS by:
1. Creating the API routes
2. Uncommenting the fetch calls
3. Testing in browser

**Status:** Production-ready UI, awaiting backend API implementation.
