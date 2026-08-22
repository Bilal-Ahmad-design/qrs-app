import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import { Badge } from '@/components/admin/Badge'
import { fetchPages } from '@/lib/admin/fetch-collections'
import { Plus } from 'lucide-react'

interface PayloadPage {
  id: string
  title: string
  slug: string
  status: 'draft' | 'published'
  description?: string
  updatedAt: string
}

const columns: DataTableColumn[] = [
  { key: 'title', label: 'Title', width: '250px' },
  { key: 'slug', label: 'Slug', width: '200px' },
  { key: 'status', label: 'Status', width: '120px' },
  { key: 'updated', label: 'Updated', width: '150px' },
  { key: 'actions', label: 'Actions', width: '150px' },
]

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

export default async function PagesPage() {
  const { docs: pages, totalDocs } = await fetchPages()

  const tableRows = pages.map((page: PayloadPage) => ({
    title: page.title,
    slug: <code className="text-xs bg-ink-700 px-2 py-1 rounded">{page.slug}</code>,
    status: (
      <Badge variant={page.status === 'published' ? 'success' : 'warning'}>
        {page.status === 'published' ? 'Published' : 'Draft'}
      </Badge>
    ),
    updated: formatDate(page.updatedAt),
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
          <h1 className="text-3xl font-outfit font-bold text-cream-50 mb-2">Pages</h1>
          <p className="text-cream-50 text-opacity-70">
            Manage website pages and content ({totalDocs})
          </p>
        </div>
        <button className="px-4 py-2 bg-teal-500 text-ink-900 font-poppins font-semibold rounded hover:bg-teal-600 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          New page
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={tableRows}
        state={pages.length === 0 ? 'empty' : 'idle'}
        emptyMessage="No pages found"
        emptyAction={{ label: 'Create First Page', onClick: () => {} }}
      />
    </div>
  )
}
