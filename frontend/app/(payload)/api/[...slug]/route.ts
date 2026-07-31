// Legacy CMS proxy route retained as a no-op.
// The frontend now reads content from the dedicated qrs-cms app via NEXT_PUBLIC_CMS_URL.

export async function GET() {
  return new Response(
    JSON.stringify({
      status: 'not_available',
      message: 'This frontend route is no longer used for CMS content.',
      next_step: 'Point NEXT_PUBLIC_CMS_URL at the qrs-cms app and fetch content from /api/pages directly.',
    }),
    { status: 404, headers: { 'Content-Type': 'application/json' } },
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
