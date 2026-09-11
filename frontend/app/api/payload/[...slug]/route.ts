export const runtime = 'nodejs'

import { initializePayload } from '@/cms/payload-server'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
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
