import { initializePayload } from '@/cms/payload-server'

export const runtime = 'nodejs'

async function handleRequest(request: Request): Promise<Response> {
  try {
    const handler = await initializePayload()
    return await handler(request)
  } catch (error) {
    console.error('Payload error:', error)
    return new Response(
      JSON.stringify({ error: 'Payload CMS error', details: String(error) }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function GET(request: Request) {
  return handleRequest(request)
}

export async function POST(request: Request) {
  return handleRequest(request)
}

export async function PATCH(request: Request) {
  return handleRequest(request)
}

export async function PUT(request: Request) {
  return handleRequest(request)
}

export async function DELETE(request: Request) {
  return handleRequest(request)
}
