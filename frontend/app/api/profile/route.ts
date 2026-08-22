import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Mock token validation - replace with real JWT verification
    if (!token.startsWith('mock-jwt-token-')) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      )
    }

    // Mock user profile - replace with real Payload API call
    return NextResponse.json({
      user: {
        id: '1',
        email: 'admin@example.com',
        fullname: 'Admin User',
        role: 'admin',
      },
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to fetch profile', error: String(error) },
      { status: 500 }
    )
  }
}
