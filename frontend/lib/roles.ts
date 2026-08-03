/**
 * Role-based access control utilities
 */

export type UserRole = 'super-admin' | 'admin' | 'editor' | 'reviewer' | 'read-only'

export const ROLE_HIERARCHY = {
  'super-admin': 5,
  'admin': 4,
  'editor': 3,
  'reviewer': 2,
  'read-only': 1,
}

export const ROLE_PERMISSIONS = {
  'super-admin': {
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: true,
    canCreateContent: true,
    canEditContent: true,
    canDeleteContent: true,
    canPublish: true,
    canViewAuditLogs: true,
    canManageRoles: true,
  },
  'admin': {
    canCreateUsers: true,
    canEditUsers: true,
    canDeleteUsers: false,
    canCreateContent: true,
    canEditContent: true,
    canDeleteContent: true,
    canPublish: true,
    canViewAuditLogs: true,
    canManageRoles: false,
  },
  'editor': {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canCreateContent: true,
    canEditContent: true,
    canDeleteContent: false,
    canPublish: true,
    canViewAuditLogs: false,
    canManageRoles: false,
  },
  'reviewer': {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canCreateContent: false,
    canEditContent: false,
    canDeleteContent: false,
    canPublish: false,
    canViewAuditLogs: false,
    canManageRoles: false,
  },
  'read-only': {
    canCreateUsers: false,
    canEditUsers: false,
    canDeleteUsers: false,
    canCreateContent: false,
    canEditContent: false,
    canDeleteContent: false,
    canPublish: false,
    canViewAuditLogs: false,
    canManageRoles: false,
  },
}

/**
 * Check if user has permission to perform an action
 */
export function hasPermission(
  userRole: UserRole | undefined,
  permission: keyof typeof ROLE_PERMISSIONS['super-admin']
): boolean {
  if (!userRole) return false
  const permissions = ROLE_PERMISSIONS[userRole]
  return permissions[permission] || false
}

/**
 * Check if user can access a resource based on role hierarchy
 */
export function canAccessResource(
  userRole: UserRole | undefined,
  requiredRole: UserRole
): boolean {
  if (!userRole) return false
  const userLevel = ROLE_HIERARCHY[userRole] || 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0
  return userLevel >= requiredLevel
}

/**
 * Get all roles that a user can assign (their level and below)
 */
export function getAssignableRoles(userRole: UserRole | undefined): UserRole[] {
  if (!userRole) return []

  const userLevel = ROLE_HIERARCHY[userRole] || 0
  const roles = Object.entries(ROLE_HIERARCHY) as [UserRole, number][]

  return roles
    .filter(([_role, level]) => level <= userLevel)
    .map(([role]) => role)
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    'super-admin': 'Super Admin',
    'admin': 'Admin',
    'editor': 'Editor',
    'reviewer': 'Reviewer',
    'read-only': 'Read Only',
  }
  return names[role] || role
}

/**
 * Get role description
 */
export function getRoleDescription(role: UserRole): string {
  const descriptions: Record<UserRole, string> = {
    'super-admin': 'Full system access including user and role management',
    'admin': 'Content management and user creation, but cannot delete users',
    'editor': 'Can create, edit and publish content',
    'reviewer': 'Read-only access with approval workflow',
    'read-only': 'View-only access to published content',
  }
  return descriptions[role] || ''
}
