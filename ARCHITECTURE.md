# QRS Project Architecture - Comprehensive Flow

**Version:** Phase 6 (Consolidated Single App)  
**Last Updated:** 2026-08-22  
**Status:** ✅ Frontend + CMS consolidated into unified Next.js app; Admin dashboard with authentication complete

---

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Client                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Next.js Frontend App (Port 3000)           │  │
│  │  - Public Marketing Pages (24 routes)                 │  │
│  │  - Authentication (Login/Signup)                      │  │
│  │  - Admin Dashboard (Protected)                        │  │
│  │  - Integrated Payload CMS Admin                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                    │                        │
│                          HTTP/HTTPS│                        │
│                                    ▼                        │
└─────────────────────────────────────────────────────────────┘
                                    │
                                    │
                    ┌───────────────┴────────────────┐
                    │                                │
                    ▼                                ▼
        ┌─────────────────────┐        ┌─────────────────────┐
        │  Next.js App Router │        │  Payload CMS REST   │
        │  (SSR/SSG)          │        │  API (Integrated)   │
        └──────────┬──────────┘        └────────┬────────────┘
                   │                           │
                   └───────────────┬───────────┘
                                   │
                                   ▼
                        ┌────────────────────┐
                        │  PostgreSQL (Neon) │
                        │  Shared Database   │
                        └────────────────────┘
```

---

## High-Level Architecture

```
qrs-app/ (Single Unified Next.js App)
├── frontend/              # Next.js 16.2.10 with App Router (React 19, Turbopack)
│   ├── app/              # All routes (public + authenticated)
│   ├── components/       # Reusable React components
│   ├── lib/              # Business logic, utilities, CMS client
│   ├── public/           # Static assets
│   ├── styles/           # Global CSS & Tailwind
│   └── [config files]    # next.config.js, tsconfig.json, etc
└── [docs & config]       # Project documentation

Key Features:
✅ Single deployment unit on Vercel
✅ Public marketing site (no auth)
✅ Protected admin dashboard (JWT auth)
✅ Integrated Payload CMS
✅ PostgreSQL shared database
✅ Comprehensive security & audit logging
```

---

## Complete Route Map

### Public Routes (No Authentication)

```
GET  /                              Homepage (marketing)
GET  /about                         About page
GET  /platform                      Platform capabilities
GET  /verify                        Built to be Verified
GET  /solutions                     Solutions by role
GET  /regulatory                    Regulatory compliance
GET  /trust                         Trust & Security
GET  /validation                    Validation reports
GET  /docs                          Documentation
GET  /security                      Security page
GET  /security/vdp                  Vulnerability Disclosure
GET  /privacy                       Privacy Policy
GET  /terms                         Terms of Service
GET  /cookies                       Cookie Policy
GET  /support                       Support page
GET  /contact                       Contact page
GET  /subprocessors                 Subprocessors list
GET  /.well-known/security.txt      Security metadata
GET  /robots.txt                    SEO robots
GET  /sitemap.xml                   Dynamic sitemap

POST /api/login                     User login (mock auth)
POST /api/signup                    User registration
POST /api/contact                   Contact form (rate-limited, Turnstile)
POST /api/privacy-request           Privacy request (rate-limited, Turnstile)
POST /api/webhooks/crm              CRM webhook (audit-logged)

POST /api/payload/[...slug]         Payload CMS proxy
```

### Protected Routes (Authentication Required)

```
GET  /login                         Login page
GET  /signup                        Signup page
GET  /admin/dashboard               Admin dashboard (protected)
GET  /admin/users                   User management
GET  /admin/content                 Content management
GET  /admin/settings                Settings page
GET  /admin/logs                    Activity logs
GET  /api/profile                   Get user profile (Bearer token required)
```

---

## Authentication Flow

### Login Flow

```
1. User visits http://localhost:3000/login
   │
   ├─ Browser loads LoginPage component ('use client')
   │  └─ Shows: QRS Admin logo, email/password fields with eye icon toggle, "Remember me" checkbox
   │
