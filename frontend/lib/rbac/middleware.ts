/**
 * RBAC middleware for API routes
 * Validates user permissions before route execution
 */

import { NextRequest, NextResponse } from 'next/server'
import { UserRole, hasPermission, hasRole, Permission } from './roles'
import { ApiErrors } from '../validation/responses'

/**
 * Extract user role from request headers (set by middleware.ts)
 */
export function getUserRole(request: NextRequest): UserRole | undefined {
  const role = request.headers.get('x-user-role')
  if (!role || !['super-admin', 'admin', 'editor', 'reviewer', 'read-only'].includes(role)) {
    return undefined
  }
  return role as UserRole
}

/**
 * Require authentication on a route
 * Returns 401 if no user is authenticated
 */
export function requireAuth(request: NextRequest): { isValid: true; userId: string; email: string; role: UserRole } | NextResponse {
  const userId = request.headers.get('x-user-id')
  const email = request.headers.get('x-user-email')
  const role = getUserRole(request)

  if (!userId || !email || !role) {
    return ApiErrors.unauthorized('Authentication required')
  }

  return { isValid: true, userId, email, role }
}

/**
 * Require specific permission on a route
 * Returns 403 if user lacks permission
 */
export function requirePermission(request: NextRequest, permission: Permission): { isValid: true; userId: string; email: string; role: UserRole } | NextResponse {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) {
    return auth
  }

  if (!hasPermission(auth.role, permission)) {
    return ApiErrors.forbidden(`Permission required: ${permission}`)
  }

  return auth
}

/**
 * Require specific role on a route
 * Returns 403 if user's role is insufficient
 */
export function requireRole(request: NextRequest, requiredRole: UserRole): { isValid: true; userId: string; email: string; role: UserRole } | NextResponse {
  const auth = requireAuth(request)
  if (auth instanceof NextResponse) {
    return auth
  }

  if (!hasRole(auth.role, requiredRole)) {
    return ApiErrors.forbidden(`Role required: ${requiredRole} or higher`)
  }

  return auth
}
