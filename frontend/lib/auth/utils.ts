import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key')

export interface AuthUser {
  id: string
  email: string
  fullname?: string
  role: 'super-admin' | 'admin' | 'editor' | 'reviewer' | 'read-only'
}

/**
 * Get the current user from the request/session
 * Reads from httpOnly secure cookie
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('payload-session')?.value

    if (!sessionToken) {
      return null
    }

    // Verify JWT token from Payload
    // Note: In production, this should verify with Payload's configured JWT secret
    try {
      const verified = await jwtVerify(sessionToken, SECRET)
      return verified.payload as unknown as AuthUser
    } catch (error) {
      // Token invalid or expired
      return null
    }
  } catch (error) {
    console.error('Failed to get current user:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Check if user has a specific role or higher
 */
export async function hasRole(requiredRole: 'super-admin' | 'admin' | 'editor' | 'reviewer' | 'read-only'): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  const roleHierarchy = {
    'super-admin': 5,
    'admin': 4,
    'editor': 3,
    'reviewer': 2,
    'read-only': 1,
  }

  return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
}

/**
 * Check if user has a specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  const user = await getCurrentUser()
  if (!user) return false

  const permissions: Record<string, string[]> = {
    'super-admin': [
      'users:read', 'users:create', 'users:update', 'users:delete', 'users:changeRole',
      'content:read', 'content:create', 'content:update', 'content:delete', 'content:publish',
      'forms:read', 'forms:export', 'audit:read', 'settings:manage',
    ],
    'admin': [
      'users:read', 'users:create', 'users:update',
      'content:read', 'content:create', 'content:update', 'content:publish',
      'forms:read', 'forms:export', 'audit:read',
    ],
    'editor': ['content:read', 'content:create', 'content:update', 'content:publish'],
    'reviewer': ['content:read'],
    'read-only': ['content:read'],
  }

  return permissions[user.role]?.includes(permission) ?? false
}

/**
 * Require authentication
 * Throws error if not authenticated
 */
export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized: No authentication session found')
  }
  return user
}

/**
 * Require a specific role
 * Throws error if user doesn't have the role
 */
export async function requireRole(requiredRole: 'super-admin' | 'admin'): Promise<AuthUser> {
  const user = await requireAuth()
  const hasRequiredRole = await hasRole(requiredRole)

  if (!hasRequiredRole) {
    throw new Error(`Forbidden: Required role '${requiredRole}' not found`)
  }

  return user
}

/**
 * Require a specific permission
 * Throws error if user doesn't have the permission
 */
export async function requirePermission(permission: string): Promise<AuthUser> {
  const user = await requireAuth()
  const hasPermissionGranted = await hasPermission(permission)

  if (!hasPermissionGranted) {
    throw new Error(`Forbidden: Required permission '${permission}' not granted`)
  }

  return user
}
