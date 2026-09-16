'use client'

import { useEffect, useState } from 'react'
import { MetricCard } from '../MetricCard'
import { DashboardCard } from '../DashboardCard'

interface DashboardOverviewProps {
  user: any
}

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPages: 0,
    totalSections: 0,
    totalSubmissions: 0,
    recentLogs: [] as any[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch real data from Payload
        const [usersRes, pagesRes, sectionsRes, submissionsRes, logsRes] = await Promise.all([
          fetch('/api/payload/users?limit=1&page=1'),
          fetch('/api/payload/pages?limit=1&page=1'),
          fetch('/api/payload/page-sections?limit=1&page=1'),
          fetch('/api/payload/form-submissions?limit=1&page=1'),
          fetch('/api/payload/audit-logs?limit=10&sort=-timestamp'),
        ])

        const usersData = await usersRes.json()
        const pagesData = await pagesRes.json()
        const sectionsData = await sectionsRes.json()
        const submissionsData = await submissionsRes.json()
        const logsData = await logsRes.json()

        setStats({
          totalUsers: usersData.totalDocs || 0,
          totalPages: pagesData.totalDocs || 0,
          totalSections: sectionsData.totalDocs || 0,
          totalSubmissions: submissionsData.totalDocs || 0,
          recentLogs: (logsData.docs || []).slice(0, 5),
        })
      } catch (err) {
        console.error('Failed to fetch dashboard stats:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatTimeAgo = (date: string) => {
    const now = new Date()
    const then = new Date(date)
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div>
        <h1 className="text-4xl font-bold text-ink-800">Welcome back, {user?.fullname || 'User'}</h1>
        <p className="text-teal-700 mt-3 text-base font-medium">CMS Overview & Quick Stats</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Users" value={stats.totalUsers} icon="👥" />
        <MetricCard label="Published Pages" value={stats.totalPages} icon="📄" />
        <MetricCard label="Page Sections" value={stats.totalSections} icon="📐" />
        <MetricCard label="Form Submissions" value={stats.totalSubmissions} icon="📝" />
      </div>

      {/* Recent Activity */}
      <DashboardCard title="Recent CMS Activity" subtitle={`Latest ${stats.recentLogs.length} actions`}>
        {loading ? (
          <div className="text-center py-8 text-teal-700">Loading activity...</div>
        ) : stats.recentLogs.length === 0 ? (
          <div className="text-center py-8 text-teal-700">No activity yet</div>
        ) : (
          <div className="space-y-4">
            {stats.recentLogs.map((log, idx) => (
              <div key={idx} className="flex items-start justify-between py-4 px-4 border border-cream-100 rounded-lg hover:bg-cream-50 transition">
                <div>
                  <p className="text-sm font-semibold text-ink-800">{log.collectionName}</p>
                  <p className={`text-sm font-bold mt-1 ${
                    log.action === 'create' ? 'text-status-ok' :
                    log.action === 'delete' ? 'text-status-error' :
                    log.action === 'update' ? 'text-status-warn' : 'text-teal-700'
                  }`}>
                    {log.action.toUpperCase()}
                  </p>
                  <p className="text-xs text-teal-700 mt-2">{log.userEmail}</p>
                </div>
                <span className="text-xs text-teal-700/70 whitespace-nowrap">
                  {formatTimeAgo(log.timestamp)}
                </span>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>

      {/* Quick Info */}
      <DashboardCard title="System Status">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
            <p className="text-xs text-teal-700 mb-2 font-semibold">Logged In As</p>
            <p className="text-lg font-bold text-ink-800">{user?.email || 'Unknown'}</p>
            <p className="text-sm text-teal-700 mt-1 capitalize">{user?.role || 'User'}</p>
          </div>
          <div className="p-4 bg-status-ok/10 rounded-lg border border-status-ok/20">
            <p className="text-xs text-status-ok mb-2 font-semibold">System</p>
            <p className="text-lg font-bold text-ink-800">Operational</p>
            <p className="text-sm text-teal-700 mt-1">Database: Connected</p>
          </div>
          <div className="p-4 bg-cream-100 rounded-lg border border-cream-200">
            <p className="text-xs text-teal-700 mb-2 font-semibold">Last Sync</p>
            <p className="text-lg font-bold text-ink-800">Now</p>
            <p className="text-sm text-teal-700 mt-1">Real-time updates enabled</p>
          </div>
        </div>
      </DashboardCard>
    </div>
  )
}
