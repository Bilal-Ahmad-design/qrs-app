'use client'

import { useState } from 'react'
import { Search, Inbox } from 'lucide-react'

type SubmissionStatus = 'new' | 'reviewed' | 'resolved'

interface Submission {
  id: string
  type?: string
  formType?: string
  name?: string
  email?: string
  status?: string
  assignee?: string | { email: string }
  createdAt?: string
  updatedAt?: string
}

interface SubmissionsPageClientProps {
  submissions: Submission[]
}

export default function SubmissionsPageClient({ submissions }: SubmissionsPageClientProps) {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<string | 'all'>('all')
  const [search, setSearch] = useState('')

  const statusColors: Record<string, string> = {
    new: 'bg-teal-900 bg-opacity-30 text-teal-300',
    reviewed: 'bg-yellow-900 bg-opacity-30 text-yellow-400',
    resolved: 'bg-green-900 bg-opacity-30 text-green-400',
  }

  const filtered = submissions.filter((sub) => {
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter
    const matchesSearch =
      (sub.name?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (sub.email?.toLowerCase().includes(search.toLowerCase()) || false) ||
      (sub.formType?.toLowerCase().includes(search.toLowerCase()) || false)
    return matchesStatus && matchesSearch
  })

  const unreadCount = submissions.filter((s) => s.status === 'new').length

  const getAssigneeEmail = (assignee: unknown): string => {
    if (typeof assignee === 'string') return assignee
    if (assignee && typeof assignee === 'object' && 'email' in assignee) return (assignee as any).email
    return 'Unassigned'
  }

  const getSubmittedDate = (sub: Submission): string => {
    const date = new Date(sub.createdAt || '')
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex-1 bg-ink-900">
      <div className="flex h-full">
        {/* Left Sidebar - Filters */}
        <div className="w-64 border-r border-teal-700 border-opacity-20 bg-ink-800 p-6 space-y-6">
          <div className="border-b border-teal-700 border-opacity-20 pb-6">
            <h1 className="text-2xl font-outfit font-bold text-cream-50">Submissions</h1>
            <span className="inline-block mt-2 px-2 py-1 bg-teal-500 text-ink-900 rounded text-xs font-poppins font-semibold">
              {unreadCount} New
            </span>
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
            {filtered.length > 0 ? (
              <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-teal-700 border-opacity-20 bg-ink-700">
                        <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">
                          Type
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">
                          Name
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">
                          Email
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">
                          Assignee
                        </th>
                        <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">
                          Submitted
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((submission) => (
                        <tr
                          key={submission.id}
                          onClick={() => setSelectedSubmission(submission.id)}
                          className={`border-b border-teal-700 border-opacity-20 hover:bg-ink-700 transition-colors cursor-pointer ${
                            selectedSubmission === submission.id ? 'bg-ink-700' : ''
                          }`}
                        >
                          <td className="px-4 py-3 text-cream-50 font-poppins">{submission.formType || submission.type}</td>
                          <td className="px-4 py-3 text-cream-50 font-poppins">{submission.name}</td>
                          <td className="px-4 py-3 text-cream-50 text-opacity-80 font-mono text-xs">{submission.email}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-block px-2 py-1 rounded text-xs font-poppins ${
                                statusColors[submission.status || 'new'] || statusColors['new']
                              }`}
                            >
                              {submission.status ? submission.status.charAt(0).toUpperCase() + submission.status.slice(1) : 'New'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-cream-50 text-opacity-60 text-xs">{getAssigneeEmail(submission.assignee)}</td>
                          <td className="px-4 py-3 text-cream-50 text-opacity-60 text-xs">{getSubmittedDate(submission)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-12 text-center">
                <Inbox className="w-12 h-12 text-cream-50 text-opacity-30 mx-auto mb-4" />
                <p className="text-cream-50 text-opacity-60 font-poppins">No submissions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
