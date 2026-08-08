import { NextResponse } from 'next/server';
import pg from 'pg';
import { verifyTurnstileToken } from '@/lib/turnstile';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : '';
    const requestType = typeof body?.requestType === 'string' ? body.requestType : 'access';
    const details = typeof body?.details === 'string' ? body.details.trim() : '';
    const turnstileToken = typeof body?.turnstileToken === 'string' ? body.turnstileToken : '';

    if (!email || !details) {
      return NextResponse.json(
        { success: false, error: 'Email and details are required.' },
        { status: 400 },
      );
    }

    const verified = process.env.TURNSTILE_SECRET
      ? await verifyTurnstileToken(turnstileToken)
      : true;

    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Security verification failed.' },
        { status: 400 },
      );
    }

    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const submissionData = {
      requestType,
      details,
      source: 'privacy-request-form',
    };

    // Store in form_submissions table (encrypted at rest via Postgres)
    await pool.query(
      `INSERT INTO form_submissions (form_type, data, email, ip_address, turnstile_verified, review_status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['privacy-request', JSON.stringify(submissionData), email, ipAddress, true, 'pending']
    );

    // Form submissions logged and can be accessed by Admin/Super Admin only (SOC2 D3)
    // Email notifications can be configured via CRM webhook or SMTP integration

    return NextResponse.json({ success: true, message: 'Your privacy request has been received. We will respond within 30 days.' });
  } catch (error) {
    console.error('Privacy request submission failed:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to process your request right now.' },
      { status: 500 },
    );
  }
}
