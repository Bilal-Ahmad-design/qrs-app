import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth/authorization'
import { getCMSApiUrl } from '@/lib/cms-url'

async function updateUser(req: NextRequest, id: string, method: 'PATCH' | 'DELETE') {
  const permission = method === 'PATCH' ? 'users:update' : 'users:delete'
  await requirePermission(permission)
  const response = await fetch(getCMSApiUrl(`/api/payload/users/${id}`), {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.PAYLOAD_API_KEY || ''}` },
    body: method === 'PATCH' ? JSON.stringify(await req.json()) : undefined,
  })
  if (!response.ok) throw new Error(`CMS API error: ${response.status}`)
  return method === 'PATCH' ? NextResponse.json(await response.json()) : NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { return await updateUser(req, (await params).id, 'PATCH') }
  catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'Forbidden' ? 'Forbidden' : 'Failed to update user' }, { status: error instanceof Error && error.message === 'Forbidden' ? 403 : 500 }) }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { return await updateUser(req, (await params).id, 'DELETE') }
  catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'Forbidden' ? 'Forbidden' : 'Failed to delete user' }, { status: error instanceof Error && error.message === 'Forbidden' ? 403 : 500 }) }
}
