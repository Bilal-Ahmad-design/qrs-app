import { CollectionConfig } from 'payload'
import { hasPermission } from '../lib/rbac/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    depth: 0,
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
      admin: {
        autoComplete: 'email',
      },
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
}
