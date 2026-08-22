import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullname } = await request.json()

    if (!email || !password || !fullname) {
      return NextResponse.json(
        { message: 'Email, password, and fullname are required' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters' },
        { status: 400 }
      )
    }

    // Mock user creation - replace with real Payload API call
    return NextResponse.json({
      token: 'mock-jwt-token-' + Date.now(),
      user: {
        id: Math.random().toString(36).substr(2, 9),
        email,
        fullname,
        role: 'user',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Signup failed', error: String(error) },
      { status: 500 }
    )
  }
}
