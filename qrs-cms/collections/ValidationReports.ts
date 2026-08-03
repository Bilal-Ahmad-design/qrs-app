import { CollectionConfig } from 'payload'

export const ValidationReports: CollectionConfig = {
  slug: 'validation-reports',
  admin: { useAsTitle: 'title' },
  access: {
    read: true,
    create: ({ req: { user } }) => ['editor', 'admin', 'super-admin'].includes(user?.role),
    update: ({ req: { user } }) => ['editor', 'admin', 'super-admin'].includes(user?.role),
    delete: ({ req: { user } }) => ['admin', 'super-admin'].includes(user?.role),
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true, index: true },
    { name: 'summary', type: 'textarea' },
    { name: 'publishedDate', type: 'date', required: true },
    { name: 'reportFile', type: 'upload', relationTo: 'media', required: true },
    { name: 'ssrnUrl', type: 'text' },
    { name: 'sealSignature', type: 'text', admin: { description: 'ECDSA signature hash' } },
    {
      name: 'relatedPeril',
      type: 'relationship',
      relationTo: 'peril-status',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
  timestamps: true,
}
