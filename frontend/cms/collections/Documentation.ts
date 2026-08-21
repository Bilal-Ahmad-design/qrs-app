import { CollectionConfig } from 'payload'

export const Documentation: CollectionConfig = {
  slug: 'documentation',
  labels: {
    singular: 'Documentation Page',
    plural: 'Documentation',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'section', 'published'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'super-admin' || req.user?.role === 'admin' || req.user?.role === 'editor',
    update: ({ req }) => req.user?.role === 'super-admin' || req.user?.role === 'admin' || req.user?.role === 'editor',
    delete: ({ req }) => req.user?.role === 'super-admin' || req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'section',
      type: 'select',
      required: true,
      label: 'Documentation Section',
      options: [
        { label: 'Getting Started', value: 'getting-started' },
        { label: 'API Reference', value: 'api' },
        { label: 'Integration Guides', value: 'integration' },
        { label: 'Model Documentation', value: 'models' },
        { label: 'Best Practices', value: 'practices' },
        { label: 'FAQ', value: 'faq' },
        { label: 'Troubleshooting', value: 'troubleshooting' },
      ],
      admin: {
        description: 'Documentation category/section',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Page Title',
      admin: {
        description: 'Title of this documentation page',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly slug (e.g., "rest-api-basics")',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      label: 'Summary',
      admin: {
        description: 'Brief one-sentence summary of this page',
      },
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
      required: true,
      admin: {
        description: 'Main documentation content',
      },
    },
    {
      name: 'codeExamples',
      type: 'array',
      label: 'Code Examples',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Example Title',
        },
        {
          name: 'language',
          type: 'select',
          label: 'Language',
          options: [
            { label: 'JavaScript', value: 'javascript' },
            { label: 'TypeScript', value: 'typescript' },
            { label: 'Python', value: 'python' },
            { label: 'cURL', value: 'bash' },
            { label: 'JSON', value: 'json' },
            { label: 'SQL', value: 'sql' },
          ],
        },
        {
          name: 'code',
          type: 'code',
          label: 'Code',
        },
      ],
      admin: {
        description: 'Code examples for this documentation page',
      },
    },
    {
      name: 'relatedPages',
      type: 'relationship',
      relationTo: 'documentation',
      hasMany: true,
      label: 'Related Documentation',
      admin: {
        description: 'Links to related documentation pages',
      },
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'Search Keywords',
      fields: [
        {
          name: 'keyword',
          type: 'text',
          label: 'Keyword',
        },
      ],
      admin: {
        description: 'Keywords for search indexing',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description: 'Controls order within section',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Published',
      defaultValue: false,
      admin: {
        description: 'Show this page on the website',
      },
    },
    {
      name: 'updatedAt',
      type: 'date',
      label: 'Last Updated',
      admin: {
        description: 'When this documentation was last updated',
      },
    },
  ],
}
