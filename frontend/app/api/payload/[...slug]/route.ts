export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { getPayload } from 'payload'
import config from '@/cms/payload.config'

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const start = Date.now()
  try {
    const payload = await getPayload({ config })
    const url = new URL(request.url)
    const slugArray = await params
    const collection = slugArray.slug[0]
    const id = slugArray.slug[1]

    if (!collection) {
      return Response.json({ error: 'Collection not found' }, { status: 400 })
    }

    const collectionMap: Record<string, string> = {
      'page-sections': 'page-sections',
      pages: 'pages',
      blog: 'blog',
      media: 'media',
      users: 'users',
      'form-submissions': 'form-submissions',
      'audit-logs': 'audit-logs',
      solutions: 'solutions',
      'product-showcase': 'product-showcase',
      'regulatory-compliance': 'regulatory-compliance',
      'platform-capability': 'platform-capability',
      documentation: 'documentation',
      'validation-reports': 'validation-reports',
      'peril-status': 'peril-status',
      redirects: 'redirects',
      'form-entries': 'form-entries',
      'email-settings': 'email-settings',
      'email-logs': 'email-logs',
    }

    const collectionSlug = collectionMap[collection]
    if (!collectionSlug) {
      return Response.json({ error: 'Collection not found' }, { status: 404 })
    }

    if (id) {
      const doc = await payload.findByID({ collection: collectionSlug, id })
      return Response.json(doc)
    }

    const limit = Math.min(parseInt(String(url.searchParams.get('limit') || '100')), 1000)
    const page = Math.max(1, parseInt(String(url.searchParams.get('page') || '1')))

    const docs = await payload.find({
      collection: collectionSlug,
      limit,
      page,
    })

    const elapsed = Date.now() - start
    return Response.json(
      { ...docs, responseTimeMs: elapsed },
      {
        headers: {
          'Cache-Control': 'public, max-age=120, s-maxage=120',
        },
      }
    )
  } catch (error) {
    const elapsed = Date.now() - start
    console.error('[API] GET Error after', elapsed, 'ms:', error instanceof Error ? error.message : error)

    return Response.json(
      {
        error: 'Payload CMS error',
        message: error instanceof Error ? error.message : 'Unknown error',
        elapsedMs: elapsed,
      },
      { status: 500 }
    )
  }
}
