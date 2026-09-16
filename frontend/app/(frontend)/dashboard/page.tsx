'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardOverview } from '@/components/dashboard/pages/DashboardOverview'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userJson = localStorage.getItem('payload-user')
        if (!userJson) {
          router.push('/cms/login')
          return
        }
        setUser(JSON.parse(userJson))
      } catch (err) {
        console.error('Auth check failed:', err)
        router.push('/cms/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-teal-700">Loading dashboard...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <DashboardOverview user={user} />
}
