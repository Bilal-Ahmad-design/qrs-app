import { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const TrustCenter: GlobalConfig = {
  slug: 'trust-center',
  access: {
    read: true,
    update: ({ req: { user } }) => ['editor', 'admin', 'super-admin'].includes(user?.role),
  },
  fields: [
    {
      name: 'intro',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
    },
    {
      name: 'relatedValidationReports',
      type: 'relationship',
      relationTo: 'validation-reports',
      hasMany: true,
    },
    {
      name: 'ssrnReferences',
      type: 'array',
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'url', type: 'text', required: true },
        { name: 'description', type: 'textarea' },
      ],
    },
  ],
}
