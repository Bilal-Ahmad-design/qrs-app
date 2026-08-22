/**
 * Fetch content from Payload CMS (integrated in same Next.js app on port 3000)
 * All requests go through /api/payload proxy route handler
 */

// Use the deployed CMS endpoint for server-side build and render requests.
const getCMSURL = () => {
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL

  if (cmsUrl) {
    return cmsUrl.replace(/\/$/, '')
  }

  return 'http://localhost:3000'
}

interface CMSPage {
  id: string
  title: string
  slug: string
  content?: string
  description?: string
  layout?: Array<Record<string, any>>
  seo?: {
    title?: string
    description?: string
    keywords?: Array<{ keyword: string }>
    image?: { url: string }
  }
}

export async function getPageBySlug(slug: string): Promise<CMSPage | null> {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/pages?where[slug][equals]=${slug}`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      console.warn(`CMS fetch failed for slug "${slug}":`, response.statusText)
      return null
    }

    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.warn(`CMS fetch error for slug "${slug}":`, error)
    return null
  }
}

export async function getAllPages(): Promise<CMSPage[]> {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/pages?where[status][equals]=published&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      console.warn('CMS fetch failed for pages:', response.statusText)
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for pages:', error)
    return []
  }
}

export async function getValidationReports() {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/validation-reports?where[status][equals]=published&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for validation reports:', error)
    return []
  }
}

export async function getPerilStatuses() {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/peril-status?sort=-order`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for peril statuses:', error)
    return []
  }
}

export async function getRedirectBySource(sourcePath: string) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/redirects?where[sourcePath][equals]=${encodeURIComponent(sourcePath)}`,
      {
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.warn(`CMS fetch error for redirect "${sourcePath}":`, error)
    return null
  }
}

export async function getTrustCenter() {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/globals/trust-center`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return null
    }

    return await response.json()
  } catch (error) {
    console.warn('CMS fetch error for trust center:', error)
    return null
  }
}

export async function getProductShowcaseItems() {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/product-showcase?where[published][equals]=true&sort=order&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for product showcase:', error)
    return []
  }
}

export async function getProductShowcaseByCategory(category: string) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/product-showcase?where[category][equals]=${category}&where[published][equals]=true&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn(
      `CMS fetch error for product showcase category "${category}":`,
      error
    )
    return []
  }
}

export async function getSolutions() {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/solutions?where[published][equals]=true&sort=order&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for solutions:', error)
    return []
  }
}

export async function getSolutionByRole(roleTitle: string) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/solutions?where[roleTitle][equals]=${roleTitle}&where[published][equals]=true`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.warn(`CMS fetch error for solution role "${roleTitle}":`, error)
    return null
  }
}

export async function getRegulatoryCompliance() {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/regulatory-compliance?where[published][equals]=true&sort=region,framework&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for regulatory compliance:', error)
    return []
  }
}

export async function getRegulatoryByRegion(region: string) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/regulatory-compliance?where[region][equals]=${region}&where[published][equals]=true&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn(
      `CMS fetch error for regulatory compliance region "${region}":`,
      error
    )
    return []
  }
}

export async function getPlatformCapabilities() {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/platform-capability?where[published][equals]=true&sort=order&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for platform capabilities:', error)
    return []
  }
}

export async function getPlatformCapabilityByCategory(category: string) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/platform-capability?where[category][equals]=${category}&where[published][equals]=true&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn(
      `CMS fetch error for platform capability category "${category}":`,
      error
    )
    return []
  }
}

export async function getDocumentation() {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/documentation?where[published][equals]=true&sort=section,order&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for documentation:', error)
    return []
  }
}

export async function getDocumentationBySection(section: string) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/documentation?where[section][equals]=${section}&where[published][equals]=true&sort=order&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn(`CMS fetch error for documentation section "${section}":`, error)
    return []
  }
}

export async function getDocumentationBySlug(slug: string) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/documentation?where[slug][equals]=${slug}&where[published][equals]=true`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    return data.docs?.[0] || null
  } catch (error) {
    console.warn(`CMS fetch error for documentation slug "${slug}":`, error)
    return null
  }
}

export async function getPageSections(page: string) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/page-sections?page=${encodeURIComponent(page)}&published=true&sort=order&limit=100`,
      {
        next: { revalidate: 60 },
      }
    )

    if (!response.ok) {
      console.warn(`CMS fetch failed for page sections "${page}": ${response.statusText}`)
      return []
    }

    const data = await response.json()
    return data.docs || data || []
  } catch (error) {
    console.warn(`CMS fetch error for page sections "${page}":`, error)
    // Fallback: return empty array and let frontend use default sections
    return []
  }
}

export async function getPageSectionsByType(page: string, type: string) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/page-sections?where[page][equals]=${page}&where[sectionType][equals]=${type}&where[published][equals]=true&sort=order&limit=100`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn(
      `CMS fetch error for page sections "${page}" type "${type}":`,
      error
    )
    return []
  }
}

export async function getSettings() {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/globals/settings`,
      {
        next: { revalidate: 3600 },
      }
    )

    if (!response.ok) {
      console.warn('CMS fetch failed for settings:', response.statusText)
      return null
    }

    return await response.json()
  } catch (error) {
    console.warn('CMS fetch error for settings:', error)
    return null
  }
}

// Admin collection fetchers

export async function getBlogPosts(limit = 100) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/blog?limit=${limit}`,
      {
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for blog posts:', error)
    return []
  }
}

export async function getMediaFiles(limit = 100) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/media?limit=${limit}`,
      {
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for media:', error)
    return []
  }
}

export async function getAdminPages(limit = 100) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/pages?limit=${limit}`,
      {
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for admin pages:', error)
    return []
  }
}

export async function getFormSubmissions(limit = 100) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/form-submissions?limit=${limit}&sort=-createdAt`,
      {
        next: { revalidate: 0 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for form submissions:', error)
    return []
  }
}

export async function getAuditLogs(limit = 100) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/audit-logs?limit=${limit}&sort=-createdAt`,
      {
        next: { revalidate: 0 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for audit logs:', error)
    return []
  }
}

export async function getAdminUsers(limit = 100) {
  try {
    const response = await fetch(
      `${getCMSURL()}/api/payload/users?limit=${limit}&sort=-createdAt`,
      {
        next: { revalidate: 300 },
      }
    )

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.docs || []
  } catch (error) {
    console.warn('CMS fetch error for users:', error)
    return []
  }
}
