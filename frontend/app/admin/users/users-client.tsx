'use client'

import { Plus } from 'lucide-react'

interface User {
  id: string
  name?: string
  email: string
  role?: string
  status?: string
  lastLogin?: string
  createdAt?: string
  lastLoginAt?: string
}

interface UsersPageClientProps {
  users: User[]
}

export default function UsersPageClient({ users }: UsersPageClientProps) {
  const getLastLogin = (user: User): string => {
    if (!user.lastLoginAt && !user.lastLogin) return 'Never'
    if (user.lastLogin) return user.lastLogin

    const lastLogin = new Date(user.lastLoginAt || '')
    const now = new Date()
    const diffMs = now.getTime() - lastLogin.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  const getRoleDisplay = (role?: string): string => {
    if (!role) return 'user'
    return role.replace('-', ' ').replace(/_/g, ' ')
  }

  return (
    <div className="flex-1 bg-ink-900">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-teal-700 border-opacity-20 pb-6">
          <div>
            <h1 className="text-5xl font-outfit font-bold text-cream-50">Users</h1>
            <p className="text-sm text-cream-50 text-opacity-60 mt-1">Manage system users and permissions ({users.length})</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-ink-900 rounded-md font-poppins text-sm font-medium hover:bg-teal-600 transition-colors">
            <Plus className="w-4 h-4" />
            Invite user
          </button>
        </div>

        {users.length > 0 ? (
          <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-teal-700 border-opacity-20 bg-ink-700">
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Role</th>
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Status</th>
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Last login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-teal-700 border-opacity-20 hover:bg-ink-700 transition-colors">
                      <td className="px-4 py-3 text-cream-50 font-poppins">{user.name || user.email.split('@')[0]}</td>
                      <td className="px-4 py-3 text-cream-50 font-mono text-xs">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className="inline-block px-2 py-1 bg-teal-700 bg-opacity-20 text-teal-300 rounded text-xs font-poppins capitalize">
                          {getRoleDisplay(user.role)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-xs font-poppins capitalize ${
                            user.status === 'active' ? 'text-green-400' : 'text-cream-50 text-opacity-60'
                          }`}
                        >
                          {user.status || 'active'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-cream-50 text-opacity-60 text-xs">{getLastLogin(user)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-12 text-center">
            <p className="text-cream-50 text-opacity-60 font-poppins">No users found</p>
          </div>
        )}
      </div>
    </div>
  )
}
