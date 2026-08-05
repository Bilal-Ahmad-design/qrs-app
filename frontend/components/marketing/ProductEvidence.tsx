'use client'

import { useState } from 'react'

interface EvidenceItem {
  title?: string
  description?: string
  imageUrl?: string
  [key: string]: any
}

interface ProductEvidenceProps {
  items?: EvidenceItem[]
  title?: string
  description?: string
}

export function ProductEvidence({ items, title, description }: ProductEvidenceProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const itemsArray = items || []
  const selectedItem = itemsArray[selectedIndex] || itemsArray[0]

  // Map placeholder URLs to use next/image compatible paths
  const getImageUrl = (url?: string) => {
    if (!url) return '/placeholder-product.png'
    // If URL is a placeholder path, it's already correct
    // If it's from CMS with full URL, use it as-is
    return url
  }

  return (
    <section className="py-24 lg:py-40 bg-light-bg-primary">
      <div className="max-w-screen-xl mx-auto px-6">
        {(title || description) && (
          <div className="text-center mb-20">
            {title && (
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 text-light-text-primary">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-base sm:text-lg lg:text-xl text-light-text-secondary max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
          {/* Main Preview */}
          <div className="lg:col-span-2">
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-ink-900 border border-teal-700/30 aspect-video">
              <img
                src={getImageUrl(selectedItem.imageUrl)}
                alt={selectedItem.title || 'Product screenshot'}
                className="w-full h-full object-cover"
              />
              {/* Overlay for placeholder images */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
            </div>
            <div className="mt-6">
              <h3 className="text-2xl font-bold text-light-text-primary mb-2">
                {selectedItem.title}
              </h3>
              <p className="text-lg text-light-text-secondary">
                {selectedItem.description}
              </p>
            </div>
          </div>

          {/* Thumbnail Selector */}
          <div className="space-y-3">
            <div className="text-sm font-semibold text-light-text-secondary uppercase tracking-wider">
              Product Views
            </div>
            <div className="space-y-2">
              {itemsArray.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    selectedIndex === index
                      ? 'border-light-accent-primary bg-light-accent-light/10'
                      : 'border-light-accent-light/20 bg-white hover:border-light-accent-primary/50'
                  }`}
                >
                  <div className="text-sm font-semibold text-light-text-primary">
                    {item.title}
                  </div>
                  <div className="text-xs text-light-text-secondary mt-1">
                    {item.description}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
