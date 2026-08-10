# Email Management System Setup Guide

**Date:** 2026-08-08  
**Status:** Ready to Implement

---

## 📊 Complete Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    PAYLOAD CMS ADMIN                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📧 SETTINGS TAB (New)                                          │
│  ├─ SMTP Configuration                                         │
│  │  ├─ Host, Port, User, Password                             │
│  │  ├─ TLS/SSL Settings                                       │
│  │  └─ Test Connection Button                                 │
│  │                                                              │
│  ├─ Email Receiving                                           │
│  │  ├─ Contact Form Email                                    │
│  │  ├─ Privacy Request Email                                │
│  │  └─ Support Email                                         │
│  │                                                              │
│  └─ Email Sending Templates                                   │
│     ├─ Contact Confirmation Template                         │
│     └─ Privacy Confirmation Template                         │
│                                                                  │
│  📋 FORM ENTRIES (New Collection)                             │
│  ├─ All form submissions in one place                         │
│  ├─ Sub-sections:                                             │
│  │  ├─ Form Data (name, message, etc.)                      │
│  │  ├─ Email Status (admin sent, confirmation sent)        │
│  │  ├─ Review Status (pending, reviewed, responded)        │
│  │  └─ Security Info (IP, CAPTCHA, date)                   │
│  │                                                              │
│  └─ Admin Notes & Response Tracking                           │
│                                                                  │
│  ✉️ EMAIL LOGS (New Collection)                              │
│  ├─ Track every sent email                                    │
│  ├─ Status: Sent, Failed, Bounced                            │
│  ├─ Retry tracking                                            │
│  └─ Error messages                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 New Collections Created

### 1. **EmailSettings Collection**
**File:** `qrs-cms/collections/EmailSettings.ts`

Manages SMTP configuration with 3 collapsible sections:

```
┌─ SMTP Server Settings
│  ├─ Host (e.g., smtp.gmail.com)
│  ├─ Port (587 for TLS, 465 for SSL)
│  ├─ Username
│  ├─ Password
│  └─ TLS/SSL Toggle
│
├─ Email Receiving Settings
│  ├─ Contact Form Recipient Email
│  ├─ Privacy Request Recipient Email
│  ├─ Support Email Address
│  └─ Sender Display Name
│
└─ Email Sending Settings
   ├─ Send Contact Confirmation (Toggle)
   ├─ Confirmation Template
   ├─ Send Privacy Confirmation (Toggle)
   └─ Privacy Confirmation Template
```

**Usage:** Super Admin only
**Access:** Read by all authenticated users

---

### 2. **FormEntries Collection**
**File:** `qrs-cms/collections/FormEntries.ts`

Central repository for ALL form submissions with 4 collapsible sections:

```
┌─ Form Data
│  ├─ Email Address
│  ├─ Form Type (Contact / Privacy Request)
│  ├─ Submitter Name
│  └─ Message Content
│
├─ Email Status
│  ├─ Admin Notification Sent? (Y/N)
│  ├─ Admin Email Status (Pending/Sent/Failed)
│  ├─ User Confirmation Sent? (Y/N)
│  ├─ Confirmation Email Status
│  └─ Email Errors (if any)
│
├─ Review & Response
│  ├─ Review Status (Pending/Reviewing/Responded/Needs Info/Spam)
│  ├─ Reviewed By (Admin user)
│  ├─ Reviewed At (timestamp)
│  ├─ Admin Notes (free text)
│  └─ Response Sent to User (free text)
│
└─ Security & Metadata
   ├─ IP Address
   ├─ Turnstile CAPTCHA Verified?
   ├─ Submitted At
   └─ User Agent
```

**Automatic Fields:** Created by API (read-only for admins)
**Admin Editable:** Review Status, Admin Notes, Response Text

---

### 3. **EmailLogs Collection**
**File:** `qrs-cms/collections/EmailLogs.ts`

Audit trail of every email sent (auto-created by system):

```
├─ Recipient Email
├─ Sender Email
├─ Subject
├─ Email Type (Form Submission / Confirmation / Privacy Request)
├─ Body Preview
├─ Status (Pending / Sent / Failed / Bounced)
├─ Error Message (if failed)
├─ Sent At (timestamp)
├─ Retry Attempts (count)
└─ Next Retry At (timestamp)
```

**Auto-Created:** By API when emails are sent
**Read-Only:** Audit purposes only

---

## 📧 Email Service

**File:** `qrs-cms/services/emailService.ts`

Handles all email sending with:
- SMTP connection pooling
- Template rendering
- Error handling & retry logic
- Email logging

**Methods:**
```typescript
emailService.initializeTransporter(settings)
  // Initialize SMTP with settings from CMS

emailService.testConnection()
  // Verify SMTP credentials work

emailService.sendContactFormNotification(email, name, message, data)
  // Send to admin + user confirmation

emailService.sendPrivacyRequestNotification(email, name, type, details)
  // Send to privacy team
```

---

## 🔌 Integration Steps

### Step 1: Install Dependencies
```bash
npm install nodemailer
npm install --save-dev @types/nodemailer
```

### Step 2: Update API Routes

**Update:** `frontend/app/api/contact/route.ts`

