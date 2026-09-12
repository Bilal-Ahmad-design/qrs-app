export const runtime = 'nodejs'

import { initializePayload } from '@/cms/payload-server'
import { checkDatabaseHealth } from '@/cms/db-health'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const start = Date.now()
  try {
    console.log('[API] GET request to:', request.url)

    // Check database health first
    console.log('[API] Checking database connectivity...')
    const dbHealth = await checkDatabaseHealth()
    console.log('[API] Database check:', dbHealth)

    if (!dbHealth.ok) {
      console.error('[API] Database is not accessible:', dbHealth.message)
      return new Response(
        JSON.stringify({
          error: 'Database unavailable',
          message: dbHealth.message,
          dbCheckTime: dbHealth.time,
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const handler = await initializePayload()
    console.log('[API] Payload initialized in', Date.now() - start, 'ms')

    const response = await handler(request)
    console.log('[API] Response ready in', Date.now() - start, 'ms')

    return response
  } catch (error) {
    const elapsed = Date.now() - start
    console.error('[API] Payload error after', elapsed, 'ms:', error instanceof Error ? error.message : error)
    console.error('[API] Full error:', error)

    return new Response(
      JSON.stringify({
        error: 'Payload CMS error',
        message: error instanceof Error ? error.message : 'Unknown error',
        elapsedMs: elapsed,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request: Request) {
  const start = Date.now()
  try {
    const dbHealth = await checkDatabaseHealth()
    if (!dbHealth.ok) {
      return new Response(
        JSON.stringify({ error: 'Database unavailable', message: dbHealth.message }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const handler = await initializePayload()
    return await handler(request)
  } catch (error) {
    console.error('[API] POST error after', Date.now() - start, 'ms:', error instanceof Error ? error.message : error)
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
  const start = Date.now()
  try {
    const dbHealth = await checkDatabaseHealth()
    if (!dbHealth.ok) {
      return new Response(
        JSON.stringify({ error: 'Database unavailable', message: dbHealth.message }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const handler = await initializePayload()
    return await handler(request)
  } catch (error) {
    console.error('[API] PUT error after', Date.now() - start, 'ms:', error instanceof Error ? error.message : error)
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
  const start = Date.now()
  try {
    const dbHealth = await checkDatabaseHealth()
    if (!dbHealth.ok) {
      return new Response(
        JSON.stringify({ error: 'Database unavailable', message: dbHealth.message }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const handler = await initializePayload()
    return await handler(request)
  } catch (error) {
    console.error('[API] DELETE error after', Date.now() - start, 'ms:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({
        error: 'Payload CMS error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
