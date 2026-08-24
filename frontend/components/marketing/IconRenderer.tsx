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

  const normalizedName = iconName.toLowerCase()
  const IconComponent = iconMap[normalizedName]

  if (!IconComponent) {
    // Fallback for unmapped icons - show placeholder with help text
    return (
      <div
        className={className}
        title={`Icon not found: ${iconName}`}
        style={{ width: size, height: size, opacity: 0.4 }}
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4M12 8h.01" />
        </svg>
      </div>
    )
  }

  return (
    <IconComponent
      size={size}
      className={className}
      strokeWidth={strokeWidth}
    />
  )
}
