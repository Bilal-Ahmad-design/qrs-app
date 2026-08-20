import { CollectionConfig } from 'payload'
import { hasPermission } from '../lib/rbac/roles'

// Password validation
function validatePassword(password: string): string | true {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return true
}

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    depth: 0,
    tokenExpiration: 7 * 24 * 60 * 60, // 7 days
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'fullname', 'role', 'status', 'createdAt'],
    group: 'Management',
  },
  access: {
    read: ({ req: { user } }) => hasPermission(user?.role as any, 'users:read'),
    create: ({ req: { user } }) => hasPermission(user?.role as any, 'users:create'),
    update: ({ req: { user } }) => hasPermission(user?.role as any, 'users:update'),
    delete: ({ req: { user } }) => hasPermission(user?.role as any, 'users:delete'),
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      validate: async (value: string) => {
        if (!value) return 'Email is required'
        // Basic email format validation (Payload's email type does this, but be explicit)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(value)) return 'Invalid email format'
        return true
      },
      admin: {
        autoComplete: 'email',
      },
    },
    {
      name: 'password',
      type: 'password',
      required: true,
      admin: {
        placeholder: 'Min 8 characters',
        description: 'Password must be at least 8 characters',
      },
      validate: (value: string) => validatePassword(value),
    },
    {
      name: 'fullname',
      type: 'text',
      required: false,
      admin: {
        placeholder: 'John Doe',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'read-only',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Reviewer', value: 'reviewer' },
        { label: 'Read-Only', value: 'read-only' },
      ],
    },
    {
      name: 'permissions',
      type: 'array',
      fields: [
        {
          name: 'resource',
          type: 'text',
          required: true,
        },
        {
          name: 'actions',
          type: 'array',
          fields: [
            {
              name: 'action',
              type: 'select',
              options: [
                { label: 'Create', value: 'create' },
                { label: 'Read', value: 'read' },
                { label: 'Update', value: 'update' },
                { label: 'Delete', value: 'delete' },
                { label: 'Publish', value: 'publish' },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'active',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Suspended', value: 'suspended' },
      ],
    },
    {
      name: 'last_login',
      type: 'date',
      required: false,
    },
  ],
  timestamps: true,
  hooks: {
    beforeLogin: [
      async ({ args }) => {
        const { email, password } = args.data

        // Validate email format
        if (!email || !email.includes('@')) {
          throw new Error('Invalid email format')
        }

        // Validate password length
        if (!password || password.length < 8) {
          throw new Error('Password must be at least 8 characters')
        }

        return args
      },
    ],
  },
}
