import { NextRequest, NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth/authorization'
import { getCMSApiUrl } from '@/lib/cms-url'

const collections = new Set(['pages', 'blog', 'media'])

async function mutateContent(req: NextRequest, collection: string, id: string, method: 'PATCH' | 'DELETE') {
  if (!collections.has(collection)) return NextResponse.json({ error: `Unknown collection: ${collection}` }, { status: 400 })
  await requirePermission(method === 'PATCH' ? 'content:update' : 'content:delete')
  const response = await fetch(getCMSApiUrl(`/api/payload/${collection}/${id}`), {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${process.env.PAYLOAD_API_KEY || ''}` },
    body: method === 'PATCH' ? JSON.stringify(await req.json()) : undefined,
  })
  if (!response.ok) throw new Error(`CMS API error: ${response.status}`)
  return method === 'PATCH' ? NextResponse.json(await response.json()) : NextResponse.json({ success: true })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ collection: string; id: string }> }) {
  try { const { collection, id } = await params; return await mutateContent(req, collection, id, 'PATCH') }
  catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'Forbidden' ? 'Forbidden' : 'Failed to update content' }, { status: error instanceof Error && error.message === 'Forbidden' ? 403 : 500 }) }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ collection: string; id: string }> }) {
  try { const { collection, id } = await params; return await mutateContent(req, collection, id, 'DELETE') }
  catch (error) { return NextResponse.json({ error: error instanceof Error && error.message === 'Forbidden' ? 'Forbidden' : 'Failed to delete content' }, { status: error instanceof Error && error.message === 'Forbidden' ? 403 : 500 }) }
}