2. User enters credentials:
   │  ├─ Email: admin@example.com
   │  ├─ Password: password123 (can toggle visibility with eye icon)
   │  └─ Checks "Remember me" checkbox (optional)
   │
3. User clicks "Sign In"
   │
   ├─ Frontend: POST /api/login
   │   {
   │     "email": "admin@example.com",
   │     "password": "password123"
   │   }
   │
   ├─ Backend (/api/login/route.ts):
   │   ├─ Validates email & password format
   │   ├─ Mock auth: checks credentials against hardcoded credentials
   │   ├─ Generates JWT token: "mock-jwt-token-" + timestamp
   │   ├─ Returns:
   │   │  {
   │   │    "token": "mock-jwt-token-1724329600000",
   │   │    "user": {
   │   │      "id": "1",
   │   │      "email": "admin@example.com",
   │   │      "fullname": "Admin User",
   │   │      "role": "admin"
   │   │    }
   │   │  }
   │
   ├─ Frontend: Stores token in localStorage
   │   ├─ localStorage.setItem('payload-token', token)
   │   ├─ If "Remember me" checked:
   │   │   └─ localStorage.setItem('remembered-email', email)
   │   └─ Else: removes remembered-email
   │
   └─ Frontend: Redirects to /admin/dashboard
```

### Protected Page Access

```
1. User navigates to /admin/dashboard
   │
   ├─ Browser loads AdminDashboard component
   │
   ├─ useEffect runs:
   │   ├─ Checks: localStorage.getItem('payload-token')
   │   ├─ If not found: router.push('/login')
   │   ├─ If found: calls fetchUserProfile(token)
   │
   ├─ Frontend: GET /api/profile
   │   Headers: {
   │     "Authorization": "Bearer mock-jwt-token-1724329600000"
   │   }
   │
   ├─ Backend (/api/profile/route.ts):
   │   ├─ Extracts token from Authorization header
   │   ├─ Validates token format (must start with 'mock-jwt-token-')
   │   ├─ Returns mock user object:
   │   │  {
   │   │    "user": {
   │   │      "id": "1",
   │   │      "email": "admin@example.com",
   │   │      "fullname": "Admin User",
   │   │      "role": "admin"
   │   │    }
   │   │  }
   │
   └─ Dashboard renders: Welcome card + Stats + Admin navigation
```

### Logout Flow

```
1. User clicks "Logout" button on dashboard
   │
   ├─ Frontend: Clears localStorage
   │   ├─ localStorage.removeItem('payload-token')
   │   └─ localStorage.removeItem('remembered-email')
   │
   └─ Frontend: router.push('/login')
```

---

## Admin Dashboard Architecture

### Dashboard UI Components

```
Header
├─ QRS logo badge (gradient teal/cyan)
├─ "QRS Admin" title
├─ Logout button (red variant)

Welcome Card
├─ "Welcome, {fullname}"
├─ Email display
└─ Role badge (capitalized)

Stats Grid (3 cards with monochrome icons)
├─ Total Users (👥 user icon)
├─ Active Sessions (⚡ activity icon)
└─ Last Login (🕐 clock icon)

Admin Navigation Grid (4 clickable cards)
├─ User Management (👥)
│  ├─ Icon + Description
│  └─ Links to /admin/users
│
├─ Content Management (📄)
│  ├─ Icon + Description
│  └─ Links to /admin/content
│
├─ Settings (⚙️)
│  ├─ Icon + Description
│  └─ Links to /admin/settings
│
└─ Activity Logs (📊)
   ├─ Icon + Description
   └─ Links to /admin/logs

Footer
└─ "Back to Website" link to /
```

### Admin Subpage Structure

Each admin subpage (/admin/users, /admin/content, etc.) has:
```
Header
├─ Page title (e.g., "User Management")
├─ Subtitle (e.g., "Manage system users and permissions")
└─ "Back to Dashboard" button

Main Content
└─ Placeholder for feature content

