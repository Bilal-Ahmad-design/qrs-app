// Typed environment variable access with validation.
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue || '';
}

export const env = {
  NEXT_PUBLIC_SITE_URL: getEnv('NEXT_PUBLIC_SITE_URL', 'https://qrsrisk.com'),
  NEXT_PUBLIC_CMS_URL: process.env.NEXT_PUBLIC_CMS_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || (process.env.NODE_ENV !== 'production' ? 'http://localhost:3001' : ''),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
};

export function getCMSAssetUrl(path?: string): string | undefined {
  if (!path) return undefined

  const cmsUrl = (env.NEXT_PUBLIC_CMS_URL || (process.env.NODE_ENV !== 'production' ? 'http://localhost:3001' : '')).replace(/\/$/, '')
  if (!cmsUrl) throw new Error('NEXT_PUBLIC_PAYLOAD_URL or NEXT_PUBLIC_CMS_URL must be configured in production')

  if (/^https?:\/\/localhost(?::\d+)?(?:\/|$)/.test(path)) {
    const { pathname, search, hash } = new URL(path)
    return `${cmsUrl}${pathname}${search}${hash}`
  }

  if (path.startsWith('http')) return path
  return `${cmsUrl}${path.startsWith('/') ? path : `/${path}`}`
}
