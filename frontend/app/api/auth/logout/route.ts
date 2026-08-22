import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

async function logLogout(userId: string, email: string) {
  try {
    const url = new URL('/api/payload/api/audit-logs', process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3000')

    await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actor: userId,
        action: 'logout',
        collection: 'users',
        email: email,
        description: `User ${email} logged out`,
      }),
    })
  } catch (error) {
    console.error('Error logging logout:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (session?.user) {
      await logLogout(session.user.id, session.user.email)
    }

    const response = NextResponse.json({ success: true })

    // Clear the session cookie
    response.cookies.set({
      name: 'payload-session',
      value: '',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Logout failed' },
      { status: 500 }
    )
  }
}
