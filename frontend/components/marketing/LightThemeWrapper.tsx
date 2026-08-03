/**
 * LightThemeWrapper
 * Wraps sections in the light institutional theme
 * Background: #F4F6F6 (light gray)
 * Text: Dark on light
 */

import { ReactNode } from 'react'

interface LightThemeWrapperProps {
  children: ReactNode
  className?: string
  sectionId?: string
}

export function LightThemeWrapper({
  children,
  className = '',
  sectionId,
}: LightThemeWrapperProps) {
  return (
    <section
      id={sectionId}
      className={`bg-light-bg-primary text-light-text-primary ${className}`}
    >
      {children}
    </section>
  )
}
