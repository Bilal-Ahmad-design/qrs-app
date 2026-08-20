/**
 * Role-based access control (RBAC) system
 * Five roles with hierarchical permissions for QRS platform
 */

export type UserRole = 'super-admin' | 'admin' | 'editor' | 'reviewer' | 'read-only'

export type Permission =
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'users:changeRole'
  | 'content:read'
  | 'content:create'
  | 'content:update'
  | 'content:delete'
  | 'content:publish'
  | 'forms:read'
  | 'forms:export'
  | 'audit:read'
  | 'settings:manage'

/**
 * Role hierarchy: Super Admin > Admin > Editor > Reviewer > Read-Only
 * Each role inherits all permissions of roles below it
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  'super-admin': 5,
  'admin': 4,
  'editor': 3,
  'reviewer': 2,
  'read-only': 1,
}

/**
 * Permission matrix: which roles have which permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'super-admin': [
    // User management (full access)
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'users:changeRole',
    // Content management (full access)
    'content:read',
    'content:create',
    'content:update',
    'content:delete',
    'content:publish',
    // Form management (full access)
    'forms:read',
    'forms:export',
    // Audit access
    'audit:read',
    // Settings
    'settings:manage',
  ],
  'admin': [
    // User management (read + update, no delete)
    'users:read',
    'users:create',
    'users:update',
    // Content management (read + create + publish, no delete)
    'content:read',
    'content:create',
    'content:update',
    'content:publish',
    // Form management
    'forms:read',
    'forms:export',
    // Audit access
    'audit:read',
  ],
  'editor': [
    // Content only
    'content:read',
    'content:create',
    'content:update',
    'content:publish',
  ],
  'reviewer': [
    // Read-only on content
    'content:read',
  ],
  'read-only': [
    // Read-only on public content
    'content:read',
  ],
}

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/**
 * Check if a role equals or exceeds another in hierarchy
 */
export function hasRole(userRole: UserRole | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

/**
 * Get all permissions for a role
 */
export function getPermissions(role: UserRole | undefined): Permission[] {
  if (!role) return []
  return ROLE_PERMISSIONS[role] ?? []
}

/**
 * Check if user can perform an action based on role
 * @param userRole - User's role
 * @param permission - Required permission
 * @returns true if user has permission
 */
export function canPerform(userRole: UserRole | undefined, permission: Permission): boolean {
  return hasPermission(userRole, permission)
}
