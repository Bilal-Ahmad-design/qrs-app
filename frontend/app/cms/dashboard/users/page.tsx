'use client'

import { useEffect, useState } from 'react'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { TableRowSkeleton } from '@/components/dashboard/SkeletonLoader'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setError(null)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)

        const res = await fetch('/api/payload/users?limit=25&page=1', {
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!res.ok) throw new Error('Failed to fetch users')
        const data = await res.json()
        setUsers(data.docs || [])
      } catch (err) {
        console.error('Failed to fetch users:', err)
        setError('Unable to load users. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ink-800">Users & Roles</h1>
        <p className="text-teal-700 mt-3 text-base font-medium">Manage platform users and permissions</p>
      </div>

      <DashboardCard title="Users List" subtitle={loading ? 'Loading...' : `${users.length} total users`}>
        {error ? (
          <div className="text-center py-8">
            <p className="text-status-error font-medium">{error}</p>
          </div>
        ) : users.length === 0 && !loading ? (
          <div className="text-center py-8">
            <p className="text-teal-700 font-medium">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-100">
                  <th className="text-left py-4 px-4 text-xs font-semibold text-ink-800 uppercase tracking-wide">Email</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-ink-800 uppercase tracking-wide">Full Name</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-ink-800 uppercase tracking-wide">Role</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-ink-800 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array(5)
                      .fill(0)
                      .map((_, idx) => <TableRowSkeleton key={idx} />)
                  : users.map((user) => (
                      <tr key={user.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors duration-150">
                        <td className="py-4 px-4 text-sm text-ink-800 font-medium">{user.email}</td>
                        <td className="py-4 px-4 text-sm text-ink-800">{user.fullname || '-'}</td>
                        <td className="py-4 px-4 text-sm">
                          <span className="px-3 py-1.5 bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold">
                            {user.role}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span className={`font-medium ${user.isActive ? 'text-status-ok' : 'text-status-error'}`}>
                            {user.isActive ? '🟢 Active' : '🔴 Inactive'}
                          </span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    </div>
  )
}