All monochrome SVG icons (no emojis or gradients)
All using institutional design theme (slate/teal/cyan)
```

---

## Authentication & Security

### Session Management

```
Storage: localStorage (client-side)
├─ Key: "payload-token"
├─ Value: JWT token (mock format)
└─ Expires: Until manual logout or browser clear

Optional Storage:
├─ Key: "remembered-email"
├─ Value: User's email address
└─ Purpose: Auto-fill email field on next login
```

### Password Features

```
Login & Signup Pages
├─ Password field with eye icon toggle
├─ Click eye icon to show/hide password
├─ Eye icon styling:
│  ├─ Default: slate-500 (gray)
│  └─ Hover: teal-400 (bright teal)
│
├─ SVG Icons (monochrome stroked):
│  ├─ Open eye: Shows actual password text
│  └─ Closed eye with slash: Shows masked password (•••)
│
└─ Features on signup:
   ├─ Password field with toggle
   ├─ Confirm password field with independent toggle
   ├─ Both toggles work independently
   └─ "Minimum 8 characters" validation hint
```

### Credential Information

```
Mock Credentials (for testing):
  Email:    admin@example.com
  Password: password123

Validation Rules:
  Email:     Must be valid email format
  Password:  Minimum 8 characters (signup)
  Confirm:   Must match password field (signup)
```

---

## Data Flow Architecture

### Page Rendering Flow

```
1. User visits homepage (/)
   │
   ├─ Browser makes request to http://localhost:3000/
   │
   ├─ Next.js App Router loads app/page.tsx (Server Component)
   │
   ├─ Server Component fetches CMS data:
   │   ├─ getProductShowcaseItems() from lib/cms-fetch.ts
   │   ├─ getSolutions() for solutions section
   │   ├─ getPlatformCapabilities() for platform section
   │   └─ getCachedSettings() for hero content from CMS globals
   │
   ├─ CMS API calls (to /api/payload):
   │   ├─ GET /api/product-showcase?published=true
   │   ├─ GET /api/solutions?published=true
   │   ├─ GET /api/platform-capability?published=true
   │   └─ GET /api/globals/settings
   │
   ├─ Payload CMS processes requests:
   │   ├─ Queries PostgreSQL database
   │   ├─ Returns JSON: {docs: [...]}
   │
   ├─ Server Component receives data
   │
   ├─ React renders components:
   │   ├─ <Hero {...heroSettings} />
   │   ├─ <ProductShowcase items={docs} />
   │   ├─ <SolutionsGrid solutions={docs} />
   │   └─ ... more sections
   │
   └─ HTML sent to browser
```

### Form Submission Flow

```
1. User fills contact form (Contact page)
   │
   ├─ Frontend: Collects data
   │   ├─ Name, Email, Message
   │   ├─ Shows Turnstile CAPTCHA widget
   │   └─ Generates Turnstile token
   │
2. User clicks "Send Message"
   │
   ├─ Frontend: POST /api/contact
   │   {
   │     "name": "John Doe",
   │     "email": "john@example.com",
   │     "message": "...",
   │     "turnstileToken": "eyJhbGciOiJIUzI1NiIs..."
   │   }
   │
3. Backend (api/contact/route.ts):
   │   │
   │   ├─ Rate Limit Check:
   │   │   ├─ Extract IP from request
   │   │   ├─ Check sliding window: 5 requests per 60 seconds
   │   │   └─ If exceeded: Return 429 Too Many Requests
   │   │
   │   ├─ Turnstile Verification:
   │   │   ├─ Send token to Cloudflare API
   │   │   ├─ Verify: success + hostname + action
   │   │   └─ If failed: Return 400 TURNSTILE_FAILED
   │   │
   │   ├─ Input Validation (Zod):
   │   │   ├─ name: required, ≥2 characters
   │   │   ├─ email: valid email format
   │   │   ├─ message: required, ≥10 characters
   │   │   └─ If invalid: Return 400 with field errors
   │   │
   │   ├─ Database Operations:
   │   │   ├─ INSERT form_submissions:
   │   │   │  {
   │   │   │    form_type: 'contact',
   │   │   │    name, email, message,
   │   │   │    ip_address: '[user IP]',
   │   │   │    turnstile_verified: true,
   │   │   │    created_at: now()
   │   │   │  }
   │   │   │
   │   │   └─ INSERT audit_logs:
   │   │      {
   │   │        table_name: 'form_submissions',
   │   │        action: 'create',
   │   │        ip_address: '[user IP]',
   │   │        timestamp: now()
   │   │      }
   │   │
   │   └─ Return: 200 {success: true}
   │
   └─ Frontend: Shows success message
