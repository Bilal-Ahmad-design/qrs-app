export const runtime = 'nodejs'

const PAYLOAD_URL = process.env.PAYLOAD_CMS_URL || 'http://localhost:3003'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params
    const path = slug.join('/')
    const url = new URL(request.url)
    const queryString = url.search

    const response = await fetch(`${PAYLOAD_URL}/api/${path}${queryString}`, {
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
    console.error('Payload proxy error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch from Payload CMS',
        message: 'Make sure Payload is running: npm run cms',
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

    const response = await fetch(`${PAYLOAD_URL}/api/${path}`, {
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
    console.error('Payload proxy error:', error)
    return new Response(
      JSON.stringify({
        error: 'Failed to create in Payload CMS',
        message: 'Make sure Payload is running: npm run cms',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
