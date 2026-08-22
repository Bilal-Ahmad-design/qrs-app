import { getSession, type Session } from '@/lib/auth/session'

const permissions: Record<Session['user']['role'], string[]> = {
  'super-admin': ['users:create', 'users:update', 'users:delete', 'content:update', 'content:delete', 'forms:update', 'audit:read'],
  admin: ['users:create', 'users:update', 'content:update', 'forms:update', 'audit:read'],
  editor: ['content:update'],
  reviewer: [],
  'read-only': [],
}

export async function requirePermission(permission: string): Promise<Session> {
  const session = await getSession()
  if (!session || !permissions[session.user.role].includes(permission)) {
    throw new Error('Forbidden')
  }
  return session
}
