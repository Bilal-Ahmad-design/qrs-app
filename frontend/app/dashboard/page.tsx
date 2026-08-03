'use client'

import { useEffect, useState } from 'react'

interface User {
  id: number
  email: string
  fullname: string
  role: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'settings'>('profile')
  const [formData, setFormData] = useState({
    fullname: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
      setUser(userData)
      setFormData(prev => ({ ...prev, fullname: userData.fullname || '' }))
    } catch (_error) {
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateProfile() {
    if (!formData.fullname.trim()) {
      setMessage('Full name cannot be empty')
      return
    }

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullname: formData.fullname
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Update failed')
      }

      setMessage('Profile updated!')
      if (user) setUser({ ...user, fullname: formData.fullname })
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error updating profile')
    }
  }

  async function handleChangePassword() {
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setMessage('All password fields are required')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match')
      return
    }

    if (formData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters')
      return
    }

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Password change failed')
      }

      setMessage('Password changed successfully!')
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Error changing password')
    }
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
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-teal-500 sm:text-3xl">👤 Dashboard</h1>
            <p className="text-xs text-gray-400 sm:text-sm">Manage your account</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="truncate text-xs text-gray-400 sm:text-sm">{user?.email}</span>
            <button
              onClick={logout}
              className="whitespace-nowrap rounded bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600 sm:px-4 sm:py-2 sm:text-sm"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </header>

      {/* Message */}
      {message && (
        <div className={`mx-auto max-w-6xl p-4 text-sm sm:p-6 ${
          message.includes('Error') || message.includes('not')
            ? 'rounded bg-red-500/10 text-red-300'
            : 'rounded bg-green-500/10 text-green-300'
        }`}>
          {message}
        </div>
      )}

      {/* Main Content */}
      <div className="mx-auto max-w-6xl p-3 sm:p-6">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-[220px_1fr]">
          {/* Sidebar */}
          <div className="flex gap-2 lg:flex-col lg:space-y-2">
            {/* Admin Panel Button (only for admins) */}
            {['admin', 'super-admin'].includes(user?.role || '') && (
              <button
                onClick={() => window.location.href = '/admin'}
                className="flex-1 lg:flex-none rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-sm transition-all active:scale-95 bg-ink-800 text-teal-400 border border-teal-700 hover:bg-ink-700"
              >
                📋
                <span className="hidden sm:inline ml-2">Admin</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 lg:flex-none rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-sm transition-all active:scale-95 ${
                activeTab === 'profile'
                  ? 'bg-teal-500 text-ink-900 shadow-lg hover:bg-teal-600'
                  : 'bg-ink-800 text-teal-400 border border-teal-700 hover:bg-ink-700'
              }`}
            >
              👤
              <span className="hidden sm:inline ml-2">Profile</span>
            </button>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex-1 lg:flex-none rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-sm transition-all active:scale-95 ${
                activeTab === 'password'
                  ? 'bg-teal-500 text-ink-900 shadow-lg hover:bg-teal-600'
                  : 'bg-ink-800 text-teal-400 border border-teal-700 hover:bg-ink-700'
              }`}
            >
              🔐
              <span className="hidden sm:inline ml-2">Password</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex-1 lg:flex-none rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 font-semibold text-sm transition-all active:scale-95 ${
                activeTab === 'settings'
                  ? 'bg-teal-500 text-ink-900 shadow-lg hover:bg-teal-600'
                  : 'bg-ink-800 text-teal-400 border border-teal-700 hover:bg-ink-700'
              }`}
            >
              ⚙️
              <span className="hidden sm:inline ml-2">Settings</span>
            </button>
          </div>

          {/* Content Area */}
          <div className="space-y-4 rounded-lg bg-ink-800 p-4 sm:space-y-6 sm:p-6 shadow-xl border border-teal-700/50">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-white sm:text-2xl">👤 Profile Information</h2>
                  <p className="text-xs text-gray-500 mt-1">View and manage your profile</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal-500">Email Address</div>
                    <div className="rounded bg-ink-900 border border-teal-700 px-3 py-2 text-xs text-white sm:text-sm">
                      {user?.email}
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal-500">Role</div>
                    <div className="rounded bg-ink-900 border border-teal-700 px-3 py-2 text-xs text-white capitalize sm:text-sm">
                      {user?.role || 'editor'}
                    </div>
                  </div>
                </div>

                <div className="h-px bg-teal-700"></div>

                <div>
                  <h3 className="mb-4 text-lg font-semibold text-teal-500 sm:text-xl">Update Profile</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-teal-500">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.fullname}
                        onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                        placeholder="Your full name"
                        className="w-full rounded border border-teal-700 bg-ink-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>

                    <button
                      onClick={handleUpdateProfile}
                      className="w-full rounded bg-teal-500 px-4 py-3 font-semibold text-ink-900 hover:bg-teal-600 sm:w-auto"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-white sm:text-2xl">🔐 Change Password</h2>
                  <p className="text-xs text-gray-500 mt-1">Update your account password</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-teal-500">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                      placeholder="Enter current password"
                      className="w-full rounded border border-teal-700 bg-ink-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-teal-500">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                        placeholder="Enter new password"
                        className="w-full rounded border border-teal-700 bg-ink-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-teal-500">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        placeholder="Confirm new password"
                        className="w-full rounded border border-teal-700 bg-ink-900 px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      onClick={handleChangePassword}
                      className="flex-1 rounded bg-teal-500 px-4 py-3 font-semibold text-ink-900 hover:bg-teal-600 sm:py-2"
                    >
                      Update Password
                    </button>
                    <button
                      onClick={() => {
                        setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }))
                      }}
                      className="flex-1 rounded bg-teal-700 px-4 py-3 font-semibold text-white hover:bg-teal-600 sm:py-2"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <>
                <div>
                  <h2 className="text-lg font-bold text-white sm:text-2xl">⚙️ Account Settings</h2>
                  <p className="text-xs text-gray-500 mt-1">Manage your account preferences</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-semibold text-teal-500 mb-3">Account Status</h3>
                    <div className="rounded bg-ink-900 border border-teal-700 px-4 py-3">
                      <p className="text-sm text-white">Your account is <span className="font-semibold text-green-400">active</span></p>
                    </div>
                  </div>

                  <div className="h-px bg-teal-700"></div>

                  <div>
                    <h3 className="text-base font-semibold text-teal-500 mb-3">Quick Info</h3>
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>📧 Email: <span className="text-white">{user?.email}</span></p>
                      <p>👤 Name: <span className="text-white">{user?.fullname || 'Not set'}</span></p>
                      <p>🎖️ Role: <span className="text-white capitalize">{user?.role || 'editor'}</span></p>
                    </div>
                  </div>

                  <div className="h-px bg-teal-700"></div>

                  <div>
                    <h3 className="text-base font-semibold text-teal-500 mb-3">Session</h3>
                    <button
                      onClick={logout}
                      className="w-full rounded bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
