export const runtime = 'nodejs'

import { getPayload } from 'payload'
import config from '@/cms/payload.config'

let payload: Awaited<ReturnType<typeof getPayload>> | null = null

async function getPayloadInstance() {
  if (!payload) {
    payload = await getPayload({ config })
  }
  return payload
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const page = url.searchParams.get('page') || 'home'
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '100'), 1000)
  const pageNum = Math.max(1, parseInt(url.searchParams.get('page') || '1'))

  try {
    const payloadInstance = await getPayloadInstance()

    const result = await payloadInstance.find({
      collection: 'page-sections',
      limit,
      page: pageNum,
      where: {
        and: [
          {
            page: {
              equals: page,
            },
          },
          {
            published: {
              equals: true,
            },
          },
        ],
      },
      sort: 'order',
    })

    return Response.json(result)
  } catch (error) {
    console.error('Page sections error:', error)
    return Response.json(
      { error: 'Failed to fetch sections', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
