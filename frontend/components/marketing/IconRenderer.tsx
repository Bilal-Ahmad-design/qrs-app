'use client'

import {
  Zap,
  Lock,
  BarChart3,
  Globe,
  TrendingUp,
  Search,
  Link2,
  Settings,
  Building2,
  Briefcase,
  Target,
  Shield,
  Eye,
  Microscope,
  CheckCircle,
  Rocket,
  Users,
  Lightbulb,
} from 'lucide-react'

interface IconRendererProps {
  iconName?: string
  size?: number
  className?: string
  strokeWidth?: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const iconMap: Record<string, any> = {
  zap: Zap,
  lock: Lock,
  'bar-chart-3': BarChart3,
  globe: Globe,
  'trending-up': TrendingUp,
  search: Search,
  'link-2': Link2,
  settings: Settings,
  'building-2': Building2,
  briefcase: Briefcase,
  target: Target,
  shield: Shield,
  eye: Eye,
  microscope: Microscope,
  'check-circle': CheckCircle,
  rocket: Rocket,
  users: Users,
  lightbulb: Lightbulb,
}

export function IconRenderer({ iconName, size = 32, className = '', strokeWidth = 1.5 }: IconRendererProps) {
  if (!iconName) return null

  const IconComponent = iconMap[iconName.toLowerCase()]
  if (!IconComponent) {
    return null
  }

  return (
    <IconComponent
      size={size}
      className={className}
      strokeWidth={strokeWidth}
    />
  )
}
