export function getCMSUrl(): string {
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL

  if (cmsUrl) {
    return cmsUrl.replace(/\/$/, '')
  }

  if (process.env.NODE_ENV !== 'production') {
    return 'http://localhost:3000'
  }

  throw new Error('NEXT_PUBLIC_PAYLOAD_URL or NEXT_PUBLIC_CMS_URL must be configured in production')
}

export function getCMSApiUrl(path: string): string {
  return new URL(path, `${getCMSUrl()}/`).toString()
}
