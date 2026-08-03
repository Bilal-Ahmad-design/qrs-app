export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

export function isTurnstileConfigured() {
  return Boolean(TURNSTILE_SITE_KEY);
}

export async function verifyTurnstileToken(token: string, ipAddress?: string) {
  // Support both TURNSTILE_SECRET and TURNSTILE_SECRET_KEY env vars
  const secret = process.env.TURNSTILE_SECRET || process.env.TURNSTILE_SECRET_KEY;

  if (!secret || !token) {
    console.warn('Turnstile not configured or token missing');
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret,
        response: token,
        remoteip: ipAddress || '',
      }),
    });

    if (!response.ok) {
      console.error('Turnstile API error:', response.statusText);
      return false;
    }

    const result = await response.json();
    if (!result?.success) {
      console.warn('Turnstile verification failed:', result?.error_codes);
    }
    return Boolean(result?.success);
  } catch (error) {
    console.error('Turnstile verification error:', error);
    return false;
  }
}
