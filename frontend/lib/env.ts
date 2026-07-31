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
  NEXT_PUBLIC_CMS_URL: getEnv('NEXT_PUBLIC_CMS_URL', 'http://localhost:3001'),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
};
