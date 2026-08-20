const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001'

export interface Settings {
  hero?: {
    title?: string
    subtitle?: string
    cta_text?: string
    background_image?: { id: string; url: string }
  }
  kpis?: {
    portfolio_tiv?: string
    monitored_policies?: string
    avg_var_reduction?: string
    active_users?: string
  }
  branding?: {
    company_name?: string
    tagline?: string
    support_email?: string
    support_phone?: string
  }
}

export async function getSettings(): Promise<Settings> {
  try {
    const response = await fetch(`${cmsUrl}/api/globals/settings`)
    if (!response.ok) return {}
    return response.json()
  } catch {
    return {}
  }
}

export async function getCachedSettings(revalidate = 3600): Promise<Settings> {
  const response = await fetch(`${cmsUrl}/api/globals/settings`, {
    next: { revalidate },
  })
  if (!response.ok) return {}
  return response.json()
}