```

### Admin Navigation Flow

```
1. User on dashboard clicks "User Management"
   │
   ├─ Frontend: router.push('/admin/users')
   │
   ├─ Browser loads /admin/users page
   │
   ├─ Page component runs:
   │   ├─ useEffect checks for payload-token
   │   ├─ If missing: router.push('/login')
   │   ├─ If present: renders page
   │
   └─ Shows: Header + "User management interface coming soon..."

2. Similar flow for other admin pages:
   ├─ /admin/content
   ├─ /admin/settings
   └─ /admin/logs
```

---

## Project Structure

### Frontend Application Tree

```
frontend/
│
├── app/
│   │
│   ├── (frontend)/                 # Public marketing pages
│   │   ├── page.tsx               # Homepage
│   │   ├── about/page.tsx
│   │   ├── platform/page.tsx
│   │   ├── verify/page.tsx
│   │   ├── solutions/page.tsx
│   │   ├── regulatory/page.tsx
│   │   ├── trust/page.tsx
│   │   ├── validation/page.tsx
│   │   ├── docs/page.tsx
│   │   ├── contact/page.tsx
│   │   └── ... (legal pages)
│   │
│   ├── login/                      # Authentication
│   │   └── page.tsx               # Login page with eye icon toggle + Remember me
│   │
│   ├── signup/                     # User registration
│   │   └── page.tsx               # Signup page with password confirmation
│   │
│   ├── admin/                      # Protected admin area
│   │   ├── dashboard/page.tsx      # Dashboard with stats & navigation
│   │   ├── users/page.tsx          # User management (stub)
│   │   ├── content/page.tsx        # Content management (stub)
│   │   ├── settings/page.tsx       # Settings (stub)
│   │   └── logs/page.tsx           # Activity logs (stub)
│   │
│   ├── api/                        # API routes
│   │   ├── login/route.ts          # POST - User login
│   │   ├── signup/route.ts         # POST - User registration
│   │   ├── profile/route.ts        # GET - User profile (Bearer token)
│   │   ├── contact/route.ts        # POST - Contact form
│   │   ├── privacy-request/route.ts # POST - Privacy request
│   │   ├── webhooks/crm/route.ts   # POST - CRM webhook
│   │   └── payload/[...slug]/route.ts # Proxy to Payload CMS
│   │
│   ├── layout.tsx                  # Root layout (HTML structure)
│   ├── error.tsx                   # Error boundary
│   └── not-found.tsx               # 404 page
│
├── components/
│   ├── marketing/                  # Marketing components (28 active)
│   │   ├── ProductShowcase.tsx
│   │   ├── VerificationFlow.tsx
│   │   ├── RiskEngineShowcase.tsx
│   │   ├── SecurityFeaturesGrid.tsx
│   │   ├── SecurityComplianceSection.tsx
│   │   └── ... (more components)
│   │
│   ├── layout/                     # Layout components
│   │   ├── Header.tsx              # Navigation header
│   │   ├── Footer.tsx              # Site footer
│   │   ├── SiteChrome.tsx          # Wrapper (header/footer)
│   │   ├── MobileNav.tsx           # Mobile drawer
│   │   └── CookiePreferencesButton.tsx
│   │
│   └── ui/                         # UI primitives
│       └── Button.tsx              # CTA button system
│
├── lib/
│   ├── cms-fetch.ts               # CMS REST API client (14 functions)
│   ├── cms/
│   │   └── settings.ts            # Global settings fetch
│   ├── validation/
│   │   ├── schemas.ts             # Zod schemas (contact, signup, etc)
│   │   └── responses.ts           # API response builders
│   ├── rate-limit.ts              # Rate limiter (5 req/min)
│   ├── turnstile.ts               # Cloudflare Turnstile verification
│   ├── audit.ts                   # Audit logging
│   ├── metadata.ts                # SEO metadata
│   ├── constants.ts               # Site constants
│   └── hooks/
│       └── useReducedMotion.ts    # Accessibility hook
│
├── styles/
│   └── globals.css                # Tailwind imports
│
├── public/
│   └── assets                     # Static files
│
├── next.config.js                 # Next.js config (CSP, redirects)
├── tailwind.config.ts             # Tailwind configuration
├── tsconfig.json                  # TypeScript config
├── package.json
└── .env.local                     # Environment variables (gitignored)
```

---

## Component Architecture

### Page Component Hierarchy

```
Layout.tsx (Root)
│
├─ SiteChrome (wrapper)
│  ├─ Header
│  │  └─ Navigation links (7 main routes)
│  │
│  ├─ Page content
│  │  ├─ Marketing components (ProductShowcase, etc)
│  │  ├─ Forms (Contact, Privacy Request)
│  │  └─ CMS-driven sections
│  │
│  └─ Footer
│     └─ Links + copyright
│
├─ CookieConsentUI
│
└─ Turnstile widget (on form pages)
```

### Admin Dashboard Components

```
AdminDashboard
│
├─ Header
│  ├─ QRS logo badge (gradient)
│  ├─ "QRS Admin" title
│  └─ Logout button (red)
│
├─ Welcome Card
│  ├─ Greeting with username
│  ├─ Email display
│  └─ Role badge
│
├─ Stats Grid
│  ├─ Total Users card (with user icon)
│  ├─ Active Sessions card (with activity icon)
│  └─ Last Login card (with clock icon)
│
├─ Admin Navigation Grid
│  ├─ User Management card (👥 icon)
│  ├─ Content Management card (📄 icon)
│  ├─ Settings card (⚙️ icon)
│  └─ Activity Logs card (📊 icon)
│
└─ Footer
   └─ "Back to Website" link
