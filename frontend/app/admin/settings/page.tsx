'use client'

import { useState } from 'react'
import { Globe, Mail, Lock, Zap } from 'lucide-react'

type SettingsSection = 'site' | 'email' | 'security' | 'integrations'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('site')
  const [isDirty, setIsDirty] = useState(false)

  const sections: Array<{ id: SettingsSection; label: string; icon: React.ReactNode }> = [
    { id: 'site', label: 'Site Settings', icon: <Globe className="w-4 h-4" /> },
    { id: 'email', label: 'Email Configuration', icon: <Mail className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Lock className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Zap className="w-4 h-4" /> },
  ]

  return (
    <div className="flex-1 bg-ink-900">
      <div className="flex h-full">
        {/* Left Sidebar - Navigation */}
        <div className="w-56 border-r border-teal-700 border-opacity-20 bg-ink-800 p-6 space-y-1">
          <h1 className="text-2xl font-outfit font-bold text-cream-50 mb-8">Settings</h1>
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                if (isDirty) {
                  if (confirm('You have unsaved changes. Discard them?')) {
                    setActiveSection(section.id)
                    setIsDirty(false)
                  }
                } else {
                  setActiveSection(section.id)
                }
              }}
              className={`w-full flex items-center gap-3 px-4 py-2 rounded text-sm font-poppins transition-colors ${
                activeSection === section.id
                  ? 'bg-teal-500 text-ink-900 font-medium'
                  : 'text-cream-50 hover:bg-ink-700'
              }`}
            >
              <div className="flex-shrink-0">{section.icon}</div>
              <span>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-2xl space-y-6">
            {/* Site Settings */}
            {activeSection === 'site' && (
              <div className="space-y-6">
                <div className="border-b border-teal-700 border-opacity-20 pb-6">
                  <h2 className="text-3xl font-outfit font-bold text-cream-50">Site Settings</h2>
                  <p className="text-sm text-cream-50 text-opacity-60 mt-1">Configure your site information</p>
                </div>

                <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-poppins font-medium text-cream-50 mb-2">Site Name</label>
                    <input
                      type="text"
                      defaultValue="QRS Platform"
                      onChange={() => setIsDirty(true)}
                      className="w-full px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-poppins font-medium text-cream-50 mb-2">Site URL</label>
                    <input
                      type="text"
                      defaultValue="https://qrs-platform.com"
                      onChange={() => setIsDirty(true)}
                      className="w-full px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-poppins font-medium text-cream-50 mb-2">Description</label>
                    <textarea
                      defaultValue="Enterprise quantitative risk management platform"
                      onChange={() => setIsDirty(true)}
                      rows={3}
                      className="w-full px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Email Configuration */}
            {activeSection === 'email' && (
              <div className="space-y-6">
                <div className="border-b border-teal-700 border-opacity-20 pb-6">
                  <h2 className="text-3xl font-outfit font-bold text-cream-50">Email Configuration</h2>
                  <p className="text-sm text-cream-50 text-opacity-60 mt-1">Set up SMTP and email templates</p>
                </div>

                <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-poppins font-medium text-cream-50 mb-2">SMTP Host</label>
                    <input
                      type="text"
                      defaultValue="smtp.sendgrid.net"
                      onChange={() => setIsDirty(true)}
                      className="w-full px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-poppins font-medium text-cream-50 mb-2">Port</label>
                      <input
                        type="number"
                        defaultValue="587"
                        onChange={() => setIsDirty(true)}
                        className="w-full px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-poppins font-medium text-cream-50 mb-2">Protocol</label>
                      <select
                        onChange={() => setIsDirty(true)}
                        className="w-full px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins"
                      >
                        <option>TLS</option>
                        <option>SSL</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-poppins font-medium text-cream-50 mb-2">From Address</label>
                    <input
                      type="email"
                      defaultValue="noreply@qrs-platform.com"
                      onChange={() => setIsDirty(true)}
                      className="w-full px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="space-y-6">
                <div className="border-b border-teal-700 border-opacity-20 pb-6">
                  <h2 className="text-3xl font-outfit font-bold text-cream-50">Security</h2>
                  <p className="text-sm text-cream-50 text-opacity-60 mt-1">Manage authentication and security policies</p>
                </div>

                <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-6 space-y-4">
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        onChange={() => setIsDirty(true)}
                        className="rounded"
                      />
                      <span className="text-sm font-poppins text-cream-50">Require 2FA for all admin accounts</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        defaultChecked
                        onChange={() => setIsDirty(true)}
                        className="rounded"
                      />
                      <span className="text-sm font-poppins text-cream-50">Enable IP whitelisting</span>
                    </label>
                  </div>
                  <div>
                    <label className="block text-sm font-poppins font-medium text-cream-50 mb-2 mt-4">Session timeout (minutes)</label>
                    <input
                      type="number"
                      defaultValue="30"
                      onChange={() => setIsDirty(true)}
                      className="w-full px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Integrations */}
            {activeSection === 'integrations' && (
              <div className="space-y-6">
                <div className="border-b border-teal-700 border-opacity-20 pb-6">
                  <h2 className="text-3xl font-outfit font-bold text-cream-50">Integrations</h2>
                  <p className="text-sm text-cream-50 text-opacity-60 mt-1">Connect external services</p>
                </div>

                <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-poppins font-medium text-cream-50 mb-2">Slack Webhook URL</label>
                    <input
                      type="text"
                      placeholder="https://hooks.slack.com/..."
                      onChange={() => setIsDirty(true)}
                      className="w-full px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-poppins font-medium text-cream-50 mb-2">Stripe API Key</label>
                    <input
                      type="password"
                      placeholder="sk_live_..."
                      onChange={() => setIsDirty(true)}
                      className="w-full px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-poppins font-medium text-cream-50 mb-2">Analytics Tracking ID</label>
                    <input
                      type="text"
                      placeholder="GTM-XXXXXX"
                      onChange={() => setIsDirty(true)}
                      className="w-full px-3 py-2 rounded-md bg-ink-700 border border-teal-700 border-opacity-20 text-cream-50 text-sm font-poppins"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Save Bar */}
      {isDirty && (
        <div className="fixed bottom-0 left-0 right-0 bg-ink-800 border-t border-teal-700 border-opacity-20 px-6 py-4 flex items-center justify-end gap-4">
          <button
            onClick={() => setIsDirty(false)}
            className="px-4 py-2 text-cream-50 hover:text-opacity-80 text-sm font-poppins"
          >
            Discard
          </button>
          <button
            onClick={() => setIsDirty(false)}
            className="px-4 py-2.5 bg-teal-500 text-ink-900 rounded-md text-sm font-poppins font-medium hover:bg-teal-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  )
}
