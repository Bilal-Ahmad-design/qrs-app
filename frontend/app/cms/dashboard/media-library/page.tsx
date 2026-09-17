'use client'

import { useEffect, useState } from 'react'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true)
        setError(null)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 120000)

        const res = await fetch('/api/payload/media?limit=50&page=1&sort=-createdAt', {
          signal: controller.signal,
          cache: 'default',
        })
        clearTimeout(timeoutId)

        if (!res.ok) throw new Error('Failed to fetch media')
        const data = await res.json()
        setMedia(data.docs || [])
      } catch (err) {
        console.error('Failed to fetch media:', err)
        setError('Unable to load media. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [])

  const getMediaType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase() || ''
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) return 'Image'
    if (['mp4', 'webm', 'mov', 'avi'].includes(ext)) return 'Video'
    return 'File'
  }

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'Image':
        return '🖼️'
      case 'Video':
        return '🎬'
      default:
        return '📄'
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ink-800">Media Library</h1>
        <p className="text-teal-700 mt-3 text-base font-medium">Manage images, videos, and files</p>
      </div>

      {error && (
        <div className="bg-status-error/10 border border-status-error rounded-lg p-4">
          <p className="text-status-error font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-status-error text-white rounded-lg text-sm font-semibold hover:bg-status-error/90 transition"
          >
            Retry
          </button>
        </div>
      )}

      <DashboardCard title={`Media Files (${media.length})`} subtitle="All uploaded media">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-video bg-cream-100 rounded-lg mb-2"></div>
                  <div className="h-4 bg-cream-100 rounded w-32"></div>
                  <div className="h-3 bg-cream-100 rounded w-24 mt-2"></div>
                </div>
              ))}
          </div>
        ) : media.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">📁</p>
            <p className="text-teal-700 font-medium">No media files found</p>
            <p className="text-sm text-teal-700/70 mt-1">Upload your first image or video to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {media.map((file) => {
              const mediaType = getMediaType(file.filename)
              const icon = getMediaIcon(mediaType)
              const fileSize = (file.filesize / 1024).toFixed(2)

              return (
                <div
                  key={file.id}
                  className="bg-cream-50 border border-cream-100 rounded-lg overflow-hidden hover:shadow-md transition"
                >
                  {/* Media Preview */}
                  <div className="aspect-video bg-ink-900 flex items-center justify-center overflow-hidden">
                    {mediaType === 'Image' && file.url ? (
                      <img
                        src={file.url}
                        alt={file.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-4xl">{icon}</div>
                    )}
                  </div>

                  {/* File Details */}
                  <div className="p-4">
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-xl flex-shrink-0">{icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-ink-800 truncate">{file.filename}</h4>
                        <p className="text-xs text-teal-700 mt-1">{mediaType}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-teal-700/70">
                      <p>Size: {fileSize} KB</p>
                      <p>Uploaded: {new Date(file.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </DashboardCard>

      {/* Info */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-ink-800 mb-2">Media Management</h3>
        <p className="text-ink-800 mb-4">
          Organize and manage all your media files including images, videos, and other assets.
          Media files can be referenced in pages, blog posts, and other content.
        </p>
        <p className="text-sm text-teal-700">
          ℹ️ Media files shown here are fetched directly from Payload CMS in real-time.
        </p>
      </div>
    </div>
  )
}