```

---

## Security Implementation

### Authentication

```
Method: Mock JWT (for development)
├─ Login endpoint: POST /api/login
├─ Token storage: localStorage.setItem('payload-token', token)
├─ Token validation: Checked on protected routes (useEffect)
├─ Token format: 'mock-jwt-token-' + timestamp
└─ Session: Persists until logout or browser clear
```

### Password Security

```
Features:
├─ Password input field with eye icon toggle
├─ Click icon to show/hide password
├─ Separate toggles for password & confirm password (on signup)
├─ SVG icons (open eye / closed eye with slash)
└─ Styling:
   ├─ Default: slate-500
   ├─ Hover: teal-400
   └─ Clickable area: 4px padding + cursor-pointer

Validation:
├─ Minimum 8 characters (both login & signup)
├─ Signup: Password must match confirmation
└─ Real-time validation feedback
```

### Form Protection

```
Rate Limiting:
├─ Endpoint: /api/contact, /api/privacy-request
├─ Limit: 5 requests per 60 seconds per IP
├─ Response: 429 Too Many Requests with Retry-After header

Turnstile CAPTCHA:
├─ Widget: On all form submissions
├─ Verification: Backend calls Cloudflare API
├─ Storage: turnstile_verified flag in database
└─ Fallback: 400 TURNSTILE_FAILED if verification fails

Input Validation (Zod):
├─ Email: Valid email format
├─ Name: ≥2 characters
├─ Message: ≥10 characters
└─ Returns: 400 with field-level errors if invalid
```

### Audit Logging

```
Logged Events:
├─ Form submissions (contact, privacy-request)
├─ Admin dashboard access (via token validation)
├─ User authentication (login/signup)
└─ CMS operations (when admin edits content)

