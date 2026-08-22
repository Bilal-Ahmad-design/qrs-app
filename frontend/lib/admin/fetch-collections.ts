/**
 * Generic Payload collection fetcher
 * Handles all GET operations from Payload CMS
 */

export interface FetchOptions {
  limit?: number
  page?: number
  sort?: string
  where?: Record<string, any>
}

const CMS_BASE_URL = 'http://localhost:3000'

export async function fetchCollection<T>(
  collection: string,
  options: FetchOptions = {}
): Promise<{ docs: T[]; totalDocs: number }> {
  try {
    const url = new URL(`${CMS_BASE_URL}/api/payload/${collection}`)

    if (options.limit) url.searchParams.set('limit', String(options.limit))
    if (options.page) url.searchParams.set('page', String(options.page))
    if (options.sort) url.searchParams.set('sort', options.sort)

    const response = await fetch(url.toString(), {
      headers: { 'Content-Type': 'application/json' },
      // ISR revalidate every 60 seconds
      next: { revalidate: 60 },
    })

    if (!response.ok) {
      console.warn(`Failed to fetch ${collection}:`, response.statusText)
      return { docs: [], totalDocs: 0 }
    }

    const data = await response.json()
    return {
      docs: data.docs || [],
      totalDocs: data.totalDocs || 0,
    }
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error)
    return { docs: [], totalDocs: 0 }
  }
}

// Collection-specific fetchers

export async function fetchUsers() {
  return fetchCollection('users', { limit: 100 })
}

export async function fetchPages() {
  return fetchCollection('pages', { limit: 100 })
}

export async function fetchBlogPosts() {
  return fetchCollection('blog', { limit: 100 })
}

export async function fetchMedia() {
  return fetchCollection('media', { limit: 100 })
}

export async function fetchFormSubmissions() {
  return fetchCollection('form-submissions', { limit: 100, sort: '-createdAt' })
}

export async function fetchAuditLogs() {
  return fetchCollection('audit-logs', { limit: 50, sort: '-createdAt' })
}

export async function getFormSubmissions() {
  return fetchCollection('form-submissions', { limit: 100, sort: '-submittedAt' })
}

export async function getCollectionStats() {
  try {
    const [users, pages, submissions] = await Promise.all([
      fetchUsers(),
      fetchPages(),
      getFormSubmissions(),
    ])

    return {
      totalUsers: users.totalDocs,
      totalPages: pages.totalDocs,
      newSubmissions: submissions.docs.filter(
        (s: any) => s.reviewStatus === 'pending'
      ).length,
      totalSubmissions: submissions.totalDocs,
    }
  } catch (error) {
    console.error('Error getting collection stats:', error)
    return { totalUsers: 0, totalPages: 0, newSubmissions: 0, totalSubmissions: 0 }
  }
}
