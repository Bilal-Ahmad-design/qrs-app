// Boot-time environment validation
// Fails fast if any required variable is missing or malformed

const requiredEnv = {
  NEXT_PUBLIC_CMS_URL: process.env.NEXT_PUBLIC_CMS_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
} as const

const missingVars = Object.entries(requiredEnv)
  .filter(([_, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingVars.join(', ')}. ` +
    `Check .env.local and .env.example for required values.`
  )
}

// Validate format
if (!requiredEnv.DATABASE_URL.startsWith('postgresql://')) {
  throw new Error('DATABASE_URL must be a valid PostgreSQL connection string')
}

if (!requiredEnv.NEXT_PUBLIC_CMS_URL.startsWith('http')) {
  throw new Error('NEXT_PUBLIC_CMS_URL must be a valid HTTP URL')
}

if (requiredEnv.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long')
}

export const env = {
  CMS_URL: requiredEnv.NEXT_PUBLIC_CMS_URL,
  DATABASE_URL: requiredEnv.DATABASE_URL,
  JWT_SECRET: requiredEnv.JWT_SECRET,
} as const
