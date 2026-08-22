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

export interface PayloadUser {
  id: string
  email: string
  fullname?: string
  role: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
}

export interface PayloadPage {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  description?: string
  updatedAt: string
}

export interface PayloadMedia {
  id: string
  filename: string
  mimeType: string
  filesize: number
  alt?: string
  createdAt: string
  updatedAt: string
}

export interface FormSubmission {
  id: string
  formType: string
  email: string
  data: Record<string, any>
  reviewStatus: 'pending' | 'reviewed' | 'responded' | 'archived'
  submittedAt: string
  turnstileVerified: boolean
}

export interface AuditLog {
  id: string
  userId: string
  action: string
  collection: string
  documentId: string
  changes: Record<string, any>
  createdAt: string
}

export async function fetchUsers(): Promise<{ docs: PayloadUser[]; totalDocs: number }> {
  return fetchCollection<PayloadUser>('users', { limit: 100 })
}

export async function fetchPages(): Promise<{ docs: PayloadPage[]; totalDocs: number }> {
  return fetchCollection<PayloadPage>('pages', { limit: 100 })
}

export async function fetchBlogPosts() {
  return fetchCollection('blog', { limit: 100 })
}

export async function fetchMedia(): Promise<{ docs: PayloadMedia[]; totalDocs: number }> {
  return fetchCollection<PayloadMedia>('media', { limit: 100 })
}

export async function fetchFormSubmissions() {
  return fetchCollection('form-submissions', { limit: 100, sort: '-createdAt' })
}

export async function fetchAuditLogs(): Promise<{ docs: AuditLog[]; totalDocs: number }> {
  return fetchCollection<AuditLog>('audit-logs', { limit: 50, sort: '-createdAt' })
}

export async function getFormSubmissions(): Promise<{ docs: FormSubmission[]; totalDocs: number }> {
  return fetchCollection<FormSubmission>('form-submissions', { limit: 100, sort: '-submittedAt' })
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
