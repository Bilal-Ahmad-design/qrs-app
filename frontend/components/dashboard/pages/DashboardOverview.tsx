'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { MetricCard } from '../MetricCard'
import { DashboardCard } from '../DashboardCard'

interface DashboardOverviewProps {
  user: any
}

// Cache stats for 5 minutes
const CACHE_DURATION = 5 * 60 * 1000
let cachedStats: any = null
let cacheTime = 0

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPages: 0,
    totalSections: 0,
    totalSubmissions: 0,
    recentLogs: [] as any[],
  })
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)

      // Check cache first
      if (cachedStats && Date.now() - cacheTime < CACHE_DURATION) {
        setStats(cachedStats)
        setLoading(false)
        return
      }

      // Single endpoint fetch - combines all 5 requests into 1
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 120000) // 120 second timeout for Payload startup

      let res
      try {
        res = await fetch('/api/dashboard/stats', {
          signal: controller.signal,
          cache: 'default',
        })
      } finally {
        clearTimeout(timeoutId)
      }

      if (!res.ok) throw new Error('Failed to fetch stats')

      const data = await res.json()

      const newStats = {
        totalUsers: data.totalUsers || 0,
        totalPages: data.totalPages || 0,
        totalSections: data.totalSections || 0,
        totalSubmissions: data.totalSubmissions || 0,
        recentLogs: data.recentLogs || [],
      }

      cachedStats = newStats
      cacheTime = Date.now()
      setStats(newStats)
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err)
      // Keep showing previous stats even if error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
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
