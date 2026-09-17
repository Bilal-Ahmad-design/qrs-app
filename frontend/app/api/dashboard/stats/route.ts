export const runtime = 'nodejs'
export const dynamic = 'force-dynamic' // Don't pre-generate during build
export const revalidate = 300 // Cache for 5 minutes

export async function GET() {
  const start = Date.now()
  try {
    // Fetch all stats from Payload REST API in parallel
    const baseUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : `http://localhost:${process.env.PORT || 3000}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 45000) // 45s timeout for all fetches

    const [usersRes, pagesRes, sectionsRes, submissionsRes, logsRes] = await Promise.all([
      fetch(`${baseUrl}/api/payload/users?limit=1`, { signal: controller.signal }),
      fetch(`${baseUrl}/api/payload/pages?limit=1`, { signal: controller.signal }),
      fetch(`${baseUrl}/api/payload/page-sections?limit=1`, { signal: controller.signal }),
      fetch(`${baseUrl}/api/payload/form-submissions?limit=1`, { signal: controller.signal }),
      fetch(`${baseUrl}/api/payload/audit-logs?limit=5&sort=-timestamp`, { signal: controller.signal }),
    ])
    clearTimeout(timeoutId)

    // Parse responses with fallback for failed requests
    const usersData = usersRes.ok ? await usersRes.json() : { totalDocs: 0 }
    const pagesData = pagesRes.ok ? await pagesRes.json() : { totalDocs: 0 }
    const sectionsData = sectionsRes.ok ? await sectionsRes.json() : { totalDocs: 0 }
    const submissionsData = submissionsRes.ok ? await submissionsRes.json() : { totalDocs: 0 }
    const logsData = logsRes.ok ? await logsRes.json() : { docs: [] }

    const elapsed = Date.now() - start

    return Response.json(
      {
        totalUsers: usersData.totalDocs || 0,
        totalPages: pagesData.totalDocs || 0,
        totalSections: sectionsData.totalDocs || 0,
        totalSubmissions: submissionsData.totalDocs || 0,
        recentLogs: logsData.docs || [],
        responseTimeMs: elapsed,
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=300, s-maxage=300', // Cache 5 minutes
        },
      }
    )
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return Response.json(
      {
        error: 'Failed to fetch dashboard stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500, headers: { 'Cache-Control': 'no-cache' } }
    )
  }
}
