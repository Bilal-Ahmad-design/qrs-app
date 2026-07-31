import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';

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

    const verified = process.env.TURNSTILE_SECRET_KEY
      ? await verifyTurnstileToken(turnstileToken, request.headers.get('x-forwarded-for') || undefined)
      : true;

    if (!verified) {
      return NextResponse.json(
        { success: false, error: 'Security verification failed.' },
        { status: 400 },
      );
    }

    const submission = {
      formType: 'privacy-request',
      email,
      data: {
        requestType,
        details,
        source: 'privacy-request-form',
        submittedAt: new Date().toISOString(),
      },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      turnstileVerified: true,
    };

    console.log('Privacy request captured:', JSON.stringify(submission));

    return NextResponse.json({ success: true, message: 'Privacy request received.' });
  } catch (error) {
    console.error('Privacy request submission failed:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to process your request right now.' },
      { status: 500 },
    );
  }
}
