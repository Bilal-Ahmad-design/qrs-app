import { cache } from 'react'

const PAYLOAD_API = process.env.NEXT_PUBLIC_PAYLOAD_API || 'http://localhost:3000'
const REVALIDATE_TIME = 3600 // 1 hour

interface Settings {
  siteName: string
  tagline: string
  contactEmails: {
    support: string
    sales: string
    security: string
    legal: string
  }
  socialLinks: Array<{
    platform: string
    url: string
  }>
}

interface Navigation {
  headerNav: Array<{
    label: string
    url: string
    submenu?: Array<{
      label: string
      url: string
      icon?: string
    }>
  }>
  footerColumns: Array<{
    title: string
    links: Array<{
      label: string
      url: string
    }>
  }>
  ctaButton: {
    label: string
    url: string
    variant: string
  }
}

interface Homepage {
  hero: {
    heading: string
    subheading: string
    cta1Label: string
    cta1Url: string
  }
  kpiSection: {
    title: string
    kpis: Array<{
      value: string
      label: string
      description?: string
    }>
  }
}

// Cached fetch for settings
export const getSettings = cache(async (): Promise<Settings> => {
  try {
    const res = await fetch(`${PAYLOAD_API}/api/globals/settings`, {
      next: { revalidate: REVALIDATE_TIME, tags: ['settings'] },
    })
    if (!res.ok) throw new Error('Failed to fetch settings')
    return res.json()
  } catch (error) {
    console.error('Error fetching settings:', error)
    // Return defaults
    return {
      siteName: 'QRS',
      tagline: 'Quantitative Risk Systems',
      contactEmails: {
        support: 'support@qrs.app',
        sales: 'sales@qrs.app',
        security: 'security@qrs.app',
        legal: 'legal@qrs.app',
      },
      socialLinks: [],
    }
  }
})

// Cached fetch for navigation
export const getNavigation = cache(async (): Promise<Navigation> => {
  try {
    const res = await fetch(`${PAYLOAD_API}/api/globals/navigation`, {
      next: { revalidate: REVALIDATE_TIME, tags: ['navigation'] },
    })
    if (!res.ok) throw new Error('Failed to fetch navigation')
    return res.json()
  } catch (error) {
    console.error('Error fetching navigation:', error)
    // Return defaults
    return {
      headerNav: [],
      footerColumns: [],
      ctaButton: { label: 'Request Demo', url: '/demo', variant: 'primary' },
    }
  }
})

// Cached fetch for homepage
export const getHomepage = cache(async (): Promise<Homepage> => {
  try {
    const res = await fetch(`${PAYLOAD_API}/api/globals/homepage`, {
      next: { revalidate: REVALIDATE_TIME, tags: ['homepage'] },
    })
    if (!res.ok) throw new Error('Failed to fetch homepage')
    return res.json()
  } catch (error) {
    console.error('Error fetching homepage:', error)
    // Return defaults
    return {
      hero: {
        heading: 'QRS',
        subheading: 'Quantitative Risk Systems',
        cta1Label: 'Get Started',
        cta1Url: '/demo',
      },
      kpiSection: { title: 'Why QRS', kpis: [] },
    }
  }
})

// Tag-based revalidation function
export async function revalidateGlobal(slug: 'settings' | 'navigation' | 'homepage') {
  try {
    const res = await fetch(`${PAYLOAD_API}/api/revalidate?tag=${slug}`, {
      method: 'POST',
    })
    return res.ok
  } catch {
    return false
  }
}
