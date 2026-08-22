import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth/authorization'
import { getCMSApiUrl } from '@/lib/cms-url'

interface User {
  name: string
  email: string
  role: string
  status: string
}

export async function POST(req: NextRequest) {
  try {
    await requirePermission('users:create')
    const data: User = await req.json()
    if (!data.email || !data.name) {
      return NextResponse.json({ error: 'Missing required fields: name, email' }, { status: 400 })
    }

    const response = await fetch(getCMSApiUrl('/api/payload/users'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.PAYLOAD_API_KEY || ''}` },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error(`CMS API error: ${response.status}`)
    return NextResponse.json(await response.json())
  } catch (error) {
    const status = error instanceof Error && error.message === 'Forbidden' ? 403 : 500
    return NextResponse.json({ error: status === 403 ? 'Forbidden' : 'Failed to create user' }, { status })
  }
}
