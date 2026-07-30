export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '';

export function isTurnstileConfigured() {
  return Boolean(TURNSTILE_SITE_KEY);
}

export async function verifyTurnstileToken(token: string, ipAddress?: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret || !token) {
    return false;
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ipAddress || '',
      }),
    });

    const result = await response.json();
    return Boolean(result?.success);
  } catch (error) {
    console.error('Turnstile verification failed:', error);
    return false;
  }
}
