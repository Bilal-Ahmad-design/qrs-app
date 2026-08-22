import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Mock authentication - replace with real Payload API call
    if (email === 'admin@example.com' && password === 'password123') {
      return NextResponse.json({
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          email: 'admin@example.com',
          fullname: 'Admin User',
          role: 'admin',
        },
      })
    }

    return NextResponse.json(
      { message: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { message: 'Login failed', error: String(error) },
      { status: 500 }
    )
  }
}
