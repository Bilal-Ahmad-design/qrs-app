export const runtime = 'nodejs'

// Payload CMS API stub - use Payload admin interface for user management
// This route is disabled to prevent Turbopack build issues
// Instead, create users through http://localhost:3000/admin/payload

export async function GET(request: Request) {
  return new Response(
    JSON.stringify({
      error: 'Payload API not available',
      message: 'Create users via Payload admin: http://localhost:3000/admin/payload'
    }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}

export async function POST(request: Request) {
  return new Response(
    JSON.stringify({
      error: 'Payload API not available',
      message: 'Create users via Payload admin: http://localhost:3000/admin/payload'
    }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}

export async function PATCH(request: Request) {
  return new Response(
    JSON.stringify({ error: 'Payload API not available' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}

export async function PUT(request: Request) {
  return new Response(
    JSON.stringify({ error: 'Payload API not available' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}

export async function DELETE(request: Request) {
  return new Response(
    JSON.stringify({ error: 'Payload API not available' }),
    { status: 503, headers: { 'Content-Type': 'application/json' } }
  )
}
