import { NextResponse } from 'next/server'
import { requirePermission } from '@/lib/auth/authorization'
import { getCMSApiUrl } from '@/lib/cms-url'

const protectedCollections: Record<string, string> = {
  users: 'users:update',
  'form-submissions': 'forms:update',
  'audit-logs': 'audit:read',
}

async function authorize(path: string, method: string) {
  const collection = path.split('/')[0]
  const permission = protectedCollections[collection] || (method === 'GET' ? undefined : 'content:update')
  if (permission) await requirePermission(permission)
}

async function proxy(request: Request, params: Promise<{ slug: string[] }>) {
  try {
    const { slug } = await params
    const path = slug.join('/')
    await authorize(path, request.method)

    const requestUrl = new URL(request.url)
    const response = await fetch(getCMSApiUrl(`/api/payload/${path}${requestUrl.search}`), {
      method: request.method,
      headers: {
        'Content-Type': request.headers.get('content-type') || 'application/json',
        ...(request.headers.get('authorization') ? { authorization: request.headers.get('authorization')! } : {}),
      },
      body: request.method === 'GET' ? undefined : await request.text(),
    })

    return new NextResponse(response.body, {
      status: response.status,
      headers: { 'Content-Type': response.headers.get('content-type') || 'application/json' },
    })
  } catch (error) {
    const status = error instanceof Error && error.message === 'Forbidden' ? 403 : 502
    return NextResponse.json({ error: status === 403 ? 'Forbidden' : 'CMS request failed' }, { status })
  }
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  return proxy(request, params)
}

export async function POST(request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  return proxy(request, params)
}
