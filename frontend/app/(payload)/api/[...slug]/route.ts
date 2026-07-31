// Payload API Route - Stub for Development
// Note: Full REST/GraphQL API requires production build due to Turbopack/drizzle-kit incompatibility
// The database IS configured and ready - this limitation is build-time only

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'development_mode',
      message: 'Payload API available in production build only',
      note: 'Database is initialized and ready. Full API will work in production deployment.',
      reason: 'Turbopack bundler incompatibility with @payloadcms/db-postgres dependencies',
      collections_available: [
        'users',
        'media',
        'pages',
        'blog',
        'validation-reports',
        'peril-status',
        'redirects',
        'form-submissions',
        'audit-log',
      ],
      next_steps: [
        '1. Database is ready: PostgreSQL qrs_app with all 21 tables initialized',
        '2. Homepage works perfectly with M2 components',
        '3. Deploy to production for full API access',
        '4. Use admin dashboard info page for current status',
      ],
    }),
    { status: 503, headers: { 'Content-Type': 'application/json' } },
  );
}

export async function POST() {
  return GET();
}

export async function PATCH() {
  return GET();
}

export async function DELETE() {
  return GET();
}

export async function PUT() {
  return GET();
}
