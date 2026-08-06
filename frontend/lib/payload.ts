/**
 * Payload Local API Client
 *
 * NOTE: Importing payload.config.ts breaks Turbopack's static analysis due to
 * drizzle-kit's dynamic require of @libsql. This file uses the REST API pattern
 * instead of Local API until DATABASE_URL is available and Turbopack can build.
 *
 * TODO: Once DATABASE_URL exists and build succeeds, switch to Local API:
 * import { getPayload } from 'payload'
 * import config from '@/qrs-cms/payload.config'
 */

const API_URL = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

export async function fetchPages() {
  console.log('[Payload] Fetching pages from:', `${API_URL}/api/pages`)
  try {
    const res = await fetch(`${API_URL}/api/pages`)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    console.log('[Payload] Pages fetched:', data)
    return data
  } catch (error) {
    console.error('[Payload] Error fetching pages:', error)
    return null
  }
}

export async function fetchPageBySlug(slug: string) {
  console.log('[Payload] Fetching page:', slug)
  try {
    const res = await fetch(
      `${API_URL}/api/pages?where[slug][equals]=${slug}`
    )
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    console.log('[Payload] Page data:', data)
    return data.docs?.[0]
  } catch (error) {
    console.error('[Payload] Error fetching page:', error)
    return null
  }
}

export async function fetchBlog() {
  console.log('[Payload] Fetching blog posts')
  try {
    const res = await fetch(`${API_URL}/api/blog`)
    if (!res.ok) throw new Error(`API error: ${res.status}`)
    const data = await res.json()
    console.log('[Payload] Blog posts fetched:', data)
    return data
  } catch (error) {
    console.error('[Payload] Error fetching blog:', error)
    return null
  }
}
