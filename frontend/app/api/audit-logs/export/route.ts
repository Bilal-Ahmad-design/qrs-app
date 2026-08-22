import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    // Fetch audit logs from Payload CMS
    const response = await fetch(
      'http://localhost:3000/api/audit-logs?limit=1000&sort=-createdAt',
      {
        headers: {
          'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY || ''}`,
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Payload API error: ${response.status}`)
    }

    const data = await response.json()
    const logs = data.docs || []

    // Convert to CSV
    const headers = ['Actor', 'Action', 'Collection', 'Resource', 'Timestamp']
    const rows = logs.map((log: any) => [
      log.actor || '',
      log.action || '',
      log.collection || '',
      log.resource || '',
      log.timestamp || log.createdAt || '',
    ])

    const csv = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((row: any[]) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n')

    const filename = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error('Audit logs export error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to export audit logs',
      },
      { status: 500 }
    )
  }
}
