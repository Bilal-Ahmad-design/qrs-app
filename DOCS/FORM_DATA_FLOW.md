# Form Data Flow - Complete Architecture

**Last Updated:** 2026-08-08

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (localhost:3000)                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User fills SupportForm component                            │
│     ├── Name input field                                        │
│     ├── Email input field                                       │
│     ├── Message textarea                                        │
│     └── Turnstile CAPTCHA widget                               │
│                                                                   │
│  2. User clicks "Submit Request" button                         │
│     ├── Form validation (client-side)                           │
│     ├── Check Turnstile token received                          │
│     └── POST request sent to /api/contact                       │
│                                                                   │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │   NETWORK REQUEST   │
                    ├─────────────────────┤
                    │ POST /api/contact   │
                    │ Content-Type: JSON  │
                    │ Body: {             │
                    │   name: string      │
                    │   email: string     │
                    │   message: string   │
                    │   turnstileToken    │
                    │ }                   │
                    └──────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                API ROUTE HANDLER                                 │
│            (frontend/app/api/contact/route.ts)                  │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│ POST Handler receives request                                     │
│   ├─ Parse JSON body                                             │
│   ├─ Trim & validate email & message                            │
│   ├─ Extract IP address from headers                            │
│   ├─ Verify Turnstile token with Cloudflare API               │
│   │   └─ If verification fails: return error 400               │
│   │                                                              │
│   └─ Build submission data object:                             │
│       {                                                          │
│         form_type: 'contact',                                  │
│         data: {                                                │
│           name: "User Name",                                  │
│           message: "User's message",                          │
│           source: 'support-page'                             │
│         },                                                     │
│         email: "user@example.com",                           │
│         ip_address: "192.168.1.100",                         │
│         turnstile_verified: true,                            │
│         review_status: 'pending'                             │
│       }                                                        │
│                                                                │
└──────────────────────────────┬─────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  DATABASE INSERT    │
                    └─────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│              POSTGRESQL DATABASE (Neon)                          │
│           via CONNECTION POOL (process.env.DATABASE_URL)        │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│ Table: form_submissions                                          │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Column              │ Type       │ Value                    │  │
│ ├─────────────────────┼────────────┼────────────────────────┤  │
│ │ id                  │ uuid       │ auto-generated         │  │
│ │ form_type           │ text       │ 'contact'              │  │
│ │ data                │ jsonb      │ {name, message, ...}   │  │
│ │ email               │ text       │ user@example.com       │  │
│ │ ip_address          │ inet       │ 192.168.1.100          │  │
│ │ turnstile_verified  │ boolean    │ true                   │  │
│ │ review_status       │ text       │ 'pending'              │  │
│ │ created_at          │ timestamp  │ NOW()                  │  │
│ │ reviewed_at         │ timestamp  │ null                   │  │
│ │ reviewed_by         │ uuid       │ null                   │  │
│ └────────────────────────────────────────────────────────────┘  │
│                                                                    │
│ ✓ Data stored (encrypted at rest by Postgres)                   │
│ ✓ Only Admin/Super Admin can query this table (SOC2 D3)        │
│                                                                    │
└──────────────────────────────┬──────────────────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  RESPONSE SENT      │
                    ├─────────────────────┤
                    │ HTTP 200 OK         │
                    │ {                   │
                    │   success: true,    │
                    │   message: "Thanks" │
                    │ }                   │
                    └─────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│              FRONTEND - USER SEES SUCCESS                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│ ✓ Form clears                                                    │
│ ✓ Success message displays                                       │
│ ✓ User can submit another request                               │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Request/Response Cycle

### **STEP 1: Frontend Form Component**
```typescript
// File: frontend/components/marketing/SupportForm.tsx
// Client-side React component (runs in browser)

function SupportForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [turnstileToken, setTurnstileToken] = useState('');

  async function handleSubmit(event) {
    // 1. Validate Turnstile CAPTCHA
    if (!turnstileToken) {
      return error('Please complete security check');
    }

    // 2. Send form data to backend API
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formState.name,
        email: formState.email,
        message: formState.message,
        turnstileToken: turnstileToken
      })
    });

    const result = await response.json();
    if (result.success) {
      // Show success message
      setStatus('success');
      setFormState({ name: '', email: '', message: '' });
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={formState.name} onChange={...} />
      <input name="email" type="email" value={formState.email} onChange={...} />
      <textarea name="message" value={formState.message} onChange={...} />
      <div id="support-turnstile" /> {/* Cloudflare widget */}
      <button type="submit">Submit Request</button>
    </form>
  );
}
```

