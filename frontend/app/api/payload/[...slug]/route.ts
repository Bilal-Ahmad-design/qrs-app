export const runtime = 'nodejs'

// Proxy requests to Payload CMS running on port 3001
const PAYLOAD_URL = 'http://localhost:3001'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params
    const path = slug.join('/')
    const url = new URL(request.url)
    const queryString = url.search

    const response = await fetch(`${PAYLOAD_URL}/api/payload/${path}${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') && {
          authorization: request.headers.get('authorization')!,
        }),
      },
    })

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Payload proxy error:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({
        error: 'Payload CMS not responding',
        message: 'Make sure Payload is running: npm run cms:server',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params
    const path = slug.join('/')
    const body = await request.text()

    const response = await fetch(`${PAYLOAD_URL}/api/payload/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(request.headers.get('authorization') && {
          authorization: request.headers.get('authorization')!,
        }),
      },
      body,
    })

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Payload proxy error:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({
        error: 'Payload CMS not responding',
        message: 'Make sure Payload is running: npm run cms:server',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
