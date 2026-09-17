'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { DashboardIcon } from '@/components/icons/DashboardIcons'

interface SidebarProps {
  isOpen: boolean
}

const navSections = [
  {
    title: 'Dashboard',
    items: [
      { label: 'Overview', href: '/cms/dashboard', icon: 'Overview' as const },
      { label: 'Analytics', href: '/cms/dashboard/analytics', icon: 'Analytics' as const },
    ],
  },
  {
    title: 'Content',
    items: [
      { label: 'Pages', href: '/cms/dashboard/pages', icon: 'Pages' as const },
      { label: 'Page Sections', href: '/cms/dashboard/page-sections', icon: 'PageSections' as const },
      { label: 'Blog', href: '/cms/dashboard/blog', icon: 'Blog' as const },
      { label: 'Solutions', href: '/cms/dashboard/solutions', icon: 'Solutions' as const },
      { label: 'Product Showcase', href: '/cms/dashboard/product-showcase', icon: 'ProductShowcase' as const },
      { label: 'Documentation', href: '/cms/dashboard/documentation', icon: 'Documentation' as const },
    ],
  },
  {
    title: 'Media & Files',
    items: [
      { label: 'Media Library', href: '/cms/dashboard/media-library', icon: 'MediaLibrary' as const },
    ],
  },
  {
    title: 'Forms & Submissions',
    items: [
      { label: 'Form Submissions', href: '/cms/dashboard/submissions', icon: 'FormSubmissions' as const },
      { label: 'Form Entries', href: '/cms/dashboard/form-entries', icon: 'FormEntries' as const },
    ],
  },
  {
    title: 'Compliance & Admin',
    items: [
      { label: 'Users', href: '/cms/dashboard/users', icon: 'Users' as const },
      { label: 'Audit Logs', href: '/cms/dashboard/audit-logs', icon: 'AuditLogs' as const },
      { label: 'Redirects', href: '/cms/dashboard/redirects', icon: 'Redirects' as const },
      { label: 'Regulatory Compliance', href: '/cms/dashboard/regulatory-compliance', icon: 'RegulatoryCompliance' as const },
      { label: 'Platform Capabilities', href: '/cms/dashboard/platform-capabilities', icon: 'PlatformCapabilities' as const },
      { label: 'Email Settings', href: '/cms/dashboard/email-settings', icon: 'EmailSettings' as const },
    ],
  },
]

export function Sidebar({ isOpen }: SidebarProps) {
  const pathname = usePathname()

  const NavLink = ({ item, isActive }: { item: any; isActive: boolean }) => (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-base ${
        isActive
          ? 'bg-teal-600 text-white font-semibold shadow-md'
          : 'text-white/70 hover:text-white hover:bg-ink-700/50'
      }`}
    >
      <DashboardIcon type={item.icon} size={20} className="flex-shrink-0" />
      <span className="text-sm font-medium">{item.label}</span>
    </Link>
  )

  const SidebarContent = () => (
    <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
      {navSections.map((section) => (
        <div key={section.title}>
          <h3 className="px-3 py-2 text-xs font-semibold text-white/50 uppercase tracking-wider">{section.title}</h3>
          <div className="space-y-1">
            {section.items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
              return <NavLink key={item.href} item={item} isActive={isActive} />
            })}
          </div>
        </div>
      ))}
    </nav>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-ink-800 border-r border-ink-700 h-screen fixed left-0 top-0">
        <div className="p-6 border-b border-ink-700">
          <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-500 rounded-lg mb-3">
            <span className="text-lg font-bold text-white">QRS</span>
          </div>
          <h1 className="text-xl font-bold text-white">CMS</h1>
        </div>
        <SidebarContent />
        <div className="p-4 border-t border-ink-700">
          <p className="text-xs text-white/40">CMS v1.0</p>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <aside className="absolute left-0 top-0 w-64 bg-ink-800 h-screen border-r border-ink-700 flex flex-col">
            <div className="p-6 border-b border-ink-700">
              <div className="inline-flex items-center justify-center w-10 h-10 bg-teal-500 rounded-lg mb-3">
                <span className="text-lg font-bold text-white">QRS</span>
              </div>
              <h1 className="text-xl font-bold text-white">CMS</h1>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  )
}
