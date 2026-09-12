'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CollectionItem {
  id?: string | number
  [key: string]: any
}

export default function CollectionPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null)
  const [formData, setFormData] = useState<CollectionItem>({})
  const [submitting, setSubmitting] = useState(false)

  const collectionNames: Record<string, string> = {
    'page-sections': 'Page Sections',
    'pages': 'Pages',
    'users': 'Users',
    'form-submissions': 'Form Submissions',
    'audit-logs': 'Audit Logs',
    'media': 'Media',
    'blog': 'Blog',
    'solutions': 'Solutions',
    'redirects': 'Redirects',
  }

  const collectionName = collectionNames[slug] || slug

  // Fetch collection data
  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const healthRes = await fetch('/api/health')
      const health = await healthRes.json()

      if (!health.database?.ok) {
        throw new Error(`Database unavailable: ${health.database?.message}`)
      }

      const dbRes = await fetch(`/api/db-crud?collection=${slug}&limit=100&page=1`)
      if (!dbRes.ok) throw new Error(`Failed to load collection`)

      const dbData = await dbRes.json()
      setItems(dbData.docs || [])
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load collection'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [slug])

  // Handle form submission (create or update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.keys(formData).length === 0) {
      alert('Please fill in at least one field')
      return
    }

    setSubmitting(true)
    try {
      const method = editingItem ? 'PUT' : 'POST'
      const url = editingItem
        ? `/api/db-crud?collection=${slug}&id=${editingItem.id}`
        : `/api/db-crud?collection=${slug}`

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.error || 'Failed to save')
      }

      const savedItem = await res.json()

      if (editingItem) {
        setItems(items.map(item => item.id === editingItem.id ? savedItem : item))
      } else {
        setItems([savedItem, ...items])
      }

      alert(`Item ${editingItem ? 'updated' : 'created'} successfully`)
      setShowForm(false)
      setEditingItem(null)
      setFormData({})
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setSubmitting(false)
    }
  }

  // Handle delete
  const handleDelete = async (id: string | number) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await fetch(`/api/db-crud?collection=${slug}&id=${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      setItems(items.filter(item => item.id !== id))
      alert('Item deleted successfully')
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // Open edit form
  const openEditForm = (item: CollectionItem) => {
    setEditingItem(item)
    setFormData({ ...item })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{collectionName}</h1>
            <p className="text-sm text-slate-600 mt-1">
              {items.length} item{items.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingItem(null)
                setFormData({})
                setShowForm(!showForm)
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
            >
              {showForm ? '✕ Cancel' : '+ Add New'}
            </button>
            <Link
              href="/cms/admin"
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg text-sm font-medium transition"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Form Section */}
        {showForm && (
          <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              {editingItem ? `Edit ${collectionName}` : `Create New ${collectionName.slice(0, -1)}`}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.length > 0 &&
                  Object.keys(items[0])
                    .filter(key => !key.startsWith('_') && key !== 'id' && key !== 'createdAt' && key !== 'updatedAt')
                    .map(key => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          {key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1')}
                        </label>
                        {key.includes('description') || key.includes('content') ? (
                          <textarea
                            value={formData[key] || ''}
                            onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                          />
                        ) : key.includes('published') || key.includes('active') ? (
                          <input
                            type="checkbox"
                            checked={formData[key] || false}
                            onChange={e => setFormData({ ...formData, [key]: e.target.checked })}
                            className="rounded border-slate-300"
                          />
                        ) : (
                          <input
                            type="text"
                            value={formData[key] || ''}
                            onChange={e => setFormData({ ...formData, [key]: e.target.value })}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        )}
                      </div>
                    ))}
              </div>
              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white rounded-lg text-sm font-medium transition"
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
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg text-sm font-medium transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-4">Use REST API to Manage {collectionName}</h2>
              <p className="text-blue-800 mb-6">
                The web interface is experiencing performance issues. For now, use the REST API below to manage your content. This is actually faster!
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="font-medium text-blue-900 mb-2">📥 Get all items</h3>
                  <code className="block bg-slate-900 text-slate-100 p-4 rounded text-sm overflow-x-auto mb-2">
                    GET /api/payload/{slug}?limit=50&page=1
                  </code>
                  <code className="block bg-slate-100 text-slate-900 p-4 rounded overflow-x-auto font-mono text-xs">
                    curl "http://localhost:3000/api/payload/{slug}?limit=50&page=1"
                  </code>
                </div>

                <div>
                  <h3 className="font-medium text-blue-900 mb-2">➕ Create item</h3>
                  <code className="block bg-slate-900 text-slate-100 p-4 rounded text-sm overflow-x-auto mb-2">
                    POST /api/payload/{slug}
                  </code>
                  <code className="block bg-slate-100 text-slate-900 p-4 rounded overflow-x-auto font-mono text-xs">
                    curl -X POST http://localhost:3000/api/payload/{slug} &#92;<br/>
                    &nbsp;&nbsp;-H "Content-Type: application/json" &#92;<br/>
                    &nbsp;&nbsp;-d '{"{"}...data...{"}"}'
                  </code>
                </div>

                <div>
                  <h3 className="font-medium text-blue-900 mb-2">✏️ Update item</h3>
                  <code className="block bg-slate-900 text-slate-100 p-4 rounded text-sm overflow-x-auto mb-2">
                    PUT /api/payload/{slug}/[id]
                  </code>
                  <code className="block bg-slate-100 text-slate-900 p-4 rounded overflow-x-auto font-mono text-xs">
                    curl -X PUT http://localhost:3000/api/payload/{slug}/[id] &#92;<br/>
                    &nbsp;&nbsp;-H "Content-Type: application/json" &#92;<br/>
                    &nbsp;&nbsp;-d '{"{"}...updated data...{"}"}'
                  </code>
                </div>

                <div>
                  <h3 className="font-medium text-blue-900 mb-2">🗑️ Delete item</h3>
                  <code className="block bg-slate-900 text-slate-100 p-4 rounded text-sm overflow-x-auto mb-2">
                    DELETE /api/payload/{slug}/[id]
                  </code>
                  <code className="block bg-slate-100 text-slate-900 p-4 rounded overflow-x-auto font-mono text-xs">
                    curl -X DELETE http://localhost:3000/api/payload/{slug}/[id]
                  </code>
                </div>
              </div>

              <div className="mt-8 flex gap-4">
                <Link
                  href="/cms/admin"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                >
                  ← Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <p className="text-slate-600 mb-4">No items in this collection yet</p>
            <Link
              href="/cms/admin"
              className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    {Object.keys(items[0] || {})
                      .filter(key => !key.startsWith('_'))
                      .slice(0, 5)
                      .map(key => (
                        <th key={key} className="px-6 py-3 text-left text-sm font-semibold text-slate-900">
                          {key}
                        </th>
                      ))}
                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                      {Object.entries(item)
                        .filter(([key]) => !key.startsWith('_'))
                        .slice(0, 5)
                        .map(([key, value]) => (
                          <td key={key} className="px-6 py-4 text-sm text-slate-600">
                            {typeof value === 'object' ? JSON.stringify(value).slice(0, 50) : String(value).slice(0, 50)}
                          </td>
                        ))}
                      <td className="px-6 py-4 text-sm space-x-2 flex">
                        <button
                          onClick={() => openEditForm(item)}
                          className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-xs font-medium transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded text-xs font-medium transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Info */}
            <div className="bg-slate-50 border-t border-slate-200 px-6 py-4">
              <p className="text-xs text-slate-600">
                💡 For full CRUD operations, use the REST API: <code className="bg-white px-2 py-1 rounded">/api/payload/{slug}</code>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
