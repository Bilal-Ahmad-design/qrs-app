import { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'status', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      // Public users can only see published pages
      if (!user) return { status: { equals: 'published' } }
      // Editors and admins can see all
      if (['editor', 'admin', 'super-admin', 'reviewer'].includes(user.role)) return true
      // Read-only users see published only
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => ['editor', 'admin', 'super-admin'].includes(user?.role),
    update: ({ req: { user } }) => ['editor', 'admin', 'super-admin'].includes(user?.role),
    delete: ({ req: { user } }) => ['admin', 'super-admin'].includes(user?.role),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
      required: true,
    },
    {
      name: 'layout',
      type: 'array',
      fields: [
        {
          name: 'blockType',
          type: 'select',
          options: [
            { label: 'Hero', value: 'hero' },
            { label: 'KPI Strip', value: 'kpi' },
            { label: 'Trust Badges', value: 'trust-badges' },
            { label: 'Rich Text', value: 'rich-text' },
            { label: 'Card Grid', value: 'card-grid' },
            { label: 'Feature Section', value: 'feature-section' },
          ],
        },
        {
          name: 'hero',
          type: 'group',
          admin: { condition: (_, siblingData) => siblingData?.blockType === 'hero' },
          fields: [
            { name: 'heading', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'primaryCTA', type: 'text' },
            { name: 'primaryCTAURL', type: 'text' },
            { name: 'secondaryCTA', type: 'text' },
            { name: 'secondaryCTAURL', type: 'text' },
          ],
        },
        {
          name: 'kpi',
          type: 'array',
          admin: { condition: (_, siblingData) => siblingData?.blockType === 'kpi' },
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'value', type: 'text', required: true },
          ],
        },
        {
          name: 'richText',
          type: 'richText',
          admin: { condition: (_, siblingData) => siblingData?.blockType === 'rich-text' },
          editor: lexicalEditor(),
        },
        {
          name: 'cards',
          type: 'array',
          admin: { condition: (_, siblingData) => siblingData?.blockType === 'card-grid' },
          fields: [
            { name: 'title', type: 'text', required: true },
            { name: 'description', type: 'textarea' },
            { name: 'image', type: 'upload', relationTo: 'media' },
            { name: 'link', type: 'text' },
          ],
        },
      ],
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
    },
    {
      name: 'description',
      type: 'textarea',
      admin: { description: 'Brief description for listing pages' },
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Page title for search engines' },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: { description: 'Meta description for search results' },
        },
        {
          name: 'keywords',
          type: 'array',
          fields: [{ name: 'keyword', type: 'text' }],
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          admin: { description: 'OpenGraph image' },
        },
        {
          name: 'canonical',
          type: 'text',
          admin: { description: 'Canonical URL' },
        },
      ],
    },
  ],
  timestamps: true,
}
