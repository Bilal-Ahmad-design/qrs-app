'use client'

import { useState } from 'react'
import { FileText, BookOpen, Image } from 'lucide-react'
import { EditModal } from '@/components/admin/EditModal'

type ContentType = 'pages' | 'blog' | 'media'

const tabIcons: Record<ContentType, React.ReactNode> = {
  pages: <FileText className="w-4 h-4" />,
  blog: <BookOpen className="w-4 h-4" />,
  media: <Image className="w-4 h-4" />,
}

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<ContentType>('pages')
  const [editingItem, setEditingItem] = useState<{ id: string; title: string; status: string; author: string; modified: string } | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const contentData: Record<ContentType, Array<{ id: string; title: string; status: string; author: string; modified: string }>> = {
    pages: [
      { id: '1', title: 'Home', status: 'published', author: 'admin@example.com', modified: '2 days ago' },
      { id: '2', title: 'Platform', status: 'published', author: 'editor@example.com', modified: '5 hours ago' },
      { id: '3', title: 'Careers (Draft)', status: 'draft', author: 'editor@example.com', modified: '1 hour ago' },
      { id: '4', title: 'Blog Index', status: 'published', author: 'admin@example.com', modified: '1 week ago' },
      { id: '5', title: 'API Docs', status: 'draft', author: 'reviewer@example.com', modified: '3 days ago' },
    ],
    blog: [
      { id: '1', title: 'Getting Started with QRS', status: 'published', author: 'editor@example.com', modified: '2 hours ago' },
      { id: '2', title: 'Security Best Practices', status: 'published', author: 'admin@example.com', modified: '1 day ago' },
      { id: '3', title: 'Q4 Roadmap', status: 'draft', author: 'editor@example.com', modified: '4 hours ago' },
      { id: '4', title: 'Case Study: Enterprise Risk', status: 'published', author: 'reviewer@example.com', modified: '3 days ago' },
    ],
    media: [
      { id: '1', title: 'Hero Image', status: 'published', author: 'admin@example.com', modified: '1 week ago' },
      { id: '2', title: 'Product Screenshots', status: 'published', author: 'editor@example.com', modified: '5 days ago' },
      { id: '3', title: 'Team Photos', status: 'draft', author: 'reviewer@example.com', modified: '2 hours ago' },
    ],
  }

  const items = contentData[activeTab]

  const handleEdit = (item: typeof items[0]) => {
    setEditingItem(item)
    setIsModalOpen(true)
  }

  const handleSave = async (data: Record<string, any>) => {
    try {
      const response = await fetch(`/api/content/${activeTab}/${editingItem?.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save')
      }
    } catch (error) {
      throw error instanceof Error ? error : new Error('Failed to save changes')
    }
  }

  const editFields = activeTab === 'media'
    ? [
        { name: 'title', label: 'File Name', type: 'text' as const },
        { name: 'status', label: 'Status', type: 'select' as const, options: [
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
        ]},
      ]
    : [
        { name: 'title', label: 'Title', type: 'text' as const },
        { name: 'status', label: 'Status', type: 'select' as const, options: [
          { value: 'published', label: 'Published' },
          { value: 'draft', label: 'Draft' },
        ]},
        { name: 'author', label: 'Author Email', type: 'text' as const },
      ]

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
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Content Table */}
        <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal-700 border-opacity-20 bg-ink-700">
                  <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Author</th>
                  <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Modified</th>
                  <th className="text-right px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b border-teal-700 border-opacity-20 hover:bg-ink-700 transition-colors">
                    <td className="px-4 py-3 text-cream-50 font-poppins">{item.title}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-poppins ${
                          item.status === 'published'
                            ? 'bg-green-900 bg-opacity-30 text-green-400'
                            : 'bg-yellow-900 bg-opacity-30 text-yellow-400'
                        }`}
                      >
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-cream-50 text-opacity-80 font-mono text-xs">{item.author}</td>
                    <td className="px-4 py-3 text-cream-50 text-opacity-60 text-xs">{item.modified}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEdit(item)}
                        className="text-teal-400 hover:text-teal-300 text-xs font-poppins transition-colors"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <EditModal
        isOpen={isModalOpen}
        title={`Edit ${activeTab === 'media' ? 'Media' : activeTab === 'blog' ? 'Blog Post' : 'Page'}`}
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
