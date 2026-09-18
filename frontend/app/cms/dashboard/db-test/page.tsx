'use client'

import { useEffect, useState } from 'react'

export default function DatabaseTestPage() {
  const [data, setData] = useState<any>({
    pages: null,
    sections: null,
    users: null,
    blog: null,
    formSubmissions: null,
    debug: null,
    loading: true,
    error: null,
    message: null,
  })

  useEffect(() => {
    const fetchDatabaseData = async () => {
      try {
        console.log('[DB TEST] Fetching directly from PostgreSQL...')

        // Call a new API endpoint that queries the database directly
        const res = await fetch('/api/db-test', {
          cache: 'no-store',
        })

        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`)
        }

        const result = await res.json()
        console.log('[DB TEST] Database data received:', result)

        setData({
          ...result,
          loading: false,
          error: null,
          message: result.message || null,
        })
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : 'Unknown error'
        console.error('[DB TEST] Error:', errMsg)
        setData((prev: any) => ({
          ...prev,
          loading: false,
          error: errMsg,
        }))
      }
    }

    fetchDatabaseData()
  }, [])

  return (
    <div className="space-y-8 p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-4xl font-bold text-ink-800 mb-2">PostgreSQL Direct Database Test</h1>
        <p className="text-teal-700">Fetching data directly from PostgreSQL (bypassing Payload CMS)</p>
      </div>

      {data.loading && (
        <div className="text-center py-8">
          <p className="text-lg text-teal-700 animate-pulse">Querying PostgreSQL database...</p>
        </div>
      )}

      {data.error && (
        <div className="bg-status-error/10 border border-status-error rounded-lg p-4">
          <p className="font-semibold text-status-error">Database Error:</p>
          <p className="text-sm text-status-error mt-2">{data.error}</p>
          {data.message && <p className="text-xs text-status-error mt-2">{data.message}</p>}
        </div>
      )}

      {/* Debug Info */}
      {data.debug && (
        <div className="bg-ink-100 border border-ink-200 rounded-lg p-4">
          <p className="font-semibold text-ink-800 mb-3">Debug Information:</p>
          <pre className="text-xs text-ink-700 bg-white p-3 rounded border border-ink-200 overflow-auto max-h-64">
            {JSON.stringify(data.debug, null, 2)}
          </pre>
          <p className="text-xs text-teal-700 mt-3">
            📋 Open browser console (F12 → Console tab) to see detailed server logs
          </p>
        </div>
      )}

      {/* Pages Data */}
      {data.pages && (
        <div className="bg-white border border-cream-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-ink-800 mb-4">
            Pages Table ({data.pages.count} records)
          </h2>
          {data.pages.count > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-200">
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">ID</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Title</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Slug</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Published</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.pages.data.map((page: any) => (
                    <tr key={page.id} className="border-b border-cream-100 hover:bg-cream-50">
                      <td className="py-2 px-4 font-mono text-xs text-teal-700">{page.id}</td>
                      <td className="py-2 px-4 text-ink-800">{page.title || 'N/A'}</td>
                      <td className="py-2 px-4 text-teal-700">{page.slug || 'N/A'}</td>
                      <td className="py-2 px-4">
                        <span className={page.published ? 'text-status-ok font-semibold' : 'text-status-warn'}>
                          {page.published ? '✓ Yes' : '✗ No'}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-teal-700/70 text-xs">
                        {new Date(page.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-teal-700">No pages in database</p>
          )}
        </div>
      )}

      {/* Page Sections Data */}
      {data.sections && (
        <div className="bg-white border border-cream-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-ink-800 mb-4">
            Page Sections Table ({data.sections.count} records)
          </h2>
          {data.sections.count > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-200">
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">ID</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Title</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Component Type</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Page ID</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.sections.data.map((section: any) => (
                    <tr key={section.id} className="border-b border-cream-100 hover:bg-cream-50">
                      <td className="py-2 px-4 font-mono text-xs text-teal-700">{section.id}</td>
                      <td className="py-2 px-4 text-ink-800">{section.title || 'N/A'}</td>
                      <td className="py-2 px-4 text-teal-700">{section.componentType || 'N/A'}</td>
                      <td className="py-2 px-4 font-mono text-xs text-teal-700">{section.page || 'N/A'}</td>
                      <td className="py-2 px-4 text-teal-700/70 text-xs">
                        {new Date(section.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-teal-700">No sections in database</p>
          )}
        </div>
      )}

      {/* Users Data */}
      {data.users && (
        <div className="bg-white border border-cream-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-ink-800 mb-4">
            Users Table ({data.users.count} records)
          </h2>
          {data.users.count > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-200">
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">ID</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Email</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Role</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.data.map((user: any) => (
                    <tr key={user.id} className="border-b border-cream-100 hover:bg-cream-50">
                      <td className="py-2 px-4 font-mono text-xs text-teal-700">{user.id}</td>
                      <td className="py-2 px-4 text-ink-800">{user.email}</td>
                      <td className="py-2 px-4 text-teal-700">{user.role || 'user'}</td>
                      <td className="py-2 px-4 text-teal-700/70 text-xs">
                        {new Date(user.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-teal-700">No users in database</p>
          )}
        </div>
      )}

      {/* Blog Data */}
      {data.blog && (
        <div className="bg-white border border-cream-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-ink-800 mb-4">
            Blog Table ({data.blog.count} records)
          </h2>
          {data.blog.count > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream-200">
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">ID</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Title</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Published</th>
                    <th className="text-left py-2 px-4 font-semibold text-ink-800">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {data.blog.data.map((post: any) => (
                    <tr key={post.id} className="border-b border-cream-100 hover:bg-cream-50">
                      <td className="py-2 px-4 font-mono text-xs text-teal-700">{post.id}</td>
                      <td className="py-2 px-4 text-ink-800">{post.title || 'N/A'}</td>
                      <td className="py-2 px-4">
                        <span className={post.published ? 'text-status-ok font-semibold' : 'text-status-warn'}>
                          {post.published ? '✓ Yes' : '✗ No'}
                        </span>
                      </td>
                      <td className="py-2 px-4 text-teal-700/70 text-xs">
                        {new Date(post.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-teal-700">No blog posts in database</p>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-ink-800 mb-4">Database Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <p className="text-sm text-teal-700/70">Pages</p>
            <p className="text-2xl font-bold text-ink-800">{data.pages?.count || 0}</p>
          </div>
          <div>
            <p className="text-sm text-teal-700/70">Sections</p>
            <p className="text-2xl font-bold text-ink-800">{data.sections?.count || 0}</p>
          </div>
          <div>
            <p className="text-sm text-teal-700/70">Users</p>
            <p className="text-2xl font-bold text-ink-800">{data.users?.count || 0}</p>
          </div>
          <div>
            <p className="text-sm text-teal-700/70">Blog Posts</p>
            <p className="text-2xl font-bold text-ink-800">{data.blog?.count || 0}</p>
          </div>
          <div>
            <p className="text-sm text-teal-700/70">Status</p>
            <p className={`text-2xl font-bold ${data.error ? 'text-status-error' : 'text-status-ok'}`}>
              {data.error ? '✗ Error' : '✓ OK'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
