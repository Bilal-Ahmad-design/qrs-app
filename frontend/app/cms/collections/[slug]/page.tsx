'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { TableRowSkeleton } from '@/components/dashboard/SkeletonLoader'

interface CollectionItem {
  id: string | number
  [key: string]: any
}

const COLLECTION_LABELS: Record<string, string> = {
  'page-sections': 'Page Sections',
  'pages': 'Pages',
  'users': 'Users',
  'form-submissions': 'Form Submissions',
  'audit-logs': 'Audit Logs',
  'media': 'Media',
  'blog': 'Blog',
  'solutions': 'Solutions',
  'redirects': 'Redirects',
  'blog-posts': 'Blog Posts',
  'regulatory-compliance': 'Regulatory Compliance',
  'platform-capability': 'Platform Capabilities',
  'documentation': 'Documentation',
  'product-showcase': 'Product Showcase',
  'validation-reports': 'Validation Reports',
  'peril-status': 'Peril Status',
  'email-settings': 'Email Settings',
  'email-logs': 'Email Logs',
  'form-entries': 'Form Entries',
}

export default function CollectionPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null)
  const [formData, setFormData] = useState<Partial<CollectionItem>>({})
  const [submitting, setSubmitting] = useState(false)

  const collectionName = COLLECTION_LABELS[slug] || slug

  const fetchData = async (pageNum = 1) => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/payload/${slug}?limit=50&page=${pageNum}`)
      if (!res.ok) throw new Error(`Failed to load ${collectionName}`)

      const data = await res.json()
      setItems(data.docs || [])
      setTotalPages(data.totalPages || 1)
      setPage(pageNum)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collection')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData(1)
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.keys(formData).length === 0) {
      setError('Please fill in at least one field')
      return
    }

    setSubmitting(true)
    try {
      const method = editingItem ? 'PATCH' : 'POST'
      const url = editingItem ? `/api/payload/${slug}/${editingItem.id}` : `/api/payload/${slug}`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message || 'Failed to save')
      }

      setError(null)
      setShowForm(false)
      setEditingItem(null)
      setFormData({})
      await fetchData(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await fetch(`/api/payload/${slug}/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')

      setError(null)
      await fetchData(page)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  const openEditForm = (item: CollectionItem) => {
    setEditingItem(item)
    setFormData({ ...item })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const visibleFields = items.length > 0
    ? Object.keys(items[0])
      .filter(key => !key.startsWith('_') && !key.includes('Id') && key !== 'updatedAt')
      .slice(0, 4)
    : []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-ink-800">{collectionName}</h1>
          <p className="text-teal-700 mt-3 text-base font-medium">Manage {collectionName.toLowerCase()}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setEditingItem(null)
              setFormData({})
              setShowForm(!showForm)
            }}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg font-semibold transition duration-200"
          >
            {showForm ? '✕ Cancel' : '+ Add New'}
          </button>
          <Link
            href="/cms/dashboard"
            className="px-6 py-3 bg-cream-100 hover:bg-cream-200 text-ink-800 rounded-lg font-semibold transition duration-200"
          >
            ← Back
          </Link>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-status-error/10 border border-status-error rounded-lg p-4">
          <p className="text-status-error font-medium">{error}</p>
        </div>
      )}

      {/* Form Section */}
      {showForm && (
        <DashboardCard title={editingItem ? `Edit ${collectionName}` : `Create New ${collectionName.slice(0, -1)}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {items.length > 0 &&
                Object.keys(items[0])
                  .filter(key => !key.startsWith('_') && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt')
                  .slice(0, 8)
                  .map(key => (
                    <div key={key}>
                      <label className="block text-sm font-semibold text-ink-800 mb-2">
                        {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      {key.includes('description') || key.includes('content') || key.includes('text') ? (
                        <textarea
                          value={formData[key] || ''}
                          onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                          className="w-full px-4 py-3 border border-cream-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                          rows={3}
                        />
                      ) : key.includes('published') || key.includes('active') || key.includes('enabled') ? (
                        <input
                          type="checkbox"
                          checked={formData[key] || false}
                          onChange={e => setFormData({ ...formData, [key]: e.target.checked })}
                          className="rounded border-cream-200"
                        />
                      ) : (
                        <input
                          type="text"
                          value={formData[key] || ''}
                          onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                          className="w-full px-4 py-3 border border-cream-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                        />
                      )}
                    </div>
                  ))}
            </div>
            <div className="flex gap-3 pt-4 border-t border-cream-100">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white rounded-lg font-semibold transition"
              >
                {submitting ? 'Saving...' : 'Save'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditingItem(null)
                  setFormData({})
                }}
                className="px-6 py-3 bg-cream-100 hover:bg-cream-200 text-ink-800 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </DashboardCard>
      )}

      {/* Content */}
      {loading ? (
        <DashboardCard title="Loading...">
          <div className="space-y-3">
            {Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} />)}
          </div>
        </DashboardCard>
      ) : items.length === 0 ? (
        <DashboardCard title="No Items">
          <p className="text-teal-700">No {collectionName.toLowerCase()} found. Create your first one!</p>
        </DashboardCard>
      ) : (
        <DashboardCard title={`${collectionName} (${items.length})`} subtitle={`Page ${page} of ${totalPages}`}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-100">
                  {visibleFields.map(key => (
                    <th key={key} className="text-left py-4 px-4 text-xs font-semibold text-ink-800 uppercase tracking-wide">
                      {key}
                    </th>
                  ))}
                  <th className="text-left py-4 px-4 text-xs font-semibold text-ink-800 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-cream-100 hover:bg-cream-50 transition">
                    {visibleFields.map(key => (
                      <td key={key} className="py-4 px-4 text-sm text-ink-800">
                        {typeof item[key] === 'object' ? JSON.stringify(item[key]).slice(0, 50) : String(item[key] || '—').slice(0, 50)}
                      </td>
                    ))}
                    <td className="py-4 px-4 text-sm space-x-2 flex">
                      <button
                        onClick={() => openEditForm(item)}
                        className="px-3 py-1.5 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg text-xs font-semibold transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-3 py-1.5 bg-status-error/10 hover:bg-status-error/20 text-status-error rounded-lg text-xs font-semibold transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-cream-100">
              <div className="text-sm text-teal-700">
                Page {page} of {totalPages}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => fetchData(Math.max(1, page - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 disabled:opacity-50 text-ink-800 rounded-lg text-sm font-semibold transition"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => fetchData(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  className="px-4 py-2 bg-cream-100 hover:bg-cream-200 disabled:opacity-50 text-ink-800 rounded-lg text-sm font-semibold transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </DashboardCard>
      )}
    </div>
  )
}