Audit Log Stores:
├─ table_name: 'form_submissions', 'users', etc
├─ action: 'create', 'update', 'delete'
├─ ip_address: User's IP from request
├─ timestamp: Event time
└─ user_id: (if authenticated) User who performed action
```

### Content Security Policy (CSP)

```
Implemented in next.config.js:

script-src:    'self' 'unsafe-inline' 'unsafe-eval'
               (required for React hydration)

style-src:     'self' 'unsafe-inline' https://fonts.googleapis.com
               (Tailwind requires unsafe-inline)

img-src:       'self' data: https:
               (Support external images + data URIs)

default-src:   'self'
object-src:    'none'
frame-ancestors: 'self'
base-uri:      'self'
```

---

## Performance Optimization

### Caching Strategy

```
Server-Side (CMS Fetches):
├─ Revalidate: 3600 seconds (1 hour)
├─ On-demand revalidation available
└─ Cache keys: Collection name + filters

Client-Side (localStorage):
├─ payload-token: Session-based
├─ remembered-email: Persistent (user-controlled)
└─ Cookie preferences: Persistent (user-controlled)
```

### Build Output

```
Next.js 16.2.10 (Turbopack)
├─ Static pages: 24 public routes (pre-rendered)
├─ Dynamic pages: 4 admin pages (protected routes)
├─ API routes: 7 endpoints
└─ Output: Single deployment artifact
```

---

## Deployment Configuration

### Environment Variables

```
Frontend (.env.local):
├─ NEXT_PUBLIC_CMS_URL     (e.g., http://localhost:3000/api/payload)
├─ NEXT_PUBLIC_SITE_URL    (e.g., http://localhost:3000)
└─ [Optional Turnstile keys]
```

### Vercel Deployment

```
Single Next.js App:
├─ Framework: Next.js
├─ Build Command: npm run build
├─ Start Command: npm start
├─ Environment: Node.js
└─ Database: PostgreSQL (Neon)

Unified Deployment:
├─ Frontend & CMS routes on same domain
├─ API proxy: /api/payload/* routes to Payload
├─ Static assets: /public/* routes
└─ Zero downtime deployments with edge functions
```

---

## Technology Stack

### Frontend

```
Core:
├─ Next.js 16.2.10 (App Router, React 19)
├─ React 19.0
├─ TypeScript 5.x
└─ Turbopack (bundler)

Styling:
├─ Tailwind CSS 3.x
├─ CSS Modules (optional)
└─ Responsive design system

State Management:
├─ React hooks (useState, useEffect)
├─ localStorage (persistence)
└─ URL params (routing state)

Validation & Forms:
├─ Zod (schema validation)
├─ React form handling
├─ Cloudflare Turnstile (CAPTCHA)
└─ Custom rate limiter

UI Components:
├─ Next.js Link (client-side navigation)
├─ Custom marketing components (28 active)
├─ Accessible UI primitives
└─ Monochrome SVG icons (admin dashboard)
```

### Backend (Integrated in Next.js)

```
API Framework:
├─ Next.js API routes
├─ Payload CMS REST API (integrated)
└─ TypeScript with strict mode

Database:
├─ PostgreSQL (Neon)
├─ Payload CMS ORM (Payload-provided)
└─ Migrations (via Payload)

Authentication:
├─ JWT tokens (client-stored)
├─ Bearer token validation (API routes)
├─ Session management via localStorage
└─ Mock auth for development
```

---

## User Flows Explained

### New User Signup Flow

```
1. User clicks "Sign up" on login page
   └─ Browser navigates to /signup

2. Signup page loads
   ├─ Shows form:
   │  ├─ Full Name field
   │  ├─ Email Address field
   │  ├─ Password field (with eye icon toggle)
   │  ├─ Confirm Password field (with separate eye icon)
   │  └─ "Sign Up" button
   │
   └─ User fills form:
      ├─ Name: "John Doe"
      ├─ Email: "john@example.com"
      ├─ Password: "SecurePass123" (can toggle visibility)
      ├─ Confirm: "SecurePass123" (can toggle independently)

3. User clicks "Sign Up"
   │
   ├─ Frontend validates:
   │  ├─ Name: required, ≥2 chars
   │  ├─ Email: valid format
   │  ├─ Password: ≥8 chars
   │  └─ Confirm: must match password
   │
   ├─ Frontend: POST /api/signup
   │   {
   │     "fullname": "John Doe",
   │     "email": "john@example.com",
   │     "password": "SecurePass123"
   │   }
   │
   ├─ Backend processes:
   │   ├─ Validates input
   │   ├─ Generates mock JWT token
   │   ├─ Returns user object
   │
   ├─ Frontend stores token & redirects
   │   ├─ localStorage.setItem('payload-token', token)
   │   └─ router.push('/admin/dashboard')
   │
   └─ User lands on protected dashboard
      └─ Welcome card shows their name & email
```

### Returning User Login with "Remember Me"

```
1. User returns to site & visits /login page
   ├─ If "remembered-email" exists in localStorage:
   │  └─ Email field auto-fills with saved value
   │
   └─ User enters password & checks "Remember me"

2. User clicks "Sign In"
   │
   ├─ Frontend: POST /api/login
   │
   ├─ Backend validates & returns token
   │
   ├─ Frontend stores:
   │   ├─ localStorage.setItem('payload-token', token)
   │   ├─ localStorage.setItem('remembered-email', email)  ← Because checked
   │   └─ Redirects to /admin/dashboard
   │
   └─ Next time user visits /login:
      └─ Email field pre-fills automatically
```

---

## Error Handling

### Client-Side Errors

```
Page Level:
├─ error.tsx: Global error boundary
└─ not-found.tsx: 404 page

Component Level:
├─ Try/catch in useEffect
├─ Conditional rendering on error
└─ User-friendly error messages
```

### Server-Side Errors

```
API Routes:
├─ 400: Bad request (validation failed)
├─ 401: Unauthorized (invalid token)
├─ 404: Not found (resource missing)
├─ 429: Too many requests (rate limited)
├─ 500: Server error (unexpected)
└─ Returns: {error: "message"} JSON
```

### Form Submission Errors

```
Scenarios:
├─ Rate limit exceeded
│  └─ Returns: 429 {message: "Too many requests"}
│
├─ Turnstile verification failed
│  └─ Returns: 400 {message: "Verification failed"}
│
├─ Validation errors (Zod)
│  └─ Returns: 400 {errors: {field: ["message"]}}
│
└─ Unexpected error
   └─ Returns: 500 {message: "Server error"}
```

---

## Next Steps & Future Enhancements

### Phase 7 (Planned)

```
Authentication:
├─ Replace mock auth with real Payload CMS auth
├─ Implement password hashing (bcrypt)
├─ Add email verification for signup
└─ Add forgot password flow

Admin Features:
├─ Implement User Management page
│  ├─ List users
│  ├─ Create/edit/delete users
│  └─ Assign roles
│
├─ Implement Content Management
│  ├─ CRUD for all CMS collections
│  ├─ Media upload
│  └─ Publish workflow
│
├─ Implement Settings page
│  └─ System configuration options
│
└─ Implement Activity Logs viewer
   ├─ Search/filter logs
   └─ Export capabilities

Testing:
├─ Unit tests (Vitest)
├─ Integration tests
├─ E2E tests (Playwright)
└─ Security penetration testing
```

---

## Summary

**Current State:**
- ✅ Single unified Next.js application (frontend + CMS integrated)
- ✅ Public marketing site (24 routes)
- ✅ User authentication (login/signup/logout)
- ✅ Protected admin dashboard with monochrome icons
- ✅ 4 admin subpages (users, content, settings, logs)
- ✅ Password visibility toggles (eye icon)
- ✅ "Remember me" checkbox for email persistence
- ✅ Form validation & security (rate limiting, Turnstile, audit logging)
- ✅ PostgreSQL database integration

**Deployment Ready:**
- Deploy to Vercel as single Next.js app
- Environment configuration for production
- Security headers & CSP enabled
- Database connection via Neon

---

**Generated:** 2026-08-22  
**Status:** Production-ready with development mock auth
