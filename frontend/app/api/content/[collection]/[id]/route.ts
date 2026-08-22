import { NextRequest, NextResponse } from 'next/server'

const COLLECTION_ENDPOINTS: Record<string, string> = {
  pages: 'pages',
  blog: 'blog',
  media: 'media',
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  try {
    const { collection, id } = await params

    if (!COLLECTION_ENDPOINTS[collection]) {
      return NextResponse.json(
        { error: `Unknown collection: ${collection}` },
        { status: 400 }
      )
    }

    const data = await req.json()
    const endpoint = COLLECTION_ENDPOINTS[collection]

    const response = await fetch(
      `http://localhost:3000/api/${endpoint}/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY || ''}`,
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Payload API error: ${response.status} ${error}`)
    }

    const item = await response.json()
    return NextResponse.json(item)
  } catch (error) {
    console.error('Content PATCH error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update content' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string; id: string }> }
) {
  try {
    const { collection, id } = await params

    if (!COLLECTION_ENDPOINTS[collection]) {
      return NextResponse.json(
        { error: `Unknown collection: ${collection}` },
        { status: 400 }
      )
    }

    const endpoint = COLLECTION_ENDPOINTS[collection]

    const response = await fetch(
      `http://localhost:3000/api/${endpoint}/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY || ''}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Payload API error: ${response.status} ${error}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Content DELETE error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete content' },
      { status: 500 }
    )
  }
}