```typescript
import { emailService } from '@/services/emailService'

export async function POST(request: Request) {
  // ... existing validation code ...

  // Get email settings from Payload
  const settings = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/email-settings`)
    .then(res => res.json())

  // Initialize email service
  await emailService.initializeTransporter(settings)

  // Send emails
  const emailResult = await emailService.sendContactFormNotification(
    email,
    name,
    message,
    submissionData
  )

  // Log email result
  if (!emailResult.success) {
    console.error('Email failed:', emailResult.error)
    // Still save form but log error
  }

  // Continue with existing form saving...
}
```

### Step 3: Add to Payload Config

Already done ✓ (Updated `payload.config.ts`)

Collections registered:
- `EmailSettings`
- `FormEntries`
- `EmailLogs`

### Step 4: Environment Variables

Add to `qrs-cms/.env.local`:
```bash
# Default SMTP (optional - can be set via CMS UI)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 💻 Admin UI Navigation

### Accessing Email Settings

```
Payload CMS Admin Panel (localhost:3001/admin)
  ↓
  Collections menu
  ↓
  📧 Email Settings
  ↓
  Click default configuration
  ↓
  3 Sections:
    • SMTP Server Settings
    • Email Receiving Settings
    • Email Sending Settings
  ↓
  Click "Save"
```

### Viewing Form Entries

```
Payload CMS Admin Panel
  ↓
  Collections menu
  ↓
  📋 Form Entries
  ↓
  Browse all submissions
  ↓
  Click entry to see:
    • Form Data
    • Email Status
    • Review Status
    • Security Info
  ↓
  Edit admin notes & response
```

### Checking Email Logs

```
Payload CMS Admin Panel
  ↓
  Collections menu
  ↓
  ✉️ Email Logs
  ↓
  See all sent emails:
    • Subject
    • Recipient
    • Status
    • Sent time
    • Error message (if failed)
```

---

## 🧪 Testing Locally

### 1. Start CMS
```bash
cd qrs-cms
npm run dev
# Access http://localhost:3001/admin
```

### 2. Configure SMTP
```
Email Settings → SMTP Server Settings
├─ Host: smtp.gmail.com (or your provider)
├─ Port: 587
├─ Username: your-email@gmail.com
├─ Password: app-specific-password
└─ TLS/SSL: ✓ enabled
```

**Gmail Setup:**
1. Enable 2FA on Google Account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in SMTP_PASSWORD field

### 3. Set Recipient Emails
```
Email Settings → Email Receiving Settings
├─ Contact Form: support@qrsrisk.com
├─ Privacy Request: privacy@qrsrisk.com
└─ Support Email: support@qrsrisk.com
```

### 4. Test Connection
```
Email Settings → Status & Testing
└─ (Click Test Connection button - will update testStatus field)
```

### 5. Submit Test Form
```
Browser: http://localhost:3000/contact
├─ Fill form fields
├─ Submit
└─ Check:
   • Form Entries collection shows new entry
   • Email Logs shows sent email entries
   • testStatus shows success/failure
```

---

## 🔐 Security Considerations

### Password Storage
- SMTP password stored in PostgreSQL
- Consider using AWS Secrets Manager for production
- Only Super Admin can view/edit

### Email Data Privacy
- All form submissions in database (encrypted at rest)
- Admin can add notes (for processing GDPR requests)
- Email logs kept for audit trail

### CAPTCHA Verification
- All emails only sent for CAPTCHA-verified submissions
- `turnstileVerified` field tracks this

---

## 📋 Next Steps (TODO)

### Immediate
- [ ] Install nodemailer dependency
- [ ] Update contact API route with email service
- [ ] Test SMTP connection
- [ ] Send test emails

### Phase 2 (Advanced Features)
- [ ] Email retry logic (failed emails retry after 1 hour, 3x max)
- [ ] Batch email sending for high-volume forms
- [ ] Email templates with HTML builder
- [ ] Webhook notifications on form submission
- [ ] Scheduled email digests (daily summary to admin)

### Phase 3 (Analytics)
- [ ] Email open/click tracking
- [ ] Bounce handling
- [ ] Unsubscribe management
- [ ] Email delivery reports

---

## 🛠️ File Structure

```
qrs-cms/
├── collections/
│   ├── EmailSettings.ts       ← NEW
│   ├── EmailLogs.ts           ← NEW
│   ├── FormEntries.ts         ← NEW
│   └── [existing collections]
│
├── services/
│   └── emailService.ts        ← NEW
│
└── payload.config.ts          ← UPDATED
    (added 3 collections)

frontend/
├── app/api/
│   └── contact/route.ts       ← TO UPDATE
        (add email sending)
└── [existing files]
```

---

## 📞 Support

### Common Issues

**SMTP Connection Failed**
→ Check credentials in Email Settings
→ Verify provider allows SMTP access
→ Check firewall/port 587 or 465 open

**Emails Not Sending**
→ Check Email Settings activated
→ Verify recipient emails configured
→ Check Email Logs for errors

**Gmail Specific**
→ Generate App Password (not account password)
→ Enable "Less secure app access" or use App Password

---

**Status:** Implementation Ready ✅  
**Created:** 2026-08-08  
**Version:** 1.0

