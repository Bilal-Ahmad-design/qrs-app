/**
 * Health Check Endpoint
 *
 * Used by Docker health checks, load balancers, and monitoring systems.
 * Returns application status and basic runtime information.
 */

export async function GET() {
  try {
    return Response.json(
      {
        status: 'healthy',
        service: 'QRS Platform',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        },
        version: process.env.npm_package_version || 'unknown',
      },
      { status: 200 }
    );
  } catch {
    return Response.json(
      {
        status: 'unhealthy',
        service: 'QRS Platform',
        error: 'Health check failed',
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
