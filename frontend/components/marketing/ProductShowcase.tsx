'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ProductShowcaseProps {
  title?: string
  description?: string
  imageUrl?: string
  videoUrl?: string
  posterUrl?: string
  caption?: string
  reducedMotion?: boolean
  showPlayButton?: boolean
}

export function ProductShowcase({
  title,
  description,
  imageUrl = '/placeholder-product.png',
  videoUrl,
  posterUrl,
  caption,
  reducedMotion = true,
  showPlayButton = true,
}: ProductShowcaseProps) {
  const [isPlaying, setIsPlaying] = useState(false)

  const shouldAutoplay = videoUrl && !reducedMotion && typeof window !== 'undefined' && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div className="space-y-6">
      {title && (
        <div className="space-y-3">
          <h2 className="text-3xl lg:text-4xl font-bold text-ink-900">
            {title}
          </h2>
          {description && (
            <p className="text-lg text-text-muted max-w-2xl">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Media Container */}
      <div className="relative rounded-xl overflow-hidden shadow-xl bg-black border border-teal-200">
        {videoUrl && !isPlaying ? (
          <div className="relative w-full aspect-video bg-gray-900">
            {/* Poster Image */}
            {posterUrl && (
              <Image
                src={posterUrl}
                alt="Video poster"
                fill
                className="object-cover"
              />
            )}
            {!posterUrl && imageUrl && (
              <Image
                src={imageUrl}
                alt="Product showcase"
                fill
                className="object-cover"
              />
            )}

            {/* Play Button Overlay */}
            {showPlayButton && (
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition-all group"
                aria-label="Play video"
              >
                <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg
                    className="w-8 h-8 text-ink-900 ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            )}
          </div>
        ) : videoUrl && isPlaying ? (
          <div className="relative w-full aspect-video">
            <video
              autoPlay
              controls
              poster={posterUrl || imageUrl}
              className="w-full h-full object-cover"
              onEnded={() => setIsPlaying(false)}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        ) : (
          <div className="relative w-full aspect-video">
            <Image
              src={imageUrl}
              alt="Product showcase"
              fill
              className="object-cover"
            />
          </div>
        )}
      </div>

      {/* Caption */}
      {caption && (
        <p className="text-sm text-text-muted text-center italic">
          {caption}
        </p>
      )}
    </div>
  )
}
