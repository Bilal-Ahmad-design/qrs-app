'use client'

import { useEffect, useState } from 'react'
import { DashboardCard } from '@/components/dashboard/DashboardCard'
import { TableRowSkeleton } from '@/components/dashboard/SkeletonLoader'

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        setError(null)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 30000)

        const res = await fetch('/api/payload/form-submissions?limit=25&sort=-submittedAt&page=1', {
          signal: controller.signal,
        })
        clearTimeout(timeoutId)

        if (!res.ok) throw new Error('Failed to fetch submissions')
        const data = await res.json()
        setSubmissions(data.docs || [])
      } catch (err) {
        console.error('Failed to fetch submissions:', err)
        setError('Unable to load form submissions. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-ink-800">Form Submissions</h1>
        <p className="text-teal-700 mt-3 text-base font-medium">All user form submissions and inquiries</p>
      </div>

      <DashboardCard title="Submissions" subtitle={loading ? 'Loading...' : `${submissions.length} total submissions`}>
        {error ? (
          <div className="text-center py-8">
            <p className="text-status-error font-medium">{error}</p>
          </div>
        ) : submissions.length === 0 && !loading ? (
          <div className="text-center py-8">
            <p className="text-teal-700 font-medium">No submissions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-cream-100">
                  <th className="text-left py-4 px-4 text-xs font-semibold text-ink-800 uppercase tracking-wide">Email</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-ink-800 uppercase tracking-wide">Form Type</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-ink-800 uppercase tracking-wide">Date</th>
                  <th className="text-left py-4 px-4 text-xs font-semibold text-ink-800 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array(5)
                      .fill(0)
                      .map((_, idx) => <TableRowSkeleton key={idx} />)
                  : submissions.map((sub) => (
                      <tr key={sub.id} className="border-b border-cream-100 hover:bg-cream-50 transition-colors duration-150">
                        <td className="py-4 px-4 text-sm text-ink-800 font-medium">{sub.email}</td>
                        <td className="py-4 px-4 text-sm text-ink-800">{sub.formType || 'General'}</td>
                        <td className="py-4 px-4 text-sm text-teal-700 font-medium">
                          {new Date(sub.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 text-sm">
                          <span className="px-3 py-1.5 bg-status-ok/10 text-status-ok rounded-lg text-xs font-semibold">
                            Received
                          </span>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    </div>
  )
}
