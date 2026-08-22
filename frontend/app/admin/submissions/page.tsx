'use client'

import { useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { EditModal } from '@/components/admin/EditModal'

type SubmissionStatus = 'new' | 'reviewed' | 'resolved'

interface Submission {
  id: string
  type: string
  name: string
  email: string
  status: SubmissionStatus
  assignee: string
  submitted: string
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([
    { id: '1', type: 'Contact Form', name: 'Sarah Chen', email: 'sarah@company.com', status: 'new', assignee: 'Unassigned', submitted: '2 hours ago' },
    { id: '2', type: 'Demo Request', name: 'John Smith', email: 'john@acme.io', status: 'reviewed', assignee: 'alice@example.com', submitted: '5 hours ago' },
    { id: '3', type: 'Support Ticket', name: 'Maya Patel', email: 'maya@startup.io', status: 'new', assignee: 'Unassigned', submitted: '8 hours ago' },
    { id: '4', type: 'Contact Form', name: 'Alex Rodriguez', email: 'alex@fortune500.com', status: 'resolved', assignee: 'bob@example.com', submitted: '1 day ago' },
    { id: '5', type: 'Feedback', name: 'Lisa Wong', email: 'lisa@tech.io', status: 'new', assignee: 'Unassigned', submitted: '2 days ago' },
  ])

  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<SubmissionStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [editingItem, setEditingItem] = useState<Submission | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = statusFilter === 'all' ? submissions : submissions.filter(s => s.status === statusFilter)
  const searchFiltered = filtered.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase()) ||
    s.type.toLowerCase().includes(search.toLowerCase())
  )

  const unreadCount = submissions.filter(s => s.status === 'new').length

  const statusColors: Record<SubmissionStatus, string> = {
    new: 'bg-teal-900 bg-opacity-30 text-teal-300',
    reviewed: 'bg-yellow-900 bg-opacity-30 text-yellow-400',
    resolved: 'bg-green-900 bg-opacity-30 text-green-400',
  }

  const handleEdit = (item: Submission) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleSave = async (data: Record<string, any>) => {
    try {
      const response = await fetch(`/api/form-submissions/${editingItem?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }

      if (editingItem) {
        setSubmissions(submissions.map(s =>
          s.id === editingItem.id ? { ...s, ...data } : s
        ))
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to save changes')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/form-submissions/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete')
      }
      setSubmissions(submissions.filter(s => s.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to delete:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete submission')
    }
  }

  const editFields = [
    { name: 'name', label: 'Name', type: 'text' as const },
    { name: 'email', label: 'Email', type: 'text' as const },
    { name: 'type', label: 'Form Type', type: 'text' as const },
    { name: 'status', label: 'Status', type: 'select' as const, options: [
      { value: 'new', label: 'New' },
      { value: 'reviewed', label: 'Reviewed' },
      { value: 'resolved', label: 'Resolved' },
    ]},
    { name: 'assignee', label: 'Assignee', type: 'text' as const },
  ]

  return (
    <div className="flex-1 bg-ink-900">
      <div className="flex h-full">
        {/* Left Sidebar - Filters */}
        <div className="w-64 border-r border-teal-700 border-opacity-20 bg-ink-800 p-6 space-y-6">
          <div className="border-b border-teal-700 border-opacity-20 pb-6">
            <h1 className="text-2xl font-outfit font-bold text-cream-50">Submissions</h1>
            <span className="inline-block mt-2 px-2 py-1 bg-teal-500 text-ink-900 rounded text-xs font-poppins font-semibold">{unreadCount} New</span>
          </div>

          <div>
            <label className="text-xs font-poppins font-semibold text-cream-50 text-opacity-60 block mb-3">Status</label>
            <div className="space-y-2">
              {(['all', 'new', 'reviewed', 'resolved'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`w-full text-left px-3 py-2 rounded text-sm font-poppins transition-colors ${
                    statusFilter === status
                      ? 'bg-teal-500 text-ink-900 font-medium'
                      : 'text-cream-50 hover:bg-ink-700'
                  }`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-poppins font-semibold text-cream-50 text-opacity-60 block mb-3">Form Type</label>
            <div className="space-y-2">
              {['Contact Form', 'Demo Request', 'Support Ticket', 'Feedback'].map((type) => (
                <label key={type} className="flex items-center gap-2 text-sm font-poppins text-cream-50 cursor-pointer hover:text-opacity-80">
                  <input type="checkbox" className="rounded" />
                  {type}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-cream-50 text-opacity-40" />
              <input
                type="text"
                placeholder="Search submissions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-md bg-ink-800 border border-teal-700 border-opacity-20 text-cream-50 placeholder-cream-50 placeholder-opacity-40 text-sm font-poppins"
              />
            </div>

            {/* Table */}
            <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-teal-700 border-opacity-20 bg-ink-700">
                      <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Name</th>
                      <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Email</th>
                      <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Assignee</th>
                      <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Submitted</th>
                      <th className="text-right px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchFiltered.map((submission) => (
                      <tr
                        key={submission.id}
                        onClick={() => setSelectedSubmission(submission.id)}
                        className={`border-b border-teal-700 border-opacity-20 hover:bg-ink-700 transition-colors cursor-pointer ${
                          selectedSubmission === submission.id ? 'bg-ink-700' : ''
                        }`}
                      >
                        <td className="px-4 py-3 text-cream-50 font-poppins">{submission.type}</td>
                        <td className="px-4 py-3 text-cream-50 font-poppins">{submission.name}</td>
                        <td className="px-4 py-3 text-cream-50 text-opacity-80 font-mono text-xs">{submission.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-poppins ${statusColors[submission.status]}`}>
                            {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-cream-50 text-opacity-60 text-xs">{submission.assignee}</td>
                        <td className="px-4 py-3 text-cream-50 text-opacity-60 text-xs">{submission.submitted}</td>
                        <td className="px-4 py-3 text-right space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => handleEdit(submission)}
                            className="text-teal-400 hover:text-teal-300 text-xs font-poppins transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(submission.id)}
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
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-ink-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-6 max-w-sm">
            <h3 className="text-lg font-outfit font-bold text-cream-50 mb-4">Delete Submission?</h3>
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
        title="Edit Submission"
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