### **STEP 2: API Handler**
```typescript
// File: frontend/app/api/contact/route.ts
// Runs on Next.js backend (server-side)

import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export async function POST(request: Request) {
  try {
    // 1. Parse request body
    const body = await request.json();
    const { name, email, message, turnstileToken } = body;

    // 2. Validate inputs
    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: 'Email and message are required.' },
        { status: 400 }
      );
    }

    // 3. Verify Turnstile CAPTCHA with Cloudflare
    const verified = await verifyTurnstileToken(turnstileToken);
    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Security verification failed.' },
        { status: 400 }
      );
    }

    // 4. Extract IP address (for tracking)
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';

    // 5. Prepare data for database
    const submissionData = {
      name,
      message,
      source: 'support-page'
    };

    // 6. INSERT data into PostgreSQL database
    await pool.query(
      `INSERT INTO form_submissions 
       (form_type, data, email, ip_address, turnstile_verified, review_status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        'contact',                           // form_type
        JSON.stringify(submissionData),      // data (JSONB)
        email,                               // email
        ipAddress,                           // ip_address
        true,                                // turnstile_verified
        'pending'                            // review_status
      ]
    );

    // 7. Return success response to frontend
    return NextResponse.json({
      success: true,
      message: 'Your support request has been received. We will respond shortly.'
    });

  } catch (error) {
    console.error('Contact form submission failed:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to save your message right now.' },
      { status: 500 }
    );
  }
}
```

### **STEP 3: Database Storage**
```sql
-- Database: PostgreSQL (Neon)
-- Connection: process.env.DATABASE_URL

-- Table schema
CREATE TABLE form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  form_type text NOT NULL,                    -- 'contact', 'privacy-request'
  data jsonb NOT NULL,                        -- {name, message, source}
  email text NOT NULL,                        -- user@example.com
  ip_address inet,                            -- 192.168.1.100
  turnstile_verified boolean DEFAULT false,   -- Cloudflare CAPTCHA status
  review_status text DEFAULT 'pending',       -- 'pending', 'reviewed', 'resolved'
  created_at timestamp DEFAULT NOW(),         -- Auto timestamp
  reviewed_at timestamp,                      -- When admin reviewed
  reviewed_by uuid,                           -- Which admin reviewed
  notes text                                  -- Admin notes
);

-- Example row after user submits contact form:
INSERT INTO form_submissions VALUES (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'contact',
  '{"name":"John Doe","message":"I have a question...","source":"support-page"}',
  'john@example.com',
  '192.168.1.100',
  true,
  'pending',
  '2026-08-08 10:30:00',
  NULL,
  NULL,
  NULL
);
```

---

## 📍 Form Locations & Types

| Form | Location | API Route | Database Type | Notes |
|------|----------|-----------|---------------|-------|
| **Support/Contact** | `/contact` page | `/api/contact` | `contact` | Main support form |
| **Privacy Request** | `/privacy-request` page | `/api/privacy-request` | `privacy-request` | GDPR/DSR requests |

Both forms follow the SAME pattern:
1. Frontend collects data
2. Sends to API route
3. API validates + verifies Turnstile
4. API inserts to database
5. Returns response to frontend

---

## 🔐 Security Implementation

### **Turnstile CAPTCHA** (Cloudflare)
```typescript
// File: frontend/lib/turnstile.ts

