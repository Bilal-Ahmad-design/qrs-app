export const runtime = 'nodejs'

import { initializePayload } from '@/cms/payload-server'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    console.log('[API] GET request to:', request.url)
    const start = Date.now()

    const handler = await initializePayload()
    console.log('[API] Payload initialized in', Date.now() - start, 'ms')

    const response = await handler(request)
    console.log('[API] Response ready in', Date.now() - start, 'ms')

    return response
  } catch (error) {
    console.error('[API] Payload error:', error instanceof Error ? error.message : error)
    console.error('[API] Full error:', error)

    return new Response(
      JSON.stringify({
        error: 'Payload CMS error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request: Request) {
  try {
    const handler = await initializePayload()
    return await handler(request)
  } catch (error) {
    console.error('Payload error:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({
        error: 'Payload CMS error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const handler = await initializePayload()
    return await handler(request)
  } catch (error) {
    console.error('Payload error:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({
        error: 'Payload CMS error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const handler = await initializePayload()
    return await handler(request)
  } catch (error) {
    console.error('Payload error:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({
        error: 'Payload CMS error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
