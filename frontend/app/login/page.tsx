'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const isDev = process.env.NODE_ENV === 'development'
  const [email, setEmail] = useState(isDev ? 'jordan@qrs.example.com' : '')
  const [password, setPassword] = useState(isDev ? 'Password123!' : '')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      if (rememberMe) {
        localStorage.setItem('remembered-email', email)
      } else {
        localStorage.removeItem('remembered-email')
      }

      // Save user data for admin dashboard
      localStorage.setItem('payload-user', JSON.stringify(data.user))

      // Redirect to CMS admin dashboard
      router.push('/cms/admin')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ink-800 via-ink-800 to-ink-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-ink-700 rounded-md shadow-xl p-8 border border-teal-700">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-teal-500 rounded-md mb-4 mx-auto">
              <span className="text-xl font-bold text-ink-900 font-display">QRS</span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 font-display">QRS Admin</h1>
            <p className="text-teal-700">Sign in to your account</p>
          </div>

          {isDev && (
            <div className="mb-6 p-4 bg-teal-500/10 border border-teal-700 rounded-sm text-teal-300 text-sm">
              <strong>Dev Credentials:</strong> jordan@qrs.example.com / Password123!
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                required
                className="w-full px-4 py-2 bg-ink-800 border border-teal-700 rounded-sm text-white placeholder-teal-700/50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2 pr-10 bg-ink-800 border border-teal-700 rounded-sm text-white placeholder-teal-700/50 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-700 hover:text-teal-500 transition-colors cursor-pointer p-1"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded-sm border border-teal-700 bg-ink-800 cursor-pointer accent-teal-500"
              />
              <label htmlFor="remember-me" className="ml-2 text-sm text-white cursor-pointer hover:text-teal-500 transition-colors">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-teal-500 hover:bg-teal-600 text-ink-900 font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-base"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-teal-700">
            <div className="text-center">
              <Link href="/" className="text-sm text-teal-500 hover:text-teal-400 font-medium">
                ← Back to Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
