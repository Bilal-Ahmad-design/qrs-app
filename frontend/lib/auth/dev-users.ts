/**
 * Development-only mock users for testing auth flow
 * In production, users come from Payload CMS
 */

import bcrypt from 'bcryptjs'

export interface DevUser {
  id: string
  email: string
  password: string // stored as hash
  fullname: string
  role: 'super-admin' | 'admin' | 'editor' | 'reviewer' | 'read-only'
}

// Pre-hashed passwords (all passwords are "Password123!")
// To create new hashes: await bcrypt.hash('Password123!', 10)
const PASSWORD_HASH = '$2a$10$2EFZiTbVYG.wB1rKxhp4ZeaDxC9yLNVLFqFPxK0qV6T8d8kQfCkru'

export const DEV_USERS: DevUser[] = [
  {
    id: 'dev-user-1',
    email: 'jordan@qrs.example.com',
    password: PASSWORD_HASH,
    fullname: 'Jordan Markwith',
    role: 'super-admin',
  },
  {
    id: 'dev-user-2',
    email: 'bilal@qrs.example.com',
    password: PASSWORD_HASH,
    fullname: 'Bilal Ahmad',
    role: 'admin',
  },
  {
    id: 'dev-user-3',
    email: 'editor@qrs.example.com',
    password: PASSWORD_HASH,
    fullname: 'Content Editor',
    role: 'editor',
  },
  {
    id: 'dev-user-4',
    email: 'reviewer@qrs.example.com',
    password: PASSWORD_HASH,
    fullname: 'Content Reviewer',
    role: 'reviewer',
  },
  {
    id: 'dev-user-5',
    email: 'readonly@qrs.example.com',
    password: PASSWORD_HASH,
    fullname: 'Read-Only User',
    role: 'read-only',
  },
]

export async function findDevUserByEmail(email: string): Promise<DevUser | null> {
  return DEV_USERS.find(u => u.email === email) || null
}

export async function verifyDevUserPassword(user: DevUser, plainPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, user.password)
}
