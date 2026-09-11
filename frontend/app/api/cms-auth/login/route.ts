export const runtime = 'nodejs'

import { getPayloadSingleton } from '@/cms/singleton'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    const payload = await getPayloadSingleton()

    try {
      // Use Payload's login method for the 'users' collection
      const result = await payload.login({
        collection: 'users',
        data: {
          email,
          password,
        },
      })

      return new Response(
        JSON.stringify({
          token: result.token,
          user: result.user,
          exp: result.exp,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      )
    } catch (error: any) {
      console.error('[CMS Auth] Login error:', error.message)
      return new Response(
        JSON.stringify({
          error: error.message || 'Invalid credentials',
        }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('[CMS Auth] Request error:', error)
    return new Response(
      JSON.stringify({ error: 'Server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
