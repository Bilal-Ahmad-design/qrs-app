import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await req.json()

    const response = await fetch(
      `http://localhost:3000/api/form-submissions/${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY || ''}`,
        },
        body: JSON.stringify(data),
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Payload API error: ${response.status} ${error}`)
    }

    const submission = await response.json()
    return NextResponse.json(submission)
  } catch (error) {
    console.error('Form submissions PATCH error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to update submission',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const response = await fetch(
      `http://localhost:3000/api/form-submissions/${id}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${process.env.PAYLOAD_API_KEY || ''}`,
        },
      }
    )

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Payload API error: ${response.status} ${error}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Form submissions DELETE error:', error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Failed to delete submission',
      },
      { status: 500 }
    )
  }
}
