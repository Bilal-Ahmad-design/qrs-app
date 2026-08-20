// Boot-time environment validation for Payload CMS
// Fails fast if any required variable is missing or malformed

const requiredEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  PAYLOAD_SECRET: process.env.PAYLOAD_SECRET,
  JWT_SECRET: process.env.JWT_SECRET,
} as const

const missingVars = Object.entries(requiredEnv)
  .filter(([_, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  throw new Error(
    `Missing required CMS environment variables: ${missingVars.join(', ')}. ` +
    `Check .env.local and .env.example for required values.`
  )
}

// Validate format
if (!requiredEnv.DATABASE_URL!.startsWith('postgresql://')) {
  throw new Error('DATABASE_URL must be a valid PostgreSQL connection string')
}

if (requiredEnv.PAYLOAD_SECRET!.length < 32) {
  throw new Error('PAYLOAD_SECRET must be at least 32 characters long')
}

if (requiredEnv.JWT_SECRET!.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long')
}

export const env = {
  DATABASE_URL: requiredEnv.DATABASE_URL,
  PAYLOAD_SECRET: requiredEnv.PAYLOAD_SECRET,
  JWT_SECRET: requiredEnv.JWT_SECRET,
} as const
