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
  // CMS URL: use env var if set, otherwise empty string (defaults to relative /api/payload paths)
  // On Vercel production, leave NEXT_PUBLIC_CMS_URL unset to use frontend origin
  NEXT_PUBLIC_CMS_URL: process.env.NEXT_PUBLIC_CMS_URL || '',
  NODE_ENV: getEnv('NODE_ENV', 'development'),
};
