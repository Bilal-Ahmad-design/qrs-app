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

    const [usersRes, pagesRes, sectionsRes, submissionsRes, logsRes] = await Promise.all([
      fetch(`${baseUrl}/api/payload/users?limit=1`),
      fetch(`${baseUrl}/api/payload/pages?limit=1`),
      fetch(`${baseUrl}/api/payload/page-sections?limit=1`),
      fetch(`${baseUrl}/api/payload/form-submissions?limit=1`),
      fetch(`${baseUrl}/api/payload/audit-logs?limit=5&sort=-timestamp`),
    ])

    if (!usersRes.ok || !pagesRes.ok || !sectionsRes.ok || !submissionsRes.ok || !logsRes.ok) {
      throw new Error('One or more Payload requests failed')
    }

    const [usersData, pagesData, sectionsData, submissionsData, logsData] = await Promise.all([
      usersRes.json(),
      pagesRes.json(),
      sectionsRes.json(),
      submissionsRes.json(),
      logsRes.json(),
    ])

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
