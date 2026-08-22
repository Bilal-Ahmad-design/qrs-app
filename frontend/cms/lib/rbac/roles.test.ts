import { describe, it, expect } from 'vitest'
import { hasPermission, hasRole, getPermissions, canPerform, UserRole } from './roles'

describe('RBAC - Role-Based Access Control', () => {
  describe('hasPermission', () => {
    it('should grant users:read to super-admin', () => {
      expect(hasPermission('super-admin', 'users:read')).toBe(true)
    })

    it('should grant users:read to admin', () => {
      expect(hasPermission('admin', 'users:read')).toBe(true)
    })

    it('should deny users:delete to admin', () => {
      expect(hasPermission('admin', 'users:delete')).toBe(false)
    })

    it('should deny users:read to read-only', () => {
      expect(hasPermission('read-only', 'users:read')).toBe(false)
    })

    it('should grant content:read to all roles', () => {
      const roles: UserRole[] = ['super-admin', 'admin', 'editor', 'reviewer', 'read-only']
      roles.forEach(role => {
        expect(hasPermission(role, 'content:read')).toBe(true)
      })
    })

    it('should return false for undefined role', () => {
      expect(hasPermission(undefined, 'users:read')).toBe(false)
    })
  })

  describe('hasRole', () => {
    it('should allow super-admin to access super-admin role', () => {
      expect(hasRole('super-admin', 'super-admin')).toBe(true)
    })

    it('should allow super-admin to access admin role', () => {
      expect(hasRole('super-admin', 'admin')).toBe(true)
    })

    it('should deny admin to access super-admin role', () => {
      expect(hasRole('admin', 'super-admin')).toBe(false)
    })

    it('should allow admin to access editor role', () => {
      expect(hasRole('admin', 'editor')).toBe(true)
    })

    it('should return false for undefined role', () => {
      expect(hasRole(undefined, 'admin')).toBe(false)
    })
  })

  describe('getPermissions', () => {
    it('should return all permissions for super-admin', () => {
      const perms = getPermissions('super-admin')
      expect(perms).toContain('users:read')
      expect(perms).toContain('users:delete')
      expect(perms).toContain('audit:read')
      expect(perms.length).toBeGreaterThan(10)
    })

    it('should return limited permissions for editor', () => {
      const perms = getPermissions('editor')
      expect(perms).toContain('content:read')
      expect(perms).toContain('content:create')
      expect(perms).not.toContain('users:read')
      expect(perms.length).toBeLessThan(5)
    })

    it('should return empty array for undefined role', () => {
      expect(getPermissions(undefined)).toEqual([])
    })
  })

  describe('canPerform', () => {
    it('should allow super-admin to perform users:create', () => {
      expect(canPerform('super-admin', 'users:create')).toBe(true)
    })

    it('should allow editor to perform content:update', () => {
      expect(canPerform('editor', 'content:update')).toBe(true)
    })

    it('should deny reviewer to perform content:publish', () => {
      expect(canPerform('reviewer', 'content:publish')).toBe(false)
    })

    it('should allow read-only to perform content:read', () => {
      expect(canPerform('read-only', 'content:read')).toBe(true)
    })
  })

  describe('RBAC Matrix Integrity', () => {
    it('should maintain role hierarchy: super-admin > admin > editor > reviewer > read-only', () => {
      const roles: UserRole[] = ['super-admin', 'admin', 'editor', 'reviewer', 'read-only']
      const permCounts = roles.map(role => getPermissions(role).length)

      // Each role should have equal or fewer permissions than the previous
      for (let i = 1; i < permCounts.length; i++) {
        expect(permCounts[i]).toBeLessThanOrEqual(permCounts[i - 1])
      }
    })

    it('should ensure users:delete is only for super-admin', () => {
      expect(hasPermission('super-admin', 'users:delete')).toBe(true)
      expect(hasPermission('admin', 'users:delete')).toBe(false)
      expect(hasPermission('editor', 'users:delete')).toBe(false)
      expect(hasPermission('reviewer', 'users:delete')).toBe(false)
      expect(hasPermission('read-only', 'users:delete')).toBe(false)
    })

    it('should ensure audit:read is only for admin and super-admin', () => {
      expect(hasPermission('super-admin', 'audit:read')).toBe(true)
      expect(hasPermission('admin', 'audit:read')).toBe(true)
      expect(hasPermission('editor', 'audit:read')).toBe(false)
      expect(hasPermission('reviewer', 'audit:read')).toBe(false)
      expect(hasPermission('read-only', 'audit:read')).toBe(false)
    })
  })
})
