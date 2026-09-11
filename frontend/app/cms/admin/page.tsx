'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  email: string
  fullname?: string
  role: string
}

export default function CMSAdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('payload-token')
        if (!token) {
          router.push('/cms/login')
          return
        }

        const res = await fetch('/api/payload/users/me', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (!res.ok) {
          localStorage.removeItem('payload-token')
          router.push('/cms/login')
          return
        }

        const userData = await res.json()
        setUser(userData)
      } catch (err) {
        console.error('Auth check failed:', err)
        router.push('/cms/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('payload-token')
    localStorage.removeItem('payload-user')
    router.push('/cms/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    )
  }

  const collections = [
    { name: 'Page Sections', slug: 'page-sections', icon: '📄' },
    { name: 'Pages', slug: 'pages', icon: '📑' },
    { name: 'Users', slug: 'users', icon: '👥' },
    { name: 'Form Submissions', slug: 'form-submissions', icon: '📧' },
    { name: 'Audit Logs', slug: 'audit-logs', icon: '📋' },
    { name: 'Media', slug: 'media', icon: '🖼️' },
    { name: 'Blog', slug: 'blog', icon: '📝' },
    { name: 'Solutions', slug: 'solutions', icon: '💡' },
    { name: 'Redirects', slug: 'redirects', icon: '🔄' },
  ]

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">QRS CMS Dashboard</h1>
            <p className="text-sm text-slate-600 mt-1">Manage your content</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-slate-900">{user?.fullname || user?.email}</p>
              <p className="text-xs text-slate-600 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Collections</h2>
          <p className="text-slate-600 mb-6">Manage your content across different collection types</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.slug}
              className="bg-white rounded-lg border border-slate-200 hover:border-blue-500 hover:shadow-lg transition p-6"
            >
              <div className="text-3xl mb-3">{collection.icon}</div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{collection.name}</h3>
              <p className="text-sm text-slate-600 mb-4">Manage {collection.name.toLowerCase()}</p>
              <button
                onClick={() => router.push(`/cms/collections/${collection.slug}`)}
                className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
              >
                Open Collection
              </button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">About QRS CMS</h3>
          <p className="text-blue-800 mb-4">
            This is your central hub for managing all content. You can view, create, edit, and delete items
            from all collections.
          </p>
          <div className="text-sm text-blue-700">
            <p>📚 Learn more about managing content in the <Link href="/docs" className="underline">documentation</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
