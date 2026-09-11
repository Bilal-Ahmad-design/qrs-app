'use client'

import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface CollectionItem {
  id: string
  [key: string]: any
}

export default function CollectionPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

  const [items, setItems] = useState<CollectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/payload/${slug}?limit=50&page=1`)

        if (!res.ok) {
          throw new Error(`Failed to fetch ${slug}`)
        }

        const data = await res.json()
        setItems(data.docs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load collection')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return

    try {
      const res = await fetch(`/api/payload/${slug}/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) throw new Error('Failed to delete')

      setItems(items.filter(item => item.id !== id))
      alert('Item deleted successfully')
    } catch (err) {
      alert(`Error deleting item: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
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
          <Link
            href="/cms/admin"
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg text-sm font-medium transition"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-slate-600">Loading...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
            <p className="font-medium">Error loading collection</p>
            <p className="text-sm mt-1">{error}</p>
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
                      <td className="px-6 py-4 text-sm">
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
