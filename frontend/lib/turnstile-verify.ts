/**
 * Server-side Cloudflare Turnstile token verification
 */

const TURNSTILE_API_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

interface TurnstileVerifyResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  error_codes?: string[]
  score?: number
  score_reason?: string[]
}

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!token) return false

  const secret = process.env.TURNSTILE_SECRET
  if (!secret) {
    console.warn('TURNSTILE_SECRET not configured, skipping verification')
    return true // Allow if not configured
  }

  try {
    const response = await fetch(TURNSTILE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret,
        response: token,
      }),
    })

    if (!response.ok) {
      console.error('Turnstile API error:', response.statusText)
      return false
    }

    const data: TurnstileVerifyResponse = await response.json()
    return data.success
  } catch (error) {
    console.error('Turnstile verification error:', error)
    return false
  }
}
