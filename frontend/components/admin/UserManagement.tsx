'use client'

import { useEffect, useState } from 'react'
import { UserRole, getRoleDisplayName, getAssignableRoles } from '@/lib/roles'

interface User {
  id: number
  email: string
  fullname: string
  role: UserRole
  status?: string
  created_at: string
  last_login?: string
}

interface CreateUserForm {
  email: string
  password: string
  fullname: string
  role: UserRole
}

export function UserManagement({ currentUserRole }: { currentUserRole: UserRole }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState<CreateUserForm>({
    email: '',
    password: '',
    fullname: '',
    role: 'read-only'
  })

  const assignableRoles = getAssignableRoles(currentUserRole)

  // Fetch users on mount
  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    try {
      const res = await fetch('/api/users', {
        credentials: 'include'
      })

      if (!res.ok) throw new Error('Failed to load users')

      const data = await res.json()
      setUsers(data.users || [])
    } catch (error) {
      showMessage('Failed to load users', 'error')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function createUser(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.fullname) {
      showMessage('All fields are required', 'error')
      return
    }

    if (formData.password.length < 6) {
      showMessage('Password must be at least 6 characters', 'error')
      return
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to create user')
      }

      showMessage('User created successfully', 'success')
      setFormData({ email: '', password: '', fullname: '', role: 'read-only' })
      setShowCreateForm(false)
      await loadUsers()
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'Error creating user', 'error')
    }
  }

  async function updateUserRole(userId: number, newRole: UserRole) {
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: userId, role: newRole })
      })

      if (!res.ok) throw new Error('Failed to update user')

      showMessage('User role updated', 'success')
      await loadUsers()
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'Error updating user', 'error')
    }
  }

  async function deleteUser(userId: number) {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const res = await fetch('/api/users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id: userId })
      })

      if (!res.ok) throw new Error('Failed to delete user')

      showMessage('User deleted', 'success')
      await loadUsers()
    } catch (error) {
      showMessage(error instanceof Error ? error.message : 'Error deleting user', 'error')
    }
  }

  function showMessage(text: string, type: 'success' | 'error') {
    setMessage(text)
    setTimeout(() => setMessage(''), 4000)
  }

  if (loading) {
    return <div className="text-gray-400">Loading users...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-teal-500">User Management</h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="rounded-lg bg-teal-500 px-4 py-2 font-semibold text-ink-900 hover:bg-teal-600"
        >
          ➕ Create User
        </button>
      </div>

      {/* Message */}
      {message && (
        <div className={`rounded-lg p-4 ${
          message.includes('Error')
            ? 'bg-red-500/20 text-red-300'
            : 'bg-green-500/20 text-green-300'
        }`}>
          {message}
        </div>
      )}

      {/* Create Form */}
      {showCreateForm && (
        <div className="space-y-4 rounded-lg border border-teal-700 bg-ink-800 p-6">
          <h3 className="text-lg font-semibold text-white">Create New User</h3>
          <form onSubmit={createUser} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-teal-400">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="user@example.com"
                className="w-full rounded-lg border border-teal-700 bg-ink-900 px-3 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-teal-400">
                Full Name
              </label>
              <input
                type="text"
                value={formData.fullname}
                onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                placeholder="John Doe"
                className="w-full rounded-lg border border-teal-700 bg-ink-900 px-3 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-teal-400">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Min 6 characters"
                className="w-full rounded-lg border border-teal-700 bg-ink-900 px-3 py-2 text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-teal-400">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full rounded-lg border border-teal-700 bg-ink-900 px-3 py-2 text-white focus:border-teal-500 focus:outline-none"
              >
                {assignableRoles.map((role) => (
                  <option key={role} value={role}>
                    {getRoleDisplayName(role)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-teal-500 px-4 py-2 font-semibold text-ink-900 hover:bg-teal-600"
              >
                Create User
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white hover:bg-teal-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">All Users ({users.length})</h3>
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex flex-col gap-3 rounded-lg border border-teal-700 bg-ink-800 p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex-1">
                <div className="font-semibold text-white">{user.fullname}</div>
                <div className="text-sm text-gray-400">{user.email}</div>
                <div className="mt-2 flex gap-2 text-xs">
                  <span className="rounded bg-teal-900/30 px-2 py-1 text-teal-300">
                    {getRoleDisplayName(user.role)}
                  </span>
                  {user.status && (
                    <span className={`rounded px-2 py-1 ${
                      user.status === 'active'
                        ? 'bg-green-900/30 text-green-300'
                        : 'bg-red-900/30 text-red-300'
                    }`}>
                      {user.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                {assignableRoles.length > 1 && (
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.id, e.target.value as UserRole)}
                    className="rounded-lg border border-teal-700 bg-ink-900 px-3 py-2 text-sm text-white focus:border-teal-500 focus:outline-none"
                  >
                    {assignableRoles.map((role) => (
                      <option key={role} value={role}>
                        {getRoleDisplayName(role)}
                      </option>
                    ))}
                  </select>
                )}

                {currentUserRole === 'super-admin' && user.id !== getUserIdFromCookie() && (
                  <button
                    onClick={() => deleteUser(user.id)}
                    className="rounded-lg bg-red-500/20 px-3 py-2 text-sm font-semibold text-red-300 hover:bg-red-500/30"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper to get current user ID from cookie (in production, get from /api/auth/me)
function getUserIdFromCookie(): number | null {
  const match = document.cookie.match(/(?:^|; )userId=([^;]*)/)
  return match ? parseInt(match[1], 10) : null
}
