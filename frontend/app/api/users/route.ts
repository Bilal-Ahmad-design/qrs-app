import { NextRequest, NextResponse } from 'next/server'

interface User {
  name: string
  email: string
  role: string
  status: string
}

export async function POST(req: NextRequest) {
  try {
    const data: User = await req.json()

    if (!data.email || !data.name) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email' },
        { status: 400 }
      )
    }

    // Call Payload CMS API
    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY || ''}`,
      },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        role: data.role,
        status: data.status,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Payload API error: ${response.status} ${error}`)
    }

    const user = await response.json()
    return NextResponse.json(user)
  } catch (error) {
    console.error('Users POST error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create user' },
      { status: 500 }
    )
  }
}
