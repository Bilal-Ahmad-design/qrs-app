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
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const turnstileToken = typeof body?.turnstileToken === 'string' ? body.turnstileToken : '';

    if (!email || !message) {
      return NextResponse.json(
        { success: false, error: 'Email and message are required.' },
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
      name,
      message,
      source: 'support-page',
    };

    // Store in form_submissions table
    await pool.query(
      `INSERT INTO form_submissions (form_type, data, email, ip_address, turnstile_verified, review_status)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      ['contact', JSON.stringify(submissionData), email, ipAddress, true, 'pending']
    );

    // TODO: Send email notification to support@qrsrisk.com

    return NextResponse.json({ success: true, message: 'Your support request has been received. We will respond shortly.' });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to save your message right now.' },
      { status: 500 },
    );
  }
}
