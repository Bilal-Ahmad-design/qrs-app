export const runtime = 'nodejs'

import { getPayload } from 'payload'
import config from '@/cms/payload.config'

let payloadInstance: any = null

async function getPayloadInstance() {
  if (!payloadInstance) {
    payloadInstance = await getPayload({ config })
  }
  return payloadInstance
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params
    const collection = slug[0]
    const id = slug[1]

    if (!collection) {
      return new Response(JSON.stringify({ error: 'No collection specified' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payload = await getPayloadInstance()
    const url = new URL(request.url)
    const searchParams = Object.fromEntries(url.searchParams)

    if (id) {
      // Get single document
      const doc = await payload.findByID({
        collection,
        id,
      })
      return new Response(JSON.stringify(doc), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      // Get collection with filters
      const options: any = {}
      if (searchParams.limit) options.limit = parseInt(searchParams.limit)
      if (searchParams.page) options.page = parseInt(searchParams.page)
      if (searchParams.sort) options.sort = searchParams.sort

      const result = await payload.find({ collection, ...options })
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  } catch (error) {
    console.error('Payload API error:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({
        error: 'Failed to fetch from Payload',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params
    const collection = slug[0]

    if (!collection) {
      return new Response(JSON.stringify({ error: 'No collection specified' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await request.json()
    const payload = await getPayloadInstance()

    const result = await payload.create({
      collection,
      data: body,
    })

    return new Response(JSON.stringify(result), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Payload API error:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({
        error: 'Failed to create in Payload',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params
    const collection = slug[0]
    const id = slug[1]

    if (!collection || !id) {
      return new Response(JSON.stringify({ error: 'Collection and ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await request.json()
    const payload = await getPayloadInstance()

    const result = await payload.update({
      collection,
      id,
      data: body,
    })

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Payload API error:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({
        error: 'Failed to update in Payload',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params
    const collection = slug[0]
    const id = slug[1]

    if (!collection || !id) {
      return new Response(JSON.stringify({ error: 'Collection and ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const payload = await getPayloadInstance()

    await payload.delete({
      collection,
      id,
    })

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Payload API error:', error instanceof Error ? error.message : error)
    return new Response(
      JSON.stringify({
        error: 'Failed to delete in Payload',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
