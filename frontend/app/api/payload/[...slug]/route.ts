/**
 * Payload CMS API Route Handler
 *
 * This route proxies all Payload CMS API requests
 * Runs at: /api/payload/...
 */

import payload from 'payload'

let initPromise: Promise<any>

async function initPayload() {
  if (!initPromise) {
    initPromise = import('@/cms/payload.config').then(({ default: config }) =>
      payload.init({
        config,
        secret: process.env.PAYLOAD_SECRET,
      })
    )
  }
  return initPromise
}

export async function GET(request: Request, { params }: { params: { slug: string[] } }) {
  const payloadInstance = await initPayload()
  const url = new URL(request.url)
  const path = `/${params.slug.join('/')}`

  return await payloadInstance.router.handle(
    new Request(new URL(`${url.origin}/api${path}${url.search}`, url.origin), {
      method: 'GET',
      headers: request.headers,
    })
  )
}

export async function POST(request: Request, { params }: { params: { slug: string[] } }) {
  const payloadInstance = await initPayload()
  const url = new URL(request.url)
  const path = `/${params.slug.join('/')}`
  const body = await request.clone().text()

  return await payloadInstance.router.handle(
    new Request(new URL(`${url.origin}/api${path}${url.search}`, url.origin), {
      method: 'POST',
      headers: request.headers,
      body,
    })
  )
}

export async function PUT(request: Request, { params }: { params: { slug: string[] } }) {
  const payloadInstance = await initPayload()
  const url = new URL(request.url)
  const path = `/${params.slug.join('/')}`
  const body = await request.clone().text()

  return await payloadInstance.router.handle(
    new Request(new URL(`${url.origin}/api${path}${url.search}`, url.origin), {
      method: 'PUT',
      headers: request.headers,
      body,
    })
  )
}

export async function DELETE(request: Request, { params }: { params: { slug: string[] } }) {
  const payloadInstance = await initPayload()
  const url = new URL(request.url)
  const path = `/${params.slug.join('/')}`

  return await payloadInstance.router.handle(
    new Request(new URL(`${url.origin}/api${path}${url.search}`, url.origin), {
      method: 'DELETE',
      headers: request.headers,
    })
  )
}
