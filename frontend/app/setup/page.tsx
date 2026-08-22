'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const createTestUser = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    try {
      // Create a test user directly via signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'bilal@qrs.example.com',
          password: 'Admin123!',
          fullname: 'Bilal Ahmad',
        }),
      })

      if (response.ok) {
        setMessage('✅ Test user created! Redirecting to login...')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create user')
      }
    } catch (err) {
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-outfit font-bold text-cream-50 mb-2">QRS Setup</h1>
          <p className="text-cream-50 text-opacity-70">Create your first test user</p>
        </div>

        <div className="bg-ink-800 rounded-lg p-8 border border-teal-700 border-opacity-20">
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 p-3 bg-teal-500 bg-opacity-20 border border-teal-500 rounded text-teal-200 text-sm">
              {message}
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-poppins text-cream-50 mb-2">Email</label>
              <input
                type="email"
                value="bilal@qrs.example.com"
                disabled
                className="w-full px-3 py-2 bg-ink-700 border border-teal-700 border-opacity-20 rounded text-cream-50 font-poppins text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-poppins text-cream-50 mb-2">Password</label>
              <input
                type="password"
                value="Admin123!"
                disabled
                className="w-full px-3 py-2 bg-ink-700 border border-teal-700 border-opacity-20 rounded text-cream-50 font-poppins text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-poppins text-cream-50 mb-2">Name</label>
              <input
                type="text"
                value="Bilal Ahmad"
                disabled
                className="w-full px-3 py-2 bg-ink-700 border border-teal-700 border-opacity-20 rounded text-cream-50 font-poppins text-sm"
              />
            </div>
          </div>

          <button
            onClick={createTestUser}
            disabled={loading}
            className="w-full px-4 py-2 bg-teal-500 text-ink-900 font-poppins font-semibold rounded hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Create Test User'}
          </button>

          <p className="text-xs text-cream-50 text-opacity-60 text-center mt-4 font-poppins">
            Click the button above to create a test user account. You'll be redirected to login.
          </p>
        </div>
      </div>
    </div>
  )
}
