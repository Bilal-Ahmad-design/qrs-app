'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { EditModal } from '@/components/admin/EditModal'

interface User {
  id: string
  name: string
  email: string
  role: string
  status: string
  lastLogin: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Admin User', email: 'admin@example.com', role: 'super-admin', status: 'active', lastLogin: '2 min' },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'editor', status: 'active', lastLogin: '1 hour' },
    { id: '3', name: 'John Doe', email: 'john@example.com', role: 'reviewer', status: 'active', lastLogin: '3 hours' },
    { id: '4', name: 'Demo Account', email: 'demo@example.com', role: 'read-only', status: 'inactive', lastLogin: '5 days' },
  ])

  const [editingItem, setEditingItem] = useState<User | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleEdit = (user: User) => {
    setEditingItem(user)
    setIsCreating(false)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setEditingItem({
      id: `new-${Date.now()}`,
      name: '',
      email: '',
      role: 'editor',
      status: 'active',
      lastLogin: 'Never',
    })
    setIsCreating(true)
    setIsModalOpen(true)
  }

  const handleSave = async (data: Record<string, any>) => {
    try {
      if (isCreating) {
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
