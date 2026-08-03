'use client'

import { useState, useEffect } from 'react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [loading, setLoading] = useState(false)

  // Load saved email on mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('qrs-login-email')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()

      if (res.ok) {
        // Save email if "Remember me" is checked
        if (rememberMe) {
          localStorage.setItem('qrs-login-email', email)
        } else {
          localStorage.removeItem('qrs-login-email')
        }

        setMessage('Login successful! Redirecting...')
        setMessageType('success')
        setTimeout(() => {
          const user = data.user
          const redirectUrl = ['admin', 'super-admin'].includes(user.role) ? '/admin' : '/dashboard'
          window.location.href = redirectUrl
        }, 1000)
      } else {
        setMessage(data.error || 'Login failed')
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
            <p style={styles.logoText}>Admin Portal</p>
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

            <div style={styles.rememberMeGroup}>
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={styles.checkbox}
              />
              <label htmlFor="rememberMe" style={styles.rememberMeLabel}>
                Remember my credentials
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.submitBtn,
                ...(loading ? styles.submitBtnDisabled : {})
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div style={styles.link}>
            Don't have an account? <a href="/signup" style={styles.linkText}>Create account</a>
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
  rememberMeGroup: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '24px',
    gap: '8px',
  } as React.CSSProperties,
  checkbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    accentColor: '#5BBAB5',
  } as React.CSSProperties,
  rememberMeLabel: {
    fontSize: '14px',
    color: '#FFFFFF',
    cursor: 'pointer',
    userSelect: 'none' as const,
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
