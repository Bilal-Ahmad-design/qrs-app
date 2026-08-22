'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, LogOut, Search, Settings, LayoutGrid, FileText, BookOpen, Image, Inbox, Link2, Users, History, Dot } from 'lucide-react'

type NavItem = { label: string; href: string; icon: React.ReactNode; badge?: number }
type NavGroup = { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  { label: 'Overview', items: [{ label: 'Dashboard', href: '/admin/dashboard', icon: <LayoutGrid className="w-4 h-4" /> }] },
  { label: 'Content', items: [
    { label: 'Pages', href: '/admin/content?type=pages', icon: <FileText className="w-4 h-4" /> },
    // { label: 'Blog', href: '/admin/content?type=blog', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Media', href: '/admin/content?type=media', icon: <Image className="w-4 h-4" /> },
  ]},
  { label: 'Engagement', items: [
    { label: 'Submissions', href: '/admin/submissions', icon: <Inbox className="w-4 h-4" />, badge: 0 },
    { label: 'Redirects', href: '/admin/redirects', icon: <Link2 className="w-4 h-4" /> },
  ]},
  { label: 'System', items: [
    
    { label: 'Users', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
    { label: 'Audit Logs', href: '/admin/logs', icon: <History className="w-4 h-4" /> },
  ]},
]

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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setSidebarOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me')
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
        } else {
          router.push('/login')
        }
      } catch (error) {
        console.error('Failed to fetch user:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-ink-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-cream-50 font-poppins">Loading...</p>
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
          {navGroups.map((group) => (
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

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-ink-900">{children}</main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black bg-opacity-50 lg:hidden z-30" onClick={() => setSidebarOpen(false)} />}
    </div>
  )
}
