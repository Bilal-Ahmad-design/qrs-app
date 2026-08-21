import { CollectionConfig } from 'payload'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { useAsTitle: 'sourcePath' },
  access: {
    read: ({ req: { user } }) => ['admin', 'super-admin'].includes(user?.role),
    create: ({ req: { user } }) => ['admin', 'super-admin'].includes(user?.role),
    update: ({ req: { user } }) => ['admin', 'super-admin'].includes(user?.role),
    delete: ({ req: { user } }) => ['admin', 'super-admin'].includes(user?.role),
  },
  fields: [
    { name: 'sourcePath', type: 'text', required: true, unique: true, index: true },
    { name: 'destinationPath', type: 'text', required: true },
    {
      name: 'type',
      type: 'select',
      defaultValue: '301',
      options: [
        { label: 'Permanent (301)', value: '301' },
        { label: 'Temporary (302)', value: '302' },
      ],
    },
    { name: 'notes', type: 'textarea' },
  ],
  timestamps: true,
}
