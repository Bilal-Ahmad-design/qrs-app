'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, Search, Settings, LayoutGrid, FileText, Image, Inbox, Link2, Users, History, Dot } from 'lucide-react'

type NavItem = { label: string; href: string; icon: React.ReactNode; badge?: number; roles?: string[] }
type NavGroup = { label: string; items: NavItem[] }

const allNavGroups: NavGroup[] = [
  { label: 'Overview', items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutGrid className="w-4 h-4" /> }] },
  { label: 'Content', items: [
    { label: 'Pages', href: '/admin/content/pages', icon: <FileText className="w-4 h-4" />, roles: ['super-admin', 'admin', 'editor'] },
    { label: 'Media', href: '/admin/content/media', icon: <Image className="w-4 h-4" />, roles: ['super-admin', 'admin', 'editor'] },
  ]},
  { label: 'Engagement', items: [
    { label: 'Submissions', href: '/admin/submissions', icon: <Inbox className="w-4 h-4" />, badge: 0, roles: ['super-admin', 'admin'] },
    { label: 'Redirects', href: '/admin/redirects', icon: <Link2 className="w-4 h-4" />, roles: ['super-admin', 'admin'] },
  ]},
  { label: 'System', items: [
    { label: 'Users', href: '/admin/users', icon: <Users className="w-4 h-4" />, roles: ['super-admin', 'admin'] },
    { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" />, roles: ['super-admin', 'admin'] },
    { label: 'Audit Logs', href: '/admin/logs', icon: <History className="w-4 h-4" />, roles: ['super-admin', 'admin'] },
  ]},
]

function filterNavByRole(groups: NavGroup[], userRole: string): NavGroup[] {
  return groups
    .map(group => ({
      ...group,
      items: group.items.filter(item => !item.roles || item.roles.includes(userRole)),
    }))
    .filter(group => group.items.length > 0)
}

interface User {
  id: string
  email: string
  fullname: string
  role: string
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [cmsAvailable, setCmsAvailable] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const checkCmsStatus = async () => {
      try {
        const response = await fetch('/api/payload/users?limit=1')
        if (response.status === 503) {
          setCmsAvailable(false)
        } else {
          setCmsAvailable(true)
        }
      } catch {
        setCmsAvailable(false)
      }
    }

    checkCmsStatus()
    const interval = setInterval(checkCmsStatus, 10000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          setLoading(false)
        } else {
          // Not authenticated, redirect to login
          setLoading(false)
          router.push('/login?redirect=' + pathname)
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        setLoading(false)
        router.push('/login?redirect=' + pathname)
      }
    }

    fetchUser()
  }, [router, pathname])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ink-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-cream-50 font-poppins">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-ink-900">
      {/* Sidebar */}
      <div className={`fixed lg:relative z-40 h-screen bg-ink-800 border-r border-teal-700 border-opacity-20 transition-all duration-200 flex flex-col ${collapsed ? 'w-20' : 'w-60'} ${!sidebarOpen && 'hidden lg:flex'}`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-teal-700 border-opacity-20">
          {!collapsed && <span className="font-outfit font-bold text-cream-50">QRS</span>}
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 hover:bg-ink-700 rounded transition-colors text-cream-50">
            <Menu className="w-4 h-4" />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {filterNavByRole(allNavGroups, user?.role || 'read-only').map((group) => (
            <div key={group.label} className="mb-6">
              {!collapsed && <div className="px-4 py-2 text-xs font-outfit font-semibold text-cream-50 opacity-60 uppercase tracking-wide">{group.label}</div>}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href.split('?')[0])
                  return (
                    <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 text-sm font-poppins transition-colors ${isActive ? 'text-cream-50 bg-ink-700 border-l-2 border-teal-500' : 'text-cream-50 text-opacity-70 hover:text-opacity-100 hover:bg-ink-700'}`}>
                      <div className="flex-shrink-0 w-4 h-4">{item.icon}</div>
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge ? <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-mono bg-teal-500 text-ink-900 rounded-full">{item.badge}</span> : null}
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Topbar */}
        <div className="h-14 bg-ink-800 border-b border-teal-700 border-opacity-20 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-ink-700 rounded transition-colors text-cream-50">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="hidden md:flex items-center gap-2 bg-ink-700 rounded px-3 py-2 flex-1 max-w-xs">
              <Search className="w-4 h-4 text-cream-50 text-opacity-50" />
              <input type="text" placeholder="Search (⌘K)" className="bg-transparent text-sm text-cream-50 placeholder-cream-50 placeholder-opacity-40 outline-none w-full font-poppins" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Dot className="w-3 h-3 fill-teal-500 text-teal-500" />
              <span className="text-xs font-poppins text-cream-50">Live</span>
            </div>
            {user && (
              <div className="flex items-center gap-2 pl-4 border-l border-teal-700 border-opacity-20">
                <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-ink-900">
                    {user.fullname.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-poppins text-cream-50 font-semibold">{user.fullname}</p>
                  <p className="text-xs font-poppins text-cream-50 text-opacity-60">{user.role}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-ink-700 rounded transition-colors text-cream-50"
                  title="Sign out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CMS Status Warning */}
        {!cmsAvailable && (
          <div className="bg-red-900 bg-opacity-20 border-b border-red-500 border-opacity-50 px-6 py-3 flex items-center gap-3">
            <div className="text-red-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-poppins text-red-200">
                <strong>Payload CMS not running.</strong> Start it with: <code className="bg-red-900 bg-opacity-50 px-2 py-1 rounded font-mono text-xs ml-2">npm run cms</code>
              </p>
            </div>
          </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-ink-900">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
