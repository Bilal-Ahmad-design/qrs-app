import { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { hasPermission } from '../lib/rbac/roles'
import { auditAfterChangeHook, auditAfterDeleteHook } from '../lib/audit'

export const Blog: CollectionConfig = {
  slug: 'blog',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'author', 'status', 'publishedAt'],
    group: 'Content',
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req: { user } }) => {
      if (!user) return { status: { equals: 'published' } }
      if (hasPermission(user?.role as any, 'content:read')) return true
      return { status: { equals: 'published' } }
    },
    create: ({ req: { user } }) => hasPermission(user?.role as any, 'content:create'),
    update: ({ req: { user } }) => hasPermission(user?.role as any, 'content:update'),
    delete: ({ req: { user } }) => hasPermission(user?.role as any, 'content:delete'),
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
      admin: {
        description: 'URL-friendly slug for the blog post',
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Brief summary for listings and previews',
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      editor: lexicalEditor(),
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Security', value: 'security' },
        { label: 'Engineering', value: 'engineering' },
        { label: 'Product', value: 'product' },
        { label: 'Company', value: 'company' },
        { label: 'Research', value: 'research' },
      ],
    },
    {
      name: 'tags',
      type: 'array',
      fields: [
        {
          name: 'tag',
          type: 'text',
        },
      ],
    },
    {
      name: 'readingTime',
      type: 'number',
      admin: {
        readOnly: true,
        description: 'Estimated reading time in minutes (auto-calculated)',
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'draft',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: false,
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: { description: 'Meta title for search engines' },
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
          name: 'canonical',
          type: 'text',
          admin: { description: 'Canonical URL' },
        },
      ],
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [auditAfterChangeHook('blog')],
    afterDelete: [auditAfterDeleteHook('blog')],
  },
}
