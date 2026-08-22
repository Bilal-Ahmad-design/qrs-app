import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/cms/payload.config'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const validation = forgotPasswordSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error?.issues || [] },
        { status: 400 }
      )
    }

    const { email } = validation.data
    const payload = await getPayload({ config })

    // Find user by email
    const users = await payload.find({
      collection: 'users',
      where: { email: { equals: email } },
      depth: 0,
      overrideAccess: true,
    })

    // Don't reveal if email exists or not (security)
    if (users.docs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent.',
      })
    }

    const user = users.docs[0]

    // Use Payload's forgot password functionality
    await payload.forgotPassword({
      collection: 'users',
      data: { email },
      disableEmail: false,
      req: request as any,
    })

    return NextResponse.json({
      success: true,
      message: 'Password reset link sent to your email',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Failed to process forgot password request' },
      { status: 500 }
    )
  }
}
