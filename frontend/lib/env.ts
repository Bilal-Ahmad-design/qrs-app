// Typed environment variable access with validation
export function getEnv(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value || defaultValue || '';
}

export const env = {
  NEXT_PUBLIC_SITE_URL: getEnv('NEXT_PUBLIC_SITE_URL', 'https://qrsrisk.com'),
  NODE_ENV: getEnv('NODE_ENV', 'development'),
  PAYLOAD_SECRET: getEnv('PAYLOAD_SECRET'),
  DATABASE_URL: getEnv('DATABASE_URL'),
};
