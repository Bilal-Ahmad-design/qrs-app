'use client'

import { useEffect, useState } from 'react'
import { DashboardCard } from '@/components/dashboard/DashboardCard'

export default function EmailSettingsPage() {
  const [settings, setSettings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        setError(null)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 120000)

        let res
        try {
          res = await fetch('/api/payload/email-settings?limit=50&page=1&sort=-createdAt', {
            signal: controller.signal,
            cache: 'default',
          })
        } finally {
          clearTimeout(timeoutId)
        }

        if (!res.ok) throw new Error('Failed to fetch email settings')
        const data = await res.json()
        setSettings(data.docs || [])
      } catch (err) {
        console.error('Failed to fetch email settings:', err)
        setError('Unable to load email settings. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const getMaskedEmail = (email: string) => {
    const [name, domain] = email.split('@')
    const visibleChars = Math.ceil(name.length / 3)
    return name.substring(0, visibleChars) + '*'.repeat(name.length - visibleChars) + '@' + domain
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ink-800">Email Settings</h1>
        <p className="text-teal-700 mt-3 text-base font-medium">Configure email notifications and settings</p>
      </div>

      {error && (
        <div className="bg-status-error/10 border border-status-error rounded-lg p-4">
          <p className="text-status-error font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-status-error text-white rounded-lg text-sm font-semibold hover:bg-status-error/90 transition"
          >
            Retry
          </button>
        </div>
      )}

      <DashboardCard title={`Email Configurations (${settings.length})`} subtitle="All email settings">
        {loading ? (
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-4 bg-cream-100 rounded w-48"></div>
                  <div className="h-3 bg-cream-100 rounded w-96"></div>
                </div>
              ))}
          </div>
        ) : settings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">📧</p>
            <p className="text-teal-700 font-medium">No email settings configured</p>
            <p className="text-sm text-teal-700/70 mt-1">Add email configurations for notifications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {settings.map((setting) => (
              <div
                key={setting.id}
                className="p-4 border border-cream-100 rounded-lg hover:bg-cream-50 transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-ink-800">{setting.label || setting.name || 'Untitled'}</h3>

                    {setting.fromEmail && (
                      <p className="text-sm text-teal-700 mt-2">
                        <span className="font-semibold">From:</span> {getMaskedEmail(setting.fromEmail)}
                      </p>
                    )}

                    {setting.description && (
                      <p className="text-sm text-teal-700/70 mt-2">{setting.description}</p>
                    )}

                    {setting.type && (
                      <div className="flex gap-2 mt-3">
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded capitalize">
                          {setting.type}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    {setting.enabled !== undefined && (
                      <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${
                        setting.enabled
                          ? 'bg-status-ok/10 text-status-ok'
                          : 'bg-status-warn/10 text-status-warn'
                      }`}>
                        {setting.enabled ? '✓ Active' : 'Inactive'}
                      </span>
                    )}
                    <p className="text-xs text-teal-700/60 mt-2">
                      {new Date(setting.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>

      {/* Info */}
      <div className="bg-teal-50 border border-teal-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-ink-800 mb-2">Email Configuration</h3>
        <p className="text-ink-800 mb-4">
          Manage email settings for notifications, confirmations, and communications.
          Configure sender addresses, email templates, and notification preferences.
        </p>
        <p className="text-sm text-teal-700">
          ℹ️ Email settings shown here are fetched directly from Payload CMS in real-time.
        </p>
      </div>
    </div>
  )
}
