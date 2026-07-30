import { NextResponse } from 'next/server';
import { verifyTurnstileToken } from '@/lib/turnstile';

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
      formType: 'contact',
      email,
      data: {
        name,
        message,
        source: 'support-page',
        submittedAt: new Date().toISOString(),
      },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      turnstileVerified: true,
    };

    console.log('Support form submission captured:', JSON.stringify(submission));

    return NextResponse.json({ success: true, message: 'Support request received.' });
  } catch (error) {
    console.error('Contact form submission failed:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to save your message right now.' },
      { status: 500 },
    );
  }
}
