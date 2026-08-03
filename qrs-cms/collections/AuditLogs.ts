import { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'action',
    defaultColumns: ['user', 'tableName', 'action', 'timestamp'],
  },
  access: {
    read: ({ req: { user } }) => ['admin', 'super-admin'].includes(user?.role),
    create: ({ req: { user } }) => !user || ['super-admin'].includes(user.role),
    update: false,
    delete: ({ req: { user } }) => ['super-admin'].includes(user?.role),
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
