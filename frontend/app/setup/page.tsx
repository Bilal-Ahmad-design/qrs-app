'use client'

import Link from 'next/link'

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-ink-900 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-outfit font-bold text-cream-50 mb-2">QRS Admin Setup</h1>
          <p className="text-cream-50 text-opacity-70">Development test credentials</p>
        </div>

        <div className="bg-ink-800 rounded-lg p-8 border border-teal-700 border-opacity-20">
          <div className="mb-8">
            <h2 className="text-xl font-outfit font-bold text-cream-50 mb-4">Ready to Log In</h2>
            <p className="text-cream-50 text-opacity-80 font-poppins mb-6">
              These test credentials are pre-configured and ready to use. Choose a role below and log in to the admin dashboard.
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="grid gap-4">
              {[
                {
                  email: 'jordan@qrs.example.com',
                  password: 'Password123!',
                  fullname: 'Jordan Markwith',
                  role: 'Super Admin',
                  desc: 'Full system access',
                },
                {
                  email: 'bilal@qrs.example.com',
                  password: 'Password123!',
                  fullname: 'Bilal Ahmad',
                  role: 'Admin',
                  desc: 'Operations & submissions',
                },
                {
                  email: 'editor@qrs.example.com',
                  password: 'Password123!',
                  fullname: 'Content Editor',
                  role: 'Editor',
                  desc: 'Create & edit content',
                },
                {
                  email: 'reviewer@qrs.example.com',
                  password: 'Password123!',
                  fullname: 'Content Reviewer',
                  role: 'Reviewer',
                  desc: 'Review & approve content',
                },
                {
                  email: 'readonly@qrs.example.com',
                  password: 'Password123!',
                  fullname: 'Read-Only User',
                  role: 'Read-Only',
                  desc: 'View-only access',
                },
              ].map(user => (
                <div
                  key={user.email}
                  className="p-4 bg-ink-700 border border-teal-700 border-opacity-20 rounded-lg hover:border-opacity-40 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-poppins font-semibold text-cream-50">{user.fullname}</p>
                      <p className="text-xs text-cream-50 text-opacity-60 font-poppins">{user.role}</p>
                      <p className="text-xs text-cream-50 text-opacity-50 font-mono mt-1">{user.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center mb-2">
                    <code className="text-xs bg-ink-900 px-2 py-1 rounded text-teal-300 font-mono flex-1">
                      {user.email}
                    </code>
                  </div>
                  <div className="flex gap-2 items-center">
                    <code className="text-xs bg-ink-900 px-2 py-1 rounded text-teal-300 font-mono flex-1">
                      {user.password}
                    </code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/login"
            className="block w-full px-4 py-3 bg-teal-500 text-ink-900 font-poppins font-semibold rounded hover:bg-teal-600 transition-colors text-center"
          >
            Go to Login
          </Link>

          <p className="text-xs text-cream-50 text-opacity-60 text-center mt-4 font-poppins">
            All test users share the same password. Choose any email above and use <code className="bg-ink-700 px-1 rounded">Password123!</code>
          </p>
        </div>
      </div>
    </div>
  )
}