export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export async function verifyTurnstileToken(token: string) {
  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET,    // Backend secret key
      response: token                            // Token from browser
    })
  });

  const data = await response.json();
  return data.success;  // true if CAPTCHA passed
}
```

### **Database Encryption**
- PostgreSQL encrypts data at rest
- JSONB column stores sensitive data (name, message)
- Access controlled via Payload CMS roles
- Only Admin/Super Admin can view submissions

---

## 🔌 Environment Variables Required

```bash
# For API to work, need these in .env.local:

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET=1x0000000000000000000000000000000AA

# Optional: Email integration (not yet implemented)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=noreply@qrsrisk.com
SMTP_PASS=***
```

---

## 📊 Database Table Fields Explained

| Field | Type | Purpose | Example |
|-------|------|---------|---------|
| `id` | UUID | Primary key | `a1b2c3d4-...` |
| `form_type` | text | Which form submitted | `'contact'` or `'privacy-request'` |
| `data` | JSONB | Structured form data | `{"name":"John","message":"..."}` |
| `email` | text | Submitter email | `john@example.com` |
| `ip_address` | inet | Source IP (tracking/security) | `192.168.1.100` |
| `turnstile_verified` | bool | CAPTCHA passed | `true` |
| `review_status` | text | Admin status | `'pending'` → `'reviewed'` |
| `created_at` | timestamp | Submission time | `2026-08-08 10:30:00` |
| `reviewed_at` | timestamp | When admin reviewed | `2026-08-08 14:00:00` |
| `reviewed_by` | UUID | Which admin reviewed | (admin user UUID) |
| `notes` | text | Admin comments | `"Responded to user"` |

---

## 🚀 Viewing Submissions Locally

### **Option 1: Using Payload CMS (if configured)**
```
http://localhost:3001/admin
→ Navigate to form_submissions collection
→ See all submitted forms with filters
```

### **Option 2: Direct Database Query**
```bash
# Connect to Neon PostgreSQL
psql $DATABASE_URL

# View all contact form submissions
SELECT id, email, data, created_at, review_status 
FROM form_submissions 
WHERE form_type = 'contact'
ORDER BY created_at DESC;

# View specific submission
SELECT * FROM form_submissions 
WHERE id = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890';

# Count submissions
SELECT form_type, COUNT(*) as count
FROM form_submissions
GROUP BY form_type;
```

### **Option 3: Logging API**
```bash
# Add to route.ts to see submissions in console
console.log('Form submission:', {
  email,
  name,
  message,
  ipAddress,
  timestamp: new Date()
});
```

---

## 📧 Email Flow (Not Yet Implemented)

Currently, forms DON'T send emails, but data IS saved to database.

To enable email notifications, add to API route:

```typescript
// Example: Send email on form submission
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Option 1: Email to admin
await transporter.sendMail({
  from: 'noreply@qrsrisk.com',
  to: 'support@qrsrisk.com',
  subject: 'New Contact Form Submission',
  html: `<p>From: ${email}</p><p>${message}</p>`
});

// Option 2: Email to user (confirmation)
await transporter.sendMail({
  from: 'noreply@qrsrisk.com',
  to: email,
  subject: 'We received your request',
  html: 'We will respond within 24 hours...'
});
```

---

## ✅ Complete Flow Checklist

```
User fills form
  ↓ [Client validation]
  ├─ Check name not empty
  ├─ Check email format
  ├─ Check message not empty
  └─ Check Turnstile CAPTCHA completed

Click Submit
  ↓ [Network]
  → POST /api/contact
  → Header: Content-Type: application/json
  → Body: {name, email, message, turnstileToken}

Backend processes
  ↓ [API Route Handler]
  ├─ Parse JSON
  ├─ Trim & validate
  ├─ Verify Turnstile with Cloudflare API
  ├─ Extract IP address
  └─ Build submission object

Insert to database
  ↓ [PostgreSQL INSERT]
  → form_submissions table
  → 11 fields populated
  → Data encrypted at rest

Return response
  ↓ [HTTP 200 OK]
  → {success: true, message: "..."}

Frontend shows success
  ↓ [User experience]
  ├─ Form clears
  ├─ Success message shows
  ├─ User can submit again
  └─ ✓ Complete
```

---

**Summary:** Data flows from browser → API route → PostgreSQL database, with Cloudflare CAPTCHA verification for security.

