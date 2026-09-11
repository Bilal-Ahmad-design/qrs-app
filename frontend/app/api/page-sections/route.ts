export const runtime = 'nodejs'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const page = url.searchParams.get('page') || 'home'
  const limit = url.searchParams.get('limit') || '100'

  try {
    const payloadUrl = process.env.NEXT_PUBLIC_PAYLOAD_URL || '/api/payload'
    const apiUrl = `${payloadUrl}/page-sections?page=1&limit=${limit}&where[page][equals]=${page}&where[published][equals]=true&sort=-order`

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    })

    if (!response.ok) {
      return Response.json(
        { error: 'Failed to fetch sections from CMS' },
        { status: response.status }
      )
    }

    const data = await response.json()
    return Response.json(data)
  } catch (error) {
    console.error('Page sections error:', error)
    return Response.json(
      { error: 'Failed to fetch sections', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
