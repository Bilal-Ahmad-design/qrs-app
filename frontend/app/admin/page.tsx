'use client'

import { useEffect, useState } from 'react'
import { UserManagement } from '@/components/admin/UserManagement'
import { UserRole } from '@/lib/roles'

interface User {
  id: number
  email: string
  fullname: string
  role: string
  status?: string
}

interface Page {
  id: number
  title: string
  slug: string
  content: { text: string }
  description: string
  seo_title: string
  seo_description: string
  status: 'published' | 'draft'
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null)
  const [pages, setPages] = useState<Page[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'pages' | 'users'>('pages')

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    description: '',
    seo_title: '',
    seo_description: '',
    status: 'published'
  })

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const res = await fetch('/api/auth/me', { credentials: 'include' })
      if (!res.ok) {
        window.location.href = '/login'
        return
      }
      const userData = await res.json()
      console.log('User data from /api/auth/me:', userData)
      console.log('User role:', userData.role)

      // Check if user is admin or higher (trim and lowercase for safety)
      const userRole = (userData.role || '').trim().toLowerCase()
      if (!['admin', 'super-admin'].includes(userRole)) {
        console.log('Access denied. User role:', userRole, 'Required: admin or super-admin')
        window.location.href = '/'
        return
      }
      setUser(userData)
      await loadPages()
    } catch (_error) {
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  async function loadPages() {
    try {
      const res = await fetch('/api/pages')
      const data = await res.json()
      setPages(data.pages || [])
    } catch (_error) {
      showMessage('Failed to load pages', 'error')
    }
  }

  async function savePage() {
    if (!formData.title || !formData.slug) {
      showMessage('Title and slug are required', 'error')
      return
    }

    try {
      const method = editingId ? 'PUT' : 'POST'
      const url = editingId ? `/api/pages?id=${editingId}` : '/api/pages'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Save failed')
      }

      showMessage(editingId ? 'Page updated!' : 'Page created!', 'success')
      resetForm()
      setShowForm(false)
      await loadPages()
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'Error saving page', 'error')
    }
  }

  async function deletePage(id: number) {
    if (!confirm('Delete this page?')) return

    try {
      await fetch(`/api/pages?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      showMessage('Page deleted!', 'success')
      await loadPages()
    } catch (_error) {
      showMessage('Failed to delete', 'error')
    }
  }

  async function editPage(page: Page) {
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content?.text || '',
      description: page.description || '',
      seo_title: page.seo_title || '',
      seo_description: page.seo_description || '',
      status: page.status || 'published'
    })
    setEditingId(page.id)
    setShowForm(true)
  }

  function resetForm() {
    setFormData({
      title: '',
      slug: '',
      content: '',
      description: '',
      seo_title: '',
      seo_description: '',
      status: 'published'
    })
    setEditingId(null)
  }

  function showMessage(text: string, _messageType: 'error' | 'success') {
    setMessage(text)
    setTimeout(() => setMessage(''), 4000)
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    window.location.href = '/login'
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Loading...</div>

  return (
    <div className="min-h-screen bg-ink-900">
      {/* Header */}
      <header className="border-b border-teal-700 bg-ink-800 p-4 sm:p-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-teal-500 sm:text-3xl">📝 Admin Panel</h1>
            <p className="text-xs text-gray-400 sm:text-sm">Content Management</p>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="truncate text-xs text-gray-400 sm:text-sm">{user?.email}</span>
            <button
              onClick={logout}
              className="whitespace-nowrap rounded-lg bg-red-500 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-red-600 active:scale-95 transition-transform sm:px-4 sm:py-2 sm:text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`mx-auto max-w-6xl p-3 sm:p-6 m-3 sm:m-6 text-sm rounded-lg animate-pulse ${
          message.includes('Error') || message.includes('not')
            ? 'bg-red-500/20 text-red-200 border border-red-500/30'
            : 'bg-green-500/20 text-green-200 border border-green-500/30'
        }`}>
          {message.includes('Error') || message.includes('not') ? '❌' : '✅'} {message}
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-6xl p-3 sm:p-6">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <div className="flex gap-2 lg:flex-col lg:space-y-2">
            <button
              onClick={() => {
                setActiveTab('pages')
                setShowForm(false)
                resetForm()
              }}
              className={`flex-1 lg:flex-none rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-sm transition-all active:scale-95 ${
                activeTab === 'pages' && !showForm
                  ? 'bg-teal-500 text-ink-900 shadow-lg hover:bg-teal-600'
                  : 'bg-ink-800 text-teal-400 border border-teal-700 hover:bg-ink-700'
              }`}
            >
              📋
              <span className="hidden sm:inline ml-2">Pages</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('pages')
                setShowForm(true)
                resetForm()
              }}
              className={`flex-1 lg:flex-none rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-sm transition-all active:scale-95 ${
                activeTab === 'pages' && showForm && !editingId
                  ? 'bg-teal-500 text-ink-900 shadow-lg hover:bg-teal-600'
                  : 'bg-ink-800 text-teal-400 border border-teal-700 hover:bg-ink-700'
              }`}
            >
              ➕
              <span className="hidden sm:inline ml-2">New</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('users')
                setShowForm(false)
                resetForm()
              }}
              className={`flex-1 lg:flex-none rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-sm transition-all active:scale-95 ${
                activeTab === 'users'
                  ? 'bg-teal-500 text-ink-900 shadow-lg hover:bg-teal-600'
                  : 'bg-ink-800 text-teal-400 border border-teal-700 hover:bg-ink-700'
              }`}
            >
              👥
              <span className="hidden sm:inline ml-2">Users</span>
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4 rounded-lg bg-ink-800 p-4 sm:space-y-6 sm:p-6 shadow-xl border border-teal-700/50">
            {activeTab === 'pages' && !showForm ? (
              <>
                <div>
                  <h2 className="text-lg font-bold text-white sm:text-2xl">📄 Pages</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage your content</p>
                </div>
                <div className="space-y-2">
                  {pages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No pages yet. Create one to get started!</p>
                    </div>
                  ) : (
                    pages.map((page) => (
                      <div
                        key={page.id}
                        className="rounded-lg bg-ink-900/50 border border-teal-700/30 p-3 sm:p-4 hover:border-teal-600/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-white text-sm sm:text-base truncate">{page.title}</h3>
                            <p className="text-xs text-gray-500 mt-1">
                              /{page.slug} · <span className="inline-block px-2 py-0.5 rounded bg-teal-900/30 text-teal-300 text-xs font-medium">{page.status}</span>
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => editPage(page)}
                            className="flex-1 rounded-lg bg-teal-500 px-3 py-2 text-xs font-semibold text-ink-900 hover:bg-teal-600 active:scale-95 transition-all shadow-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deletePage(page.id)}
                            className="flex-1 rounded-lg bg-red-500/20 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/30 active:scale-95 transition-all border border-red-500/30"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </>
            ) : activeTab === 'pages' && showForm ? (
              <>
                <div>
                  <h2 className="text-lg font-bold text-white sm:text-2xl">
                    {editingId ? '✏️ Edit Page' : '✨ Create Page'}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">{editingId ? 'Update your page content' : 'Add a new page to your site'}</p>
                </div>
                <div className="space-y-3 sm:space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-teal-400">
                      Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter page title"
                      className="w-full rounded-lg border border-teal-700/50 bg-ink-900/50 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-teal-400">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      placeholder="page-slug"
                      className="w-full rounded-lg border border-teal-700/50 bg-ink-900/50 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-teal-400">
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full rounded-lg border border-teal-700/50 bg-ink-900/50 px-3 py-2.5 text-sm text-white focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-teal-400">
                      Content
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your page content..."
                      className="min-h-28 w-full rounded-lg border border-teal-700/50 bg-ink-900/50 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-teal-400">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description of the page..."
                      className="min-h-20 w-full rounded-lg border border-teal-700/50 bg-ink-900/50 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all resize-none"
                    />
                  </div>

                  <div className="grid gap-3">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-teal-400">
                        SEO Title
                      </label>
                      <input
                        type="text"
                        value={formData.seo_title}
                        onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                        placeholder="SEO title (for search engines)"
                        className="w-full rounded-lg border border-teal-700/50 bg-ink-900/50 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-teal-400">
                        SEO Description
                      </label>
                      <input
                        type="text"
                        value={formData.seo_description}
                        onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                        placeholder="SEO description (for search engines)"
                        className="w-full rounded-lg border border-teal-700/50 bg-ink-900/50 px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row pt-2">
                    <button
                      onClick={savePage}
                      className="flex-1 rounded-lg bg-teal-500 px-4 py-3 font-bold text-ink-900 hover:bg-teal-600 active:scale-95 transition-all shadow-lg text-sm"
                    >
                      💾 Save Page
                    </button>
                    <button
                      onClick={() => {
                        setShowForm(false)
                        resetForm()
                      }}
                      className="flex-1 rounded-lg bg-ink-700 px-4 py-3 font-bold text-gray-300 hover:bg-ink-600 active:scale-95 transition-all border border-teal-700/30 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            ) : activeTab === 'users' ? (
              <UserManagement currentUserRole={user?.role as UserRole} />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
