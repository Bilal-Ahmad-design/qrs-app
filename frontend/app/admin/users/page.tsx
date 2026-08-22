import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import { Badge } from '@/components/admin/Badge'
import { fetchUsers } from '@/lib/admin/fetch-collections'
import { UserPlus } from 'lucide-react'

interface PayloadUser {
  id: string
  email: string
  fullname?: string
  role: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
}

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
        emptyAction={{ label: 'Create First User', onClick: () => {} }}
      />
    </div>
  )
        const response = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to create user')
        }
        const newUser = await response.json()
        setUsers([...users, { ...data, id: newUser.id }])
      } else {
        const response = await fetch(`/api/users/${editingItem?.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Failed to update user')
        }
        setUsers(users.map(u =>
          u.id === editingItem!.id ? { ...u, ...data } : u
        ))
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to save changes')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete user')
      }
      setUsers(users.filter(u => u.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete user')
    }
  }

  const editFields = [
    { name: 'name', label: 'Full Name', type: 'text' as const },
    { name: 'email', label: 'Email', type: 'text' as const },
    { name: 'role', label: 'Role', type: 'select' as const, options: [
      { value: 'super-admin', label: 'Super Admin' },
      { value: 'admin', label: 'Admin' },
      { value: 'editor', label: 'Editor' },
      { value: 'reviewer', label: 'Reviewer' },
      { value: 'read-only', label: 'Read Only' },
    ]},
    { name: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
    ]},
  ]

  return (
    <div className="flex-1 bg-ink-900">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between border-b border-teal-700 border-opacity-20 pb-6">
          <div>
            <h1 className="text-5xl font-outfit font-bold text-cream-50">Users</h1>
            <p className="text-sm text-cream-50 text-opacity-60 mt-1">Manage system users and permissions ({users.length})</p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-teal-500 text-ink-900 rounded-md font-poppins text-sm font-medium hover:bg-teal-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Invite user
          </button>
        </div>

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
                  <th className="text-right px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-teal-700 border-opacity-20 hover:bg-ink-700 transition-colors">
                    <td className="px-4 py-3 text-cream-50 font-poppins">{user.name}</td>
                    <td className="px-4 py-3 text-cream-50 font-mono text-xs">{user.email}</td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-1 bg-teal-700 bg-opacity-20 text-teal-300 rounded text-xs font-poppins capitalize">
                        {user.role.replace('-', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-poppins capitalize ${user.status === 'active' ? 'text-green-400' : 'text-cream-50 text-opacity-60'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-cream-50 text-opacity-60 text-xs">{user.lastLogin}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="text-teal-400 hover:text-teal-300 text-xs font-poppins transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(user.id)}
                        className="text-red-400 hover:text-red-300 text-xs font-poppins transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-ink-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-6 max-w-sm">
            <h3 className="text-lg font-outfit font-bold text-cream-50 mb-4">Delete User?</h3>
            <p className="text-sm text-cream-50 text-opacity-60 mb-6 font-poppins">This action cannot be undone.</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-cream-50 hover:bg-ink-700 rounded text-sm font-poppins transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-4 py-2 bg-red-900 text-cream-50 hover:bg-red-800 rounded text-sm font-poppins transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <EditModal
        isOpen={isModalOpen}
        title={isCreating ? 'Invite New User' : 'Edit User'}
        item={editingItem}
        fields={editFields}
        onClose={() => {
          setIsModalOpen(false)
          setEditingItem(null)
        }}
        onSave={handleSave}
      />
    </div>
  )
}
