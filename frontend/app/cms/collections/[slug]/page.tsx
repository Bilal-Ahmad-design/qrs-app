'use client'

import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'

export default function CollectionPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string

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

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{collectionName}</h1>
            <p className="text-sm text-slate-600 mt-1">Manage {collectionName.toLowerCase()}</p>
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
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <div className="text-6xl mb-4">🚧</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Coming Soon</h2>
          <p className="text-slate-600 mb-6 max-w-md mx-auto">
            The detailed collection management interface for <strong>{collectionName}</strong> is coming soon.
          </p>
          <p className="text-sm text-slate-500 mb-8">
            For now, you can use the API or admin dashboard to manage this collection.
          </p>

          <div className="space-y-3">
            <Link
              href="/cms/admin"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* API Info */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">API Endpoint</h3>
          <p className="text-blue-800 mb-3">
            You can access this collection via the REST API:
          </p>
          <code className="block bg-slate-900 text-slate-100 p-4 rounded text-sm overflow-x-auto mb-4">
            GET /api/payload/{slug}
          </code>
          <p className="text-sm text-blue-700">
            💡 View the API documentation for more details on querying and managing collections.
          </p>
        </div>
      </div>
    </div>
  )
}
