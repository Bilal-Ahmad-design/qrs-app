import 'dotenv/config'
import { getPayloadSingleton } from './singleton'

export async function initializePayload() {
  const payload = await getPayloadSingleton()

  return async (request: Request): Promise<Response> => {
    const url = new URL(request.url)
    const path = url.pathname.replace('/api/payload', '') || '/'

    try {
      const method = request.method.toUpperCase()
      const body = ['GET', 'HEAD'].includes(method) ? undefined : await request.text()

      // Parse the path to determine collection and ID
      const parts = path.split('/').filter(Boolean)

      // Map collection names to slugs
      const collectionMap: Record<string, string> = {
        'page-sections': 'page-sections',
        'pages': 'pages',
        'blog': 'blog',
        'media': 'media',
        'users': 'users',
        'form-submissions': 'form-submissions',
        'audit-logs': 'audit-logs',
        'solutions': 'solutions',
        'product-showcase': 'product-showcase',
        'regulatory-compliance': 'regulatory-compliance',
        'platform-capability': 'platform-capability',
        'documentation': 'documentation',
        'validation-reports': 'validation-reports',
        'peril-status': 'peril-status',
        'redirects': 'redirects',
      }

      if (!parts.length || !parts[0]) {
        return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 })
      }

      const collectionSlug = collectionMap[parts[0]]
      if (!collectionSlug) {
        return new Response(JSON.stringify({ error: 'Collection not found' }), { status: 404 })
      }

      const id = parts[1]
      const parsedBody = body ? JSON.parse(body) : undefined

      // Handle different HTTP methods
      if (method === 'GET') {
        if (id) {
          // Get single document
          const doc = await payload.findByID({ collection: collectionSlug, id })
          return new Response(JSON.stringify(doc), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        } else {
          // Get collection with filtering and pagination
          const limit = Math.min(parseInt(String(url.searchParams.get('limit') || '100')), 1000)
          const page = Math.max(1, parseInt(String(url.searchParams.get('page') || '1')))

          const docs = await payload.find({
            collection: collectionSlug,
            limit,
            page,
          })
          return new Response(JSON.stringify(docs), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      } else if (method === 'POST') {
        // Create new document
        const doc = await payload.create({ collection: collectionSlug, data: parsedBody })
        return new Response(JSON.stringify(doc), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      } else if (method === 'PATCH' || method === 'PUT') {
        // Update document
        if (!id) {
          return new Response(JSON.stringify({ error: 'ID required for update' }), {
            status: 400,
          })
        }
        const doc = await payload.update({
          collection: collectionSlug,
          id,
          data: parsedBody,
        })
        return new Response(JSON.stringify(doc), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      } else if (method === 'DELETE') {
        // Delete document
        if (!id) {
          return new Response(JSON.stringify({ error: 'ID required for delete' }), {
            status: 400,
          })
        }
        await payload.delete({ collection: collectionSlug, id })
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        })
      } else {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
        })
      }
    } catch (error: any) {
      console.error('[Payload] Error:', error.message || error)
      return new Response(JSON.stringify({ error: error.message || 'Server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
}
