export const runtime = 'nodejs'

// Temporary: Return error message while Payload is being configured
export async function GET(request: Request) {
  return new Response(
    JSON.stringify({ error: 'Payload CMS API not available yet. Use /api/page-sections for mock data.' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}

export async function POST(request: Request) {
  return new Response(
    JSON.stringify({ error: 'Payload CMS API not available yet' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}

export async function PATCH(request: Request) {
  return new Response(
    JSON.stringify({ error: 'Payload CMS API not available yet' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}

export async function PUT(request: Request) {
  return new Response(
    JSON.stringify({ error: 'Payload CMS API not available yet' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}

export async function DELETE(request: Request) {
  return new Response(
    JSON.stringify({ error: 'Payload CMS API not available yet' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}
