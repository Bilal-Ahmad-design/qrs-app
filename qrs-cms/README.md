# QRS CMS - Standalone Payload CMS

Standalone Payload CMS (separate Node.js app) for QRS content management.

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

Admin UI: http://localhost:3001/admin
API: http://localhost:3001/api

## Database

PostgreSQL via Neon Cloud (configured in .env.local)

## Collections

- **Users** - Admin accounts
- **Pages** - Marketing pages

## API Endpoints

- GET /api/pages
- POST /api/pages
- PUT /api/pages/:id
- DELETE /api/pages/:id

## Deployment

```bash
npm run build
npm run start
```

Deploy to: Hostinger, Railway, Render, etc.
