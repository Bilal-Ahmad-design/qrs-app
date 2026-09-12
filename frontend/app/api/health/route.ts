/**
 * Health Check Endpoint
 *
 * Used by Docker health checks, load balancers, and monitoring systems.
 * Returns application status and basic runtime information.
 */

import { checkDatabaseHealth } from '@/cms/db-health'

export const runtime = 'nodejs'

export async function GET() {
  const start = Date.now()
  try {
    const dbHealth = await checkDatabaseHealth()
    const elapsed = Date.now() - start
    const isHealthy = dbHealth.ok

    return Response.json(
      {
        status: isHealthy ? 'healthy' : 'degraded',
        service: 'QRS Platform',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
        database: {
          ok: dbHealth.ok,
          message: dbHealth.message,
          checkTimeMs: dbHealth.time,
        },
        responseTimeMs: elapsed,
        version: process.env.npm_package_version || 'unknown',
      },
      { status: isHealthy ? 200 : 503 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return Response.json(
      {
        status: 'unhealthy',
        service: 'QRS Platform',
        error: 'Health check failed',
        message,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    )
  }
}
