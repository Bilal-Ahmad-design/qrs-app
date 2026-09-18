import { getPayload } from 'payload'
import config from '@/cms/payload.config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const start = Date.now()
  try {
    const payload = await getPayload({ config })

    const [usersData, pagesData, sectionsData, submissionsData, logsData] = await Promise.all([
      payload.find({ collection: 'users', limit: 100 }).catch(() => ({ totalDocs: 0, docs: [] })),
      payload.find({ collection: 'pages', limit: 100 }).catch(() => ({ totalDocs: 0, docs: [] })),
      payload.find({ collection: 'page-sections', limit: 100 }).catch(() => ({ totalDocs: 0, docs: [] })),
      payload.find({ collection: 'form-submissions', limit: 100 }).catch(() => ({ totalDocs: 0, docs: [] })),
      payload.find({ collection: 'audit-logs', limit: 5, sort: '-timestamp' }).catch(() => ({ totalDocs: 0, docs: [] })),
    ])

    const elapsed = Date.now() - start

    return Response.json({
      totalUsers: usersData.totalDocs || 0,
      totalPages: pagesData.totalDocs || 0,
      totalSections: sectionsData.totalDocs || 0,
      totalSubmissions: submissionsData.totalDocs || 0,
      recentLogs: logsData.docs || [],
      responseTimeMs: elapsed,
    })
  } catch (error) {
    console.error('Dashboard stats error:', error)
    return Response.json(
      {
        error: 'Failed to fetch dashboard stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
