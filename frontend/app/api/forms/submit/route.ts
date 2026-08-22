import { NextRequest, NextResponse } from 'next/server'
import { formSchemas, type FormType } from '@/lib/forms/schemas'
import { sendEmail, emailTemplates, notifyAdmin } from '@/lib/email'
import { verifyTurnstile } from '@/lib/turnstile'
import { rateLimit } from '@/lib/rate-limit'

const rateLimiter = rateLimit({ maxRequests: 5, windowMs: 60000 })

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitError = rateLimiter(request)
    if (rateLimitError) return rateLimitError

    const body = await request.json()
    const { formType, ...data } = body

    // Validate form type
    if (!formType || !formSchemas[formType as FormType]) {
      return NextResponse.json(
        { error: 'Invalid form type' },
        { status: 400 }
      )
    }

    // Validate data against schema
    const schema = formSchemas[formType as FormType]
    const validation = schema.safeParse(data)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    // Verify Turnstile token
    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      request.ip ||
      'unknown'

    const turnstileValid = await verifyTurnstile(data.turnstileToken, clientIp)
    if (!turnstileValid) {
      return NextResponse.json(
        { error: 'Bot verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Send confirmation email
    const confirmationTemplate = emailTemplates[formType as FormType]
    if (confirmationTemplate) {
      await sendEmail({
        to: data.email,
        subject: `Confirmation: ${formType}`,
        html: confirmationTemplate(data.name || data.email),
        replyTo: process.env.ADMIN_EMAIL,
      })
    }

    // Notify admin
    await notifyAdmin(formType, validation.data)

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you! We will be in touch shortly.',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Form submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process form. Please try again.' },
      { status: 500 }
    )
  }
}
