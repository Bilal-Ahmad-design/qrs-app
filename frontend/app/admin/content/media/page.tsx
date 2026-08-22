import { DataTable, DataTableColumn } from '@/components/admin/DataTable'
import { Badge } from '@/components/admin/Badge'
import { fetchMedia, type PayloadMedia } from '@/lib/admin/fetch-collections'
import { Plus, Image as ImageIcon } from 'lucide-react'

const columns: DataTableColumn[] = [
  { key: 'filename', label: 'Filename', width: '250px' },
  { key: 'type', label: 'Type', width: '120px' },
  { key: 'size', label: 'Size', width: '100px' },
  { key: 'created', label: 'Created', width: '150px' },
  { key: 'actions', label: 'Actions', width: '150px' },
]

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
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

function getMimeTypeLabel(mimeType: string): string {
  if (mimeType.startsWith('image/')) return 'Image'
  if (mimeType.startsWith('video/')) return 'Video'
  if (mimeType === 'application/pdf') return 'PDF'
  return 'File'
}

export default async function MediaPage() {
  const { docs: media, totalDocs } = await fetchMedia()

  const tableRows = media.map((file: PayloadMedia) => ({
    filename: (
      <div className="flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-teal-400" />
        <span>{file.filename}</span>
      </div>
    ),
    type: <Badge variant="info">{getMimeTypeLabel(file.mimeType)}</Badge>,
    size: formatFileSize(file.filesize),
    created: formatDate(file.createdAt),
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
          <h1 className="text-3xl font-outfit font-bold text-cream-50 mb-2">Media Library</h1>
          <p className="text-cream-50 text-opacity-70">
            Manage images, videos, and files ({totalDocs})
          </p>
        </div>
        <button className="px-4 py-2 bg-teal-500 text-ink-900 font-poppins font-semibold rounded hover:bg-teal-600 transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Upload media
        </button>
      </div>

      <DataTable
        columns={columns}
        rows={tableRows}
        state={media.length === 0 ? 'empty' : 'idle'}
        emptyMessage="No media files found"
      />
    </div>
  )
}
