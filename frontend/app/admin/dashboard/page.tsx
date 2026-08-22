'use client'

export default function DashboardPage() {
  const metrics = [
    { label: 'New submissions', value: '7', change: '+14%', period: '7d' },
    { label: 'Unresolved', value: '3', change: '−2', period: 'All' },
    { label: 'Published', value: '24', change: '+3', period: '7d' },
    { label: 'Edited', value: '12', change: '+18%', period: '7d' },
    { label: 'Active users', value: '6', change: '+2', period: '30d' },
    { label: 'Failed logins', value: '2', change: '+1', period: '24h' },
  ]

  const activity = [
    { actor: 'admin@example.com', action: 'published', resource: 'About page', time: '2 min' },
    { actor: 'editor@example.com', action: 'created', resource: 'Blog post', time: '45 min' },
    { actor: 'System', action: 'failed', resource: 'Email delivery', time: '1 hour' },
    { actor: 'reviewer@example.com', action: 'updated', resource: 'Settings', time: '2 hours' },
    { actor: 'admin@example.com', action: 'created', resource: 'New user', time: '3 hours' },
    { actor: 'editor@example.com', action: 'drafted', resource: 'Security page', time: '4 hours' },
    { actor: 'System', action: 'published', resource: 'Validation report', time: '5 hours' },
    { actor: 'reviewer@example.com', action: 'deleted', resource: 'Redirect rule', time: '6 hours' },
    { actor: 'admin@example.com', action: 'updated', resource: '3 pages', time: '7 hours' },
    { actor: 'editor@example.com', action: 'created', resource: 'Media asset', time: '8 hours' },
  ]

  const needsAttention = [
    { type: 'Unassigned', count: 3, link: '/admin/submissions?status=unassigned' },
    { type: 'Draft content', count: 5, link: '/admin/content?status=draft' },
    { type: 'Failed emails', count: 2, link: '/admin/logs?action=email_failed' },
    { type: 'Broken redirects', count: 1, link: '/admin/redirects?status=broken' },
  ]

  return (
    <div className="flex-1 bg-ink-900">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="border-b border-teal-700 border-opacity-20 pb-6">
          <h1 className="text-5xl font-outfit font-bold text-cream-50 mb-2">Dashboard</h1>
          <p className="text-sm text-cream-50 text-opacity-60">Operational metrics and recent activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {metrics.map((m, i) => (
            <a key={i} href="#" className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md p-4 hover:border-opacity-40 transition-colors h-22 flex flex-col justify-between cursor-pointer">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-cream-50 text-opacity-60 font-poppins">{m.label}</div>
                  <div className="text-xl font-mono font-semibold text-cream-50 mt-1">{m.value}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-cream-50 text-opacity-40 font-poppins">{m.period}</span>
                <span className={`text-xs font-mono ${m.change.startsWith('−') || m.change.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>{m.change}</span>
              </div>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-ink-800 border border-teal-700 border-opacity-20 rounded-md overflow-hidden">
            <div className="border-b border-teal-700 border-opacity-20 px-4 py-3">
              <h2 className="text-sm font-outfit font-semibold text-cream-50">Recent activity</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-teal-700 border-opacity-20 bg-ink-700">
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Actor</th>
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Action</th>
                    <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Resource</th>
                    <th className="text-right px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {activity.map((a, i) => (
                    <tr key={i} className="border-b border-teal-700 border-opacity-20 hover:bg-ink-700 transition-colors">
                      <td className="px-4 py-3 text-cream-50 font-mono text-xs">{a.actor}</td>
                      <td className="px-4 py-3"><span className="inline-block px-2 py-1 bg-teal-700 bg-opacity-20 text-teal-300 rounded text-xs font-poppins">{a.action}</span></td>
                      <td className="px-4 py-3 text-cream-50 text-opacity-80">{a.resource}</td>
                      <td className="px-4 py-3 text-right text-cream-50 text-opacity-60">{a.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-teal-700 border-opacity-20 px-4 py-3 bg-ink-700">
              <a href="/admin/logs" className="text-xs text-teal-500 font-poppins hover:text-teal-400">View all →</a>
            </div>
          </div>

          <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md overflow-hidden flex flex-col">
            <div className="border-b border-teal-700 border-opacity-20 px-4 py-3">
              <h2 className="text-sm font-outfit font-semibold text-cream-50">Needs attention</h2>
            </div>
            <div className="flex-1 space-y-2 p-4">
              {needsAttention.map((item, i) => (
                <a key={i} href={item.link} className="flex items-center justify-between p-3 bg-ink-700 hover:bg-ink-600 rounded transition-colors group">
                  <div>
                    <div className="text-sm text-cream-50 font-poppins">{item.type}</div>
                    <div className="text-xs text-cream-50 text-opacity-60">{item.count} items</div>
                  </div>
                  <div className="text-xs font-mono text-teal-400 group-hover:text-teal-300">→</div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-ink-800 border border-teal-700 border-opacity-20 rounded-md overflow-hidden">
          <div className="border-b border-teal-700 border-opacity-20 px-4 py-3">
            <h2 className="text-sm font-outfit font-semibold text-cream-50">Content overview</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-teal-700 border-opacity-20 bg-ink-700">
                  <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Collection</th>
                  <th className="text-center px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Published</th>
                  <th className="text-center px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Draft</th>
                  <th className="text-left px-4 py-3 text-xs font-poppins font-semibold text-cream-50 text-opacity-60">Updated</th>
                </tr>
              </thead>
              <tbody>
                {['Pages', 'Blog', 'Validation Reports', 'Media'].map((coll, i) => (
                  <tr key={i} className="border-b border-teal-700 border-opacity-20 hover:bg-ink-700 transition-colors">
                    <td className="px-4 py-3 text-cream-50 font-poppins">{coll}</td>
                    <td className="px-4 py-3 text-center text-cream-50 font-mono">{[24, 8, 12, 45][i]}</td>
                    <td className="px-4 py-3 text-center text-cream-50 font-mono">{[5, 2, 3, 18][i]}</td>
                    <td className="px-4 py-3 text-cream-50 text-opacity-60 text-sm">{['2 days ago', '5 hours', '1 hour', '30 min'][i]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
