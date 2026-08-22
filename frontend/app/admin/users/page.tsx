import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import { Badge } from '@/components/admin/Badge'
import { fetchUsers, type PayloadUser } from '@/lib/admin/fetch-collections'
import { UserPlus } from 'lucide-react'

// Admin data is authenticated and must be fetched at request time.
export const dynamic = 'force-dynamic'

const columns: DataTableColumn[] = [
  { key: 'fullname', label: 'Name', width: '200px' },
  { key: 'email', label: 'Email', width: '250px' },
  { key: 'role', label: 'Role', width: '150px' },
  { key: 'status', label: 'Status', width: '120px' },
  { key: 'lastLogin', label: 'Last Login', width: '150px' },
  { key: 'actions', label: 'Actions', width: '150px' },
]

function formatLastLogin(lastLoginAt?: string): string {
  if (!lastLoginAt) return 'Never'
  const date = new Date(lastLoginAt)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

export default async function UsersPage() {
  const { docs: users, totalDocs } = await fetchUsers()

  const tableRows = users.map((user: PayloadUser) => ({
    fullname: user.fullname || user.email,
    email: user.email,
    role: <Badge variant="info">{user.role}</Badge>,
    status: (
      <Badge variant={user.isActive ? 'success' : 'danger'}>
        {user.isActive ? 'Active' : 'Inactive'}
      </Badge>
    ),
    lastLogin: formatLastLogin(user.lastLoginAt),
    actions: (
      <div className="flex gap-2">
        <button className="text-xs px-2 py-1 bg-ink-700 rounded hover:bg-ink-600 text-cream-50 transition-colors">
          Edit
        </button>
        <button className="text-xs px-2 py-1 bg-red-500 bg-opacity-20 rounded hover:bg-opacity-30 text-red-300 transition-colors">
          Delete
        </button>
      </div>
    ),
  }))

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-cream-50 mb-2">Users</h1>
          <p className="text-cream-50 text-opacity-70">
            Manage system users and permissions ({totalDocs})
          </p>
        </div>
        <button className="px-4 py-2 bg-teal-500 text-ink-900 font-poppins font-semibold rounded hover:bg-teal-600 transition-colors flex items-center gap-2">
          <UserPlus className="w-4 h-4" />
          Invite user
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={tableRows}
        state={users.length === 0 ? 'empty' : 'idle'}
        emptyMessage="No users found"
      />
    </div>
  )
}
