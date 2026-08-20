import { CollectionConfig } from 'payload'
import { hasPermission } from '../lib/rbac/roles'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['user', 'tableName', 'action', 'timestamp'],
  },
  access: {
    read: ({ req: { user } }) => hasPermission(user?.role as any, 'audit:read'),
    create: ({ req: { user } }) => !user || hasPermission(user?.role as any, 'audit:read'),
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    { name: 'tableName', type: 'text', required: true, index: true },
    { name: 'recordId', type: 'number', required: true },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Publish', value: 'publish' },
      ],
    },
    {
      name: 'changes',
      type: 'json',
      admin: { description: 'Before and after values' },
    },
    { name: 'timestamp', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
  ],
  timestamps: false,
}
