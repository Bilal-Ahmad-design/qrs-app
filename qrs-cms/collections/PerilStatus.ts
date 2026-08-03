import { CollectionConfig } from 'payload'

export const PerilStatus: CollectionConfig = {
  slug: 'peril-status',
  admin: { useAsTitle: 'perilName' },
  access: {
    read: true,
    create: ({ req: { user } }) => ['editor', 'admin', 'super-admin'].includes(user?.role),
    update: ({ req: { user } }) => ['editor', 'admin', 'super-admin'].includes(user?.role),
    delete: ({ req: { user } }) => ['admin', 'super-admin'].includes(user?.role),
  },
  fields: [
    { name: 'perilName', type: 'text', required: true },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Production', value: 'production' },
        { label: 'Validation', value: 'validation' },
        { label: 'Roadmap', value: 'roadmap' },
      ],
    },
    { name: 'description', type: 'textarea' },
    { name: 'order', type: 'number', defaultValue: 0 },
  ],
  timestamps: true,
}
