'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface HeaderProps {
  onMenuClick: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const userJson = localStorage.getItem('payload-user')
    if (userJson) {
      setUser(JSON.parse(userJson))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('payload-user')
    localStorage.removeItem('payload-token')
    router.push('/cms/login')
  }

  return (
    <header className="bg-white border-b border-cream-100 px-8 py-5 flex items-center justify-between md:justify-end sticky top-0 z-30">
      {/* Mobile Menu Button */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 -ml-2 hover:bg-cream-50 rounded-lg transition-colors duration-200"
        aria-label="Toggle menu"
      >
        <svg className="w-6 h-6 text-ink-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* User Menu */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-3 px-4 py-2.5 hover:bg-cream-50 rounded-lg transition-colors duration-200"
        >
          <div className="text-right">
            <div className="text-sm font-semibold text-ink-800">{user?.fullname || user?.email || 'User'}</div>
            <div className="text-xs text-teal-700 font-medium capitalize">{user?.role || 'Editor'}</div>
          </div>
          <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-white">
              {(user?.fullname || user?.email || '?')[0].toUpperCase()}
            </span>
          </div>
        </button>

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-white border border-cream-100 rounded-lg shadow-lg py-1 z-40">
            <button
              onClick={() => {
                router.push('/cms/dashboard')
                setMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-3 text-sm text-ink-800 hover:bg-cream-50 transition-colors duration-150"
            >
              📊 Dashboard
            </button>
            <a
              href="/cms/dashboard/users"
              className="block px-4 py-3 text-sm text-ink-800 hover:bg-cream-50 transition-colors duration-150"
            >
              👥 User Management
            </a>
            <a
              href="/cms/dashboard/audit-logs"
              className="block px-4 py-3 text-sm text-ink-800 hover:bg-cream-50 transition-colors duration-150"
            >
              📋 Audit Logs
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-status-error hover:bg-red-50 transition-colors duration-150 border-t border-cream-100 mt-1 pt-2 font-medium"
            >
              🚪 Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
