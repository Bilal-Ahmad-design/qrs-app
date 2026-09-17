'use client'

import { useEffect, useState } from 'react'

export default function TestDataPage() {
  const [data, setData] = useState<any>({
    pages: null,
    sections: null,
    blog: null,
    loading: true,
    errors: [] as string[],
  })

  useEffect(() => {
    const fetchAllData = async () => {
      const errors: string[] = []
      const results: any = {}

      try {
        // Fetch Pages
        console.log('[TEST] Fetching pages...')
        const pagesRes = await fetch('/api/payload/pages?limit=10&sort=-createdAt', {
          cache: 'no-store',
        })
        if (pagesRes.ok) {
          results.pages = await pagesRes.json()
          console.log('[TEST] Pages fetched:', results.pages)
        } else {
          errors.push(`Pages failed: ${pagesRes.status}`)
        }

        // Fetch Page Sections
        console.log('[TEST] Fetching page sections...')
        const sectionsRes = await fetch('/api/payload/page-sections?limit=10&sort=-createdAt', {
          cache: 'no-store',
        })
        if (sectionsRes.ok) {
          results.sections = await sectionsRes.json()
          console.log('[TEST] Sections fetched:', results.sections)
        } else {
          errors.push(`Sections failed: ${sectionsRes.status}`)
        }

        // Fetch Blog
        console.log('[TEST] Fetching blog...')
        const blogRes = await fetch('/api/payload/blog?limit=10&sort=-createdAt', {
          cache: 'no-store',
        })
        if (blogRes.ok) {
          results.blog = await blogRes.json()
          console.log('[TEST] Blog fetched:', results.blog)
        } else {
          errors.push(`Blog failed: ${blogRes.status}`)
        }

        // Fetch Users
        console.log('[TEST] Fetching users...')
        const usersRes = await fetch('/api/payload/users?limit=10', {
          cache: 'no-store',
        })
        if (usersRes.ok) {
          results.users = await usersRes.json()
          console.log('[TEST] Users fetched:', results.users)
        } else {
          errors.push(`Users failed: ${usersRes.status}`)
        }

        setData({
          ...results,
          loading: false,
          errors,
        })
      } catch (err) {
        console.error('[TEST] Error:', err)
        const errMsg = err instanceof Error ? err.message : 'Unknown error'
        setData((prev) => ({
          ...prev,
          loading: false,
          errors: [...prev.errors, 'Exception: '.concat(errMsg)],
        }))
      }
    }

    fetchAllData()
  }, [])

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-4xl font-bold text-ink-800 mb-2">Real-Time Data Test</h1>
        <p className="text-teal-700">Testing Payload CMS data fetching in real-time</p>
      </div>

      {data.loading && (
        <div className="text-center py-8">
          <p className="text-lg text-teal-700">Fetching data...</p>
        </div>
      )}

      {data.errors.length > 0 && (
        <div className="bg-status-error/10 border border-status-error rounded-lg p-4">
          <p className="font-semibold text-status-error mb-2">Errors:</p>
          {data.errors.map((err, i) => (
            <p key={i} className="text-sm text-status-error">
              • {err}
            </p>
          ))}
        </div>
      )}

      {/* Pages Data */}
      {data.pages && (
        <div className="bg-white border border-cream-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-ink-800 mb-4">
            Pages ({data.pages.totalDocs})
          </h2>
          {data.pages.docs && data.pages.docs.length > 0 ? (
            <div className="space-y-4">
              {data.pages.docs.map((page: any, i: number) => (
                <div key={page.id} className="p-4 bg-cream-50 rounded-lg border border-cream-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-ink-800">
                      {i + 1}. {page.title || 'Untitled'}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      page.published
                        ? 'bg-status-ok/20 text-status-ok'
                        : 'bg-status-warn/20 text-status-warn'
                    }`}>
                      {page.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  <p className="text-sm text-teal-700">
                    <strong>Slug:</strong> {page.slug || 'N/A'}
                  </p>
                  <p className="text-sm text-teal-700">
                    <strong>ID:</strong> {page.id}
                  </p>
                  <p className="text-xs text-teal-700/70 mt-2">
                    Created: {new Date(page.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-teal-700">No pages found</p>
          )}
        </div>
      )}

      {/* Page Sections Data */}
      {data.sections && (
        <div className="bg-white border border-cream-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-ink-800 mb-4">
            Page Sections ({data.sections.totalDocs})
          </h2>
          {data.sections.docs && data.sections.docs.length > 0 ? (
            <div className="space-y-4">
              {data.sections.docs.map((section: any, i: number) => (
                <div key={section.id} className="p-4 bg-cream-50 rounded-lg border border-cream-200">
                  <div className="mb-2">
                    <h3 className="font-semibold text-ink-800">
                      {i + 1}. {section.title || 'Untitled Section'}
                    </h3>
                  </div>
                  <p className="text-sm text-teal-700">
                    <strong>Component:</strong> {section.componentType || 'N/A'}
                  </p>
                  <p className="text-sm text-teal-700">
                    <strong>ID:</strong> {section.id}
                  </p>
                  {section.description && (
                    <p className="text-sm text-teal-700 mt-2">
                      <strong>Description:</strong> {section.description.slice(0, 100)}...
                    </p>
                  )}
                  <p className="text-xs text-teal-700/70 mt-2">
                    Created: {new Date(section.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-teal-700">No sections found</p>
          )}
        </div>
      )}

      {/* Blog Data */}
      {data.blog && (
        <div className="bg-white border border-cream-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-ink-800 mb-4">
            Blog Posts ({data.blog.totalDocs})
          </h2>
          {data.blog.docs && data.blog.docs.length > 0 ? (
            <div className="space-y-4">
              {data.blog.docs.map((post: any, i: number) => (
                <div key={post.id} className="p-4 bg-cream-50 rounded-lg border border-cream-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-ink-800">
                      {i + 1}. {post.title || 'Untitled'}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded ${
                      post.published
                        ? 'bg-status-ok/20 text-status-ok'
                        : 'bg-status-warn/20 text-status-warn'
                    }`}>
                      {post.published ? 'Published' : 'Draft'}
                    </span>
                  </div>
                  {post.excerpt && (
                    <p className="text-sm text-teal-700 mb-2">
                      {post.excerpt.slice(0, 100)}...
                    </p>
                  )}
                  <p className="text-xs text-teal-700/70">
                    Created: {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-teal-700">No blog posts found</p>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-ink-800 mb-4">Real-Time Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-teal-700/70">Total Pages</p>
            <p className="text-2xl font-bold text-ink-800">{data.pages?.totalDocs || 0}</p>
          </div>
          <div>
            <p className="text-sm text-teal-700/70">Total Sections</p>
            <p className="text-2xl font-bold text-ink-800">{data.sections?.totalDocs || 0}</p>
          </div>
          <div>
            <p className="text-sm text-teal-700/70">Total Blog Posts</p>
            <p className="text-2xl font-bold text-ink-800">{data.blog?.totalDocs || 0}</p>
          </div>
          <div>
            <p className="text-sm text-teal-700/70">Status</p>
            <p className={`text-2xl font-bold ${
              data.loading ? 'text-status-warn' : data.errors.length > 0 ? 'text-status-error' : 'text-status-ok'
            }`}>
              {data.loading ? 'Loading' : data.errors.length > 0 ? 'Errors' : '✓ OK'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
