'use client'

import { useState, useEffect } from 'react'

interface MediaFile {
  id: string
  filename: string
  type: 'image' | 'video' | 'document'
  url: string
  size: number
  createdAt: string
  width?: number
  height?: number
}

interface MediaGridProps {
  type?: 'image' | 'video' | 'document'
  columns?: number
}

export default function MediaGrid({ type, columns = 3 }: MediaGridProps) {
  const [media, setMedia] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true)
        const url = type ? `/api/media?type=${type}` : '/api/media'
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error('Failed to fetch media')
        }

        const data = await response.json()
        setMedia(data.docs || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [type])

  if (loading) {
    return <div className="text-center text-slate-400">Loading media...</div>
  }

  if (error) {
    return <div className="text-red-400">{error}</div>
  }

  if (!media.length) {
    return (
      <div className="text-center text-slate-400 py-8">
        No media files found. Add files to `public/media/{type}s/`
      </div>
    )
  }

  return (
    <div className={`grid gap-4`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {media.map((file) => (
        <div key={file.id} className="bg-slate-700 rounded border border-slate-600 overflow-hidden hover:border-teal-500 transition-colors">
          {/* Preview */}
          <div className="bg-slate-800 aspect-video flex items-center justify-center overflow-hidden">
            {file.type === 'image' ? (
              <img
                src={file.url}
                alt={file.filename}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/qrs-wordmark.webp'
                }}
              />
            ) : file.type === 'video' ? (
              <div className="flex flex-col items-center justify-center gap-2">
                <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                <span className="text-xs text-slate-400">Video</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-2">
                <svg className="w-8 h-8 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0113 3.414L15.586 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                <span className="text-xs text-slate-400">Document</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="p-3">
            <p className="font-medium text-sm text-white truncate">{file.filename}</p>
            <p className="text-xs text-slate-400 mt-1">
              {(file.size / 1024).toFixed(1)} KB
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {new Date(file.createdAt).toLocaleDateString()}
            </p>

            {/* Actions */}
            <div className="mt-3 flex gap-2">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-2 py-1 bg-teal-600 hover:bg-teal-700 text-white text-xs rounded transition-colors"
              >
                View
              </a>
              <a
                href={file.url}
                download
                className="flex-1 px-2 py-1 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded transition-colors"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
