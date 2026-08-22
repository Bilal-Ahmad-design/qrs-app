'use client'

import { useState } from 'react'
import { FileText, BookOpen, Image } from 'lucide-react'

type ContentType = 'pages' | 'blog' | 'media'

interface ContentItem {
  id: string
  title: string
  status?: string
  author?: string | { email: string }
  createdAt?: string
  updatedAt?: string
  filename?: string
  url?: string
}

interface ContentPageClientProps {
  pages: ContentItem[]
  blogPosts: ContentItem[]
  mediaFiles: ContentItem[]
}

const tabIcons: Record<ContentType, React.ReactNode> = {
  pages: <FileText className="w-4 h-4" />,
  blog: <BookOpen className="w-4 h-4" />,
  media: <Image className="w-4 h-4" />,
}

export default function ContentPageClient({ pages, blogPosts, mediaFiles }: ContentPageClientProps) {
  const [activeTab, setActiveTab] = useState<ContentType>('pages')

  const contentData: Record<ContentType, ContentItem[]> = {
    pages,
    blog: blogPosts,
    media: mediaFiles,
  }

  const items = contentData[activeTab]

  const getAuthorEmail = (author: unknown): string => {
    if (typeof author === 'string') return author
    if (author && typeof author === 'object' && 'email' in author) return (author as any).email
    return 'unknown'
  }

  const getModifiedTime = (item: ContentItem): string => {
    const date = new Date(item.updatedAt || item.createdAt || '')
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex-1 bg-ink-900">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="border-b border-teal-700 border-opacity-20 pb-6">
          <h1 className="text-5xl font-outfit font-bold text-cream-50 mb-2">Content Management</h1>
          <p className="text-sm text-cream-50 text-opacity-60">Manage pages, blog posts, and media</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 border-b border-teal-700 border-opacity-20">
          {(['pages', 'blog', 'media'] as ContentType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-3 font-poppins text-sm font-medium transition-colors relative ${
                activeTab === tab
                  ? 'text-cream-50 border-b-2 border-teal-500'
                  : 'text-cream-50 text-opacity-60 hover:text-opacity-100'
              }`}
            >
              {tabIcons[tab]}
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({contentData[tab].length})
            </button>
          ))}
        </div>

        {/* Content Table */}
        {items.length > 0 ? (
          <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-teal-700 border-opacity-20 bg-ink-700">
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">
                      {activeTab === 'media' ? 'Filename' : 'Title'}
                    </th>
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Status</th>
                    {activeTab !== 'media' && (
                      <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Author</th>
                    )}
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Modified</th>
                    <th className="text-right px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b border-teal-700 border-opacity-20 hover:bg-ink-700 transition-colors">
                      <td className="px-4 py-3 text-cream-50 font-poppins">
                        {activeTab === 'media' ? item.filename || item.title : item.title}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-1 rounded text-xs font-poppins ${
                            item.status === 'published'
                              ? 'bg-green-900 bg-opacity-30 text-green-400'
                              : 'bg-yellow-900 bg-opacity-30 text-yellow-400'
                          }`}
                        >
                          {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Draft'}
                        </span>
                      </td>
                      {activeTab !== 'media' && (
                        <td className="px-4 py-3 text-cream-50 text-opacity-80 font-mono text-xs">
                          {getAuthorEmail(item.author)}
                        </td>
                      )}
                      <td className="px-4 py-3 text-cream-50 text-opacity-60 text-xs">{getModifiedTime(item)}</td>
                      <td className="px-4 py-3 text-right">
                        <button className="text-teal-400 hover:text-teal-300 text-xs font-poppins">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-12 text-center">
            <p className="text-cream-50 text-opacity-60 font-poppins">No {activeTab} found</p>
          </div>
        )}
      </div>
    </div>
  )
}
