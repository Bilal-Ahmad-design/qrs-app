'use client'

import { ReactNode } from 'react'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'

interface DashboardLayoutProps {
  children: ReactNode
}

export default function Dashboard({ children }: DashboardLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>
}
