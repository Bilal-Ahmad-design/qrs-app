'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface User {
  id: string
  email: string
  fullname?: string
  role: string
}

export default function CMSAdminPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check if user data exists in localStorage (saved at login)
        const userJson = localStorage.getItem('payload-user')

        if (!userJson) {
          router.push('/cms/login')
          return
        }

        const userData = JSON.parse(userJson)
        setUser(userData)
      } catch (err) {
        console.error('Auth check failed:', err)
        localStorage.removeItem('payload-token')
        localStorage.removeItem('payload-user')
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
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-teal-700">Loading...</div>
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
    <div className="min-h-screen bg-cream-50">
      {/* Header */}
      <div className="bg-white border-b border-cream-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink-800 font-display">QRS CMS Dashboard</h1>
            <p className="text-sm text-teal-700 mt-1">Manage your content</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-ink-800">{user?.fullname || user?.email}</p>
              <p className="text-xs text-teal-700 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition duration-base"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-ink-800 mb-4 font-display">Collections</h2>
          <p className="text-teal-700 mb-6">Manage your content across different collection types</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((collection) => (
            <div
              key={collection.slug}
              className="bg-white rounded-md border border-cream-100 hover:border-teal-500 hover:shadow-md transition p-6"
            >
              <div className="text-3xl mb-3">{collection.icon}</div>
              <h3 className="text-lg font-semibold text-ink-800 mb-2">{collection.name}</h3>
              <p className="text-sm text-teal-700 mb-4">Manage {collection.name.toLowerCase()}</p>
              <button
                onClick={() => router.push(`/cms/collections/${collection.slug}`)}
                className="w-full px-3 py-2 bg-teal-500 hover:bg-teal-600 text-ink-900 rounded-md text-sm font-medium transition duration-base"
              >
                Open Collection
              </button>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-teal-50 border border-teal-200 rounded-md p-6">
          <h3 className="text-lg font-semibold text-ink-800 mb-2">About QRS CMS</h3>
          <p className="text-ink-800 mb-4">
            This is your central hub for managing all content. You can view, create, edit, and delete items
            from all collections.
          </p>
          <div className="text-sm text-ink-800">
            <p>📚 Learn more about managing content in the <Link href="/docs" className="underline text-teal-700 hover:text-teal-600">documentation</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
