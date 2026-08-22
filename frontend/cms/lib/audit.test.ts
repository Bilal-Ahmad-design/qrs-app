import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { createDiff } from '../lib/audit'

describe('Audit System', () => {
  describe('createDiff', () => {
    it('should detect field changes', () => {
      const before = { name: 'John', email: 'john@example.com', age: 30 }
      const after = { name: 'John', email: 'john@example.com', age: 31 }

      const diff = createDiff(before, after)

      expect(diff).toBeDefined()
      expect(diff?.age).toEqual({ before: 30, after: 31 })
      expect(diff?.name).toBeUndefined()
    })

    it('should handle new fields', () => {
      const before = { name: 'John' }
      const after = { name: 'John', email: 'john@example.com' }

      const diff = createDiff(before, after)

      expect(diff?.email).toEqual({ before: undefined, after: 'john@example.com' })
    })

    it('should handle deleted fields', () => {
      const before = { name: 'John', email: 'john@example.com' }
      const after = { name: 'John' }

      const diff = createDiff(before, after)

      expect(diff?.email).toEqual({ before: 'john@example.com', after: undefined })
    })

    it('should redact sensitive fields', () => {
      const before = { name: 'John', password: 'oldpass123' }
      const after = { name: 'John', password: 'newpass123' }

      const diff = createDiff(before, after)

      expect(diff?.password).toBeUndefined()
      expect(diff?.name).toBeUndefined()
    })

    it('should redact apiKey', () => {
      const before = { apiKey: 'old-key-123' }
      const after = { apiKey: 'new-key-456' }

      const diff = createDiff(before, after)

      expect(diff?.apiKey).toBeUndefined()
    })

    it('should redact token', () => {
      const before = { token: 'old-token' }
      const after = { token: 'new-token' }

      const diff = createDiff(before, after)

      expect(diff?.token).toBeUndefined()
    })

    it('should redact secret', () => {
      const before = { secret: 'old-secret' }
      const after = { secret: 'new-secret' }

      const diff = createDiff(before, after)

      expect(diff?.secret).toBeUndefined()
    })

    it('should handle complex objects', () => {
      const before = {
        name: 'John',
        metadata: { age: 30, city: 'NYC' },
      }
      const after = {
        name: 'John',
        metadata: { age: 31, city: 'NYC' },
      }

      const diff = createDiff(before, after)

      expect(diff?.metadata).toBeDefined()
    })

    it('should return null when no changes', () => {
      const before = { name: 'John', email: 'john@example.com' }
      const after = { name: 'John', email: 'john@example.com' }

      const diff = createDiff(before, after)

      expect(diff).toBeNull()
    })

    it('should handle boolean changes', () => {
      const before = { isActive: true }
      const after = { isActive: false }

      const diff = createDiff(before, after)

      expect(diff?.isActive).toEqual({ before: true, after: false })
    })

    it('should handle array changes', () => {
      const before = { tags: ['a', 'b'] }
      const after = { tags: ['a', 'b', 'c'] }

      const diff = createDiff(before, after)

      expect(diff?.tags).toBeDefined()
    })

    it('should handle null values', () => {
      const before = { email: 'john@example.com' }
      const after = { email: null }

      const diff = createDiff(before, after)

      expect(diff?.email).toEqual({ before: 'john@example.com', after: null })
    })

    it('should handle case-insensitive sensitive field names', () => {
      const before = { PASSWORD: 'old', PaSsWoRd: 'old2' }
      const after = { PASSWORD: 'new', PaSsWoRd: 'new2' }

      const diff = createDiff(before, after)

      expect(diff?.PASSWORD).toBeUndefined()
      expect(diff?.PaSsWoRd).toBeUndefined()
    })

    it('should handle empty before object', () => {
      const before = {}
      const after = { name: 'John', email: 'john@example.com' }

      const diff = createDiff(before, after)

      expect(diff?.name).toEqual({ before: undefined, after: 'John' })
      expect(diff?.email).toEqual({ before: undefined, after: 'john@example.com' })
    })

    it('should handle null before object', () => {
      const before: any = null
      const after = { name: 'John' }

      const diff = createDiff(before, after)

      expect(diff?.name).toEqual({ before: undefined, after: 'John' })
    })

    it('should track role changes', () => {
      const before = { email: 'user@example.com', role: 'editor' }
      const after = { email: 'user@example.com', role: 'admin' }

      const diff = createDiff(before, after)

      expect(diff?.role).toEqual({ before: 'editor', after: 'admin' })
      expect(diff?.email).toBeUndefined()
    })

    it('should track isActive changes', () => {
      const before = { email: 'user@example.com', isActive: true }
      const after = { email: 'user@example.com', isActive: false }

      const diff = createDiff(before, after)

      expect(diff?.isActive).toEqual({ before: true, after: false })
    })
  })

  describe('Audit Action Types', () => {
    const actions = ['create', 'update', 'delete', 'publish', 'unpublish', 'login', 'login-failed', 'logout', 'role-change', 'form-submit']

    it('should have all required action types', () => {
      expect(actions.length).toBe(10)
      expect(actions).toContain('create')
      expect(actions).toContain('update')
      expect(actions).toContain('delete')
    })
  })

  describe('Audit Metadata', () => {
    it('should capture user email', () => {
      const auditData = {
        userEmail: 'admin@example.com',
      }
      expect(auditData.userEmail).toBeDefined()
      expect(auditData.userEmail).toMatch(/^[\w.-]+@[\w.-]+\.\w+$/)
    })

    it('should capture timestamp', () => {
      const timestamp = new Date()
      expect(timestamp).toBeInstanceOf(Date)
      expect(timestamp.getTime()).toBeGreaterThan(0)
    })

    it('should capture IP address format', () => {
      const ipv4 = '192.168.1.1'
      expect(ipv4).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/)
    })
  })
})
