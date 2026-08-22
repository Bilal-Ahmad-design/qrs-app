// Turnstile verification (SOC 2 CC6.1 requirement)
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET_KEY
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''
export const isTurnstileConfigured = !!TURNSTILE_SECRET && !!TURNSTILE_SITE_KEY

export async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) {
    console.warn('Turnstile not configured, skipping verification')
    return true // Fail open in dev
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: ip,
      }),
    })

    if (!response.ok) {
      console.error('Turnstile API error:', response.status)
      return false
    }

    const data = await response.json()
    
    if (!data.success) {
      console.error('Turnstile verification failed:', data)
      return false
    }

    // Check error codes (SOC 2 compliance)
    if (data['error-codes']) {
      console.error('Turnstile errors:', data['error-codes'])
      return false
    }

    return true
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}
