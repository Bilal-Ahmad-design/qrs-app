'use client'

import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { ChartContainer } from '@/components/dashboard/ChartContainer'

const mockActivityData = [
  { name: 'Mon', visits: 4200, interactions: 2400 },
  { name: 'Tue', visits: 3800, interactions: 1398 },
  { name: 'Wed', visits: 2800, interactions: 9800 },
  { name: 'Thu', visits: 2700, interactions: 3908 },
  { name: 'Fri', visits: 1890, interactions: 4800 },
  { name: 'Sat', visits: 2390, interactions: 3800 },
  { name: 'Sun', visits: 3490, interactions: 4300 },
]

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ink-800">Analytics</h1>
        <p className="text-teal-700 mt-3 text-base font-medium">Website traffic and engagement analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <DashboardCard title="Visitor Traffic" subtitle="Last 30 days">
          <ChartContainer data={mockActivityData} dataKey1="visits" dataKey2="interactions" />
        </DashboardCard>

        <DashboardCard title="Engagement Metrics" subtitle="Last 30 days">
          <ChartContainer data={mockActivityData} dataKey1="interactions" label="Total Interactions" />
        </DashboardCard>
      </div>

      <DashboardCard title="Top Pages" subtitle="Most visited pages">
        <div className="space-y-4">
          {[
            { page: '/', views: 5234, engagement: '2.4 min' },
            { page: '/solutions', views: 3892, engagement: '1.8 min' },
            { page: '/about', views: 2156, engagement: '3.2 min' },
            { page: '/contact', views: 1456, engagement: '2.1 min' },
            { page: '/blog', views: 892, engagement: '5.4 min' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-4 px-4 border border-cream-100 rounded-lg hover:bg-cream-50 transition-colors duration-150">
              <div>
                <p className="text-sm font-semibold text-ink-800">{item.page}</p>
                <p className="text-xs text-teal-700 mt-2 font-medium">{item.views.toLocaleString()} views</p>
              </div>
              <span className="text-sm text-ink-800 font-mono font-semibold">{item.engagement}</span>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  )
}
