'use client'

import { useState } from 'react'

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [fullname, setFullname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Passwords do not match')
      setMessageType('error')
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters')
      setMessageType('error')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fullname, email, password })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Account created! Redirecting to dashboard...')
        setMessageType('success')
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        setMessage(data.error || 'Signup failed')
        setMessageType('error')
      }
    } catch (error) {
      setMessage('Error: ' + (error instanceof Error ? error.message : 'Connection failed'))
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.logo}>
            <img src="/qrs-wordmark.webp" alt="QRS Logo" style={styles.logoImg} />
            <p style={styles.logoText}>Create Account</p>
          </div>

          {message && (
            <div style={{
              ...styles.message,
              ...(messageType === 'error' ? styles.messageError : styles.messageSuccess)
            }}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label htmlFor="fullname" style={styles.label}>Full Name</label>
              <input
                type="text"
                id="fullname"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                required
                placeholder="John Doe"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="email" style={styles.label}>Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@qrs.com"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="password" style={styles.label}>Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={styles.input}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  👁️
                </button>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label htmlFor="confirmPassword" style={styles.label}>Confirm Password</label>
              <div style={styles.passwordWrapper}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={styles.input}
                />
                <button
                  type="button"
                  style={styles.passwordToggle}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  👁️
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnDisabled : {})
              }}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div style={styles.link}>
            Already have an account? <a href="/login" style={styles.linkText}>Sign in</a>
          </div>
        </div>
      </div>
    </div>
  )
}

const styles = {
  body: {
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    background: 'linear-gradient(135deg, #0C0D0E 0%, #1B3B3A 100%)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#FFFFFF',
    margin: 0,
    padding: 0,
  },
  container: {
    width: '100%',
    maxWidth: '420px',
    padding: '20px',
  },
  card: {
    background: '#1B3B3A',
    padding: '48px 40px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
    border: '1px solid #29908A',
  },
  logo: {
    textAlign: 'center' as const,
    marginBottom: '40px',
  },
  logoImg: {
    height: '48px',
    width: 'auto',
    marginBottom: '16px',
    filter: 'brightness(0.95)',
  },
  logoText: {
    color: '#69727d',
    fontSize: '14px',
    fontWeight: 400,
    margin: 0,
  },
  message: {
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '24px',
    fontSize: '14px',
    borderLeft: '3px solid',
  },
  messageError: {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#fca5a5',
    borderLeftColor: '#ef4444',
  },
  messageSuccess: {
    background: 'rgba(34, 197, 94, 0.1)',
    color: '#86efac',
    borderLeftColor: '#22c55e',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: 500,
    fontSize: '14px',
    color: '#FFFFFF',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    background: '#0C0D0E',
    border: '1px solid #29908A',
    borderRadius: '4px',
    color: '#FFFFFF',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
    transition: 'all 240ms cubic-bezier(0.2, 0, 0, 1)',
    boxSizing: 'border-box',
  } as React.CSSProperties,
  passwordWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  } as React.CSSProperties,
  passwordToggle: {
    position: 'absolute',
    right: '14px',
    background: 'none',
    border: 'none',
    color: '#5BBAB5',
    cursor: 'pointer',
    padding: '6px',
    fontSize: '18px',
    transition: 'all 240ms',
  } as React.CSSProperties,
  submitBtn: {
    width: '100%',
    padding: '14px 24px',
    background: '#5BBAB5',
    color: '#0C0D0E',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '14px',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 240ms cubic-bezier(0.2, 0, 0, 1)',
    minHeight: '44px',
  } as React.CSSProperties,
  submitBtnDisabled: {
    background: '#29908A',
    opacity: 0.7,
    cursor: 'not-allowed',
  },
  link: {
    textAlign: 'center',
    marginTop: '24px',
    fontSize: '14px',
  } as React.CSSProperties,
  linkText: {
    color: '#5BBAB5',
    textDecoration: 'none',
    fontWeight: 500,
    cursor: 'pointer',
  } as React.CSSProperties,
}
