import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth/authorization'
import { getCMSApiUrl } from '@/lib/cms-url'

export async function GET() {
  try {
    await requirePermission('audit:read')
    const response = await fetch(getCMSApiUrl('/api/payload/audit-logs?limit=1000&sort=-createdAt'), {
      headers: { Authorization: `Bearer ${process.env.PAYLOAD_API_KEY || ''}` },
    })
    if (!response.ok) throw new Error(`CMS API error: ${response.status}`)
    const logs = (await response.json()).docs || []
    const csv = [
      ['Actor', 'Action', 'Collection', 'Resource', 'Timestamp'].map((value) => `"${value}"`).join(','),
      ...logs.map((log: any) => [log.actor, log.action, log.collection, log.resource, log.timestamp || log.createdAt].map((value) => `"${value || ''}"`).join(',')),
    ].join('\n')
    return new NextResponse(csv, { headers: { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': `attachment; filename="audit-logs-${new Date().toISOString().split('T')[0]}.csv"` } })
  } catch (error) {
    const status = error instanceof Error && error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: status === 403 ? 'Forbidden' : 'Failed to export audit logs' }, { status })
  }
}
