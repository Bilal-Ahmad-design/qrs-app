import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import { requirePermission } from '@/lib/auth/authorization'
import { Badge } from '@/components/admin/Badge'
import { getFormSubmissions, type FormSubmission } from '@/lib/admin/fetch-collections'
import { Mail, Eye } from 'lucide-react'

// Admin data is authenticated and must be fetched at request time.
export const dynamic = 'force-dynamic'

const columns: DataTableColumn[] = [
  { key: 'type', label: 'Form Type', width: '150px' },
  { key: 'email', label: 'Email', width: '200px' },
  { key: 'message', label: 'Message', width: '300px' },
  { key: 'status', label: 'Status', width: '120px' },
  { key: 'date', label: 'Submitted', width: '150px' },
  { key: 'actions', label: 'Actions', width: '150px' },
]

const formTypeLabels: Record<string, string> = {
  'demo-request': 'Demo Request',
  'validation-report-request': 'Validation Report',
  'newsletter': 'Newsletter',
  'contact': 'Contact',
  'privacy-request': 'Privacy Request',
  'press': 'Press Inquiry',
  'rfp': 'RFP Response',
  'partner': 'Partner Inquiry',
  'escalation': 'Escalation',
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
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

function getMessagePreview(data: Record<string, any>): string {
  // Try common form field names
  const message = data.message || data.description || data.content || data.body || ''
  if (typeof message === 'string') {
    return message.substring(0, 60) + (message.length > 60 ? '...' : '')
  }
  return 'No message'
}

export default async function SubmissionsPage() {
  await requirePermission('forms:update')
  const { docs: submissions, totalDocs } = await getFormSubmissions()

  const tableRows = submissions.map((submission: FormSubmission) => ({
    type: (
      <Badge variant="info">
        {formTypeLabels[submission.formType] || submission.formType}
      </Badge>
    ),
    email: (
      <div className="flex items-center gap-2">
        <Mail className="w-4 h-4 text-cream-50 opacity-50" />
        <span className="text-xs">{submission.email}</span>
      </div>
    ),
    message: (
      <span className="text-xs text-cream-50 text-opacity-80">
        {getMessagePreview(submission.data)}
      </span>
    ),
    status: (
      <Badge
        variant={
          submission.reviewStatus === 'pending'
            ? 'warning'
            : submission.reviewStatus === 'responded'
              ? 'success'
              : 'default'
        }
      >
        {submission.reviewStatus.charAt(0).toUpperCase() + submission.reviewStatus.slice(1)}
      </Badge>
    ),
    date: formatDate(submission.submittedAt),
    actions: (
      <div className="flex gap-2">
        <button className="text-xs px-2 py-1 bg-ink-700 rounded hover:bg-ink-600 text-cream-50 transition-colors flex items-center gap-1">
          <Eye className="w-3 h-3" />
          View
        </button>
        {submission.reviewStatus === 'pending' && (
          <button className="text-xs px-2 py-1 bg-teal-500 bg-opacity-20 rounded hover:bg-opacity-30 text-teal-300 transition-colors">
            Review
          </button>
        )}
      </div>
    ),
  }))

  const pendingCount = submissions.filter((s: FormSubmission) => s.reviewStatus === 'pending')
    .length

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-outfit font-bold text-cream-50 mb-2">Form Submissions</h1>
          <p className="text-cream-50 text-opacity-70">
            Real-time submissions from contact & privacy forms ({totalDocs} total, {pendingCount} pending)
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="px-4 py-2 bg-amber-500 bg-opacity-20 border border-amber-500 rounded text-amber-200 font-poppins text-sm font-semibold">
            {pendingCount} pending
          </div>
        )}
      </div>

      <DataTable
        columns={columns}
        rows={tableRows}
        state={submissions.length === 0 ? 'empty' : 'idle'}
        emptyMessage="No form submissions yet"
      />
    </div>
  )
}
