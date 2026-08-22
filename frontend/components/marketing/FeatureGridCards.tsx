'use client'

import { DataCard } from '@/components/marketing/DataCard'
import { IconRenderer } from '@/components/marketing/IconRenderer'

interface Item {
  title?: string
  description?: string
  icon?: string
  status?: 'validated' | 'illustrative' | 'roadmap'
  [key: string]: any
}

interface FeatureGridCardsProps {
  items: Item[]
  backgroundStyle?: string
}

export function FeatureGridCards({ items, backgroundStyle }: FeatureGridCardsProps) {
  return (
    <>
      {items?.map((item) => (
        <DataCard
          key={item.title}
          variant={
            backgroundStyle === 'dark' || backgroundStyle === 'deep-dark'
              ? 'dark'
              : 'light'
          }
          status={item.status}
        >
          {item.icon && (
            <div className="mb-4 flex justify-start">
              <IconRenderer
                iconName={item.icon}
                size={40}
                className={
                  backgroundStyle === 'dark' || backgroundStyle === 'deep-dark'
                    ? 'text-teal-400'
                    : 'text-teal-600'
                }
              />
            </div>
          )}
          {item.title && (
            <h3 className="text-lg font-semibold mb-3">
              {item.title}
            </h3>
          )}
          {item.description && (
            <p className="text-sm">{item.description}</p>
          )}
          {item.link && (
            <a
              href={item.link}
              className="text-teal-600 font-semibold inline-flex items-center mt-4 group hover:translate-x-1 transition-transform"
            >
              Learn more →
            </a>
          )}
        </DataCard>
      ))}
    </>
  )
}
