import { NextResponse } from 'next/server'
import { logAuditEntry } from '@/lib/audit'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown'

    const webhookData = {
      type: body.type || 'form-submission',
      email: body.email,
      form_type: body.form_type,
      received_at: new Date().toISOString(),
    }

    await logAuditEntry({
      tableName: 'form_submissions',
      recordId: 0,
      action: 'create',
      changes: webhookData,
      ipAddress,
    })

    return NextResponse.json({
      success: true,
      message: 'Webhook received and logged',
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('CRM webhook error:', error)
    return NextResponse.json(
      { success: false, error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
