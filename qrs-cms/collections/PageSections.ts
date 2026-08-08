import { CollectionConfig } from 'payload'

export const PageSections: CollectionConfig = {
  slug: 'page-sections',
  labels: {
    singular: 'Page Section',
    plural: 'Page Sections',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'page', 'sectionType', 'order', 'published'],
  },
  access: {
    read: () => true,
    create: ({ req }) =>
      req.user?.role === 'super-admin' ||
      req.user?.role === 'admin' ||
      req.user?.role === 'editor',
    update: ({ req }) =>
      req.user?.role === 'super-admin' ||
      req.user?.role === 'admin' ||
      req.user?.role === 'editor',
    delete: ({ req }) =>
      req.user?.role === 'super-admin' || req.user?.role === 'admin',
  },
  fields: [
    {
      name: 'page',
      type: 'select',
      required: true,
      label: '📄 Page',
      options: [
        { label: 'Home', value: 'home' },
        { label: 'Platform', value: 'platform' },
        { label: 'About', value: 'about' },
        { label: 'Trust & Security', value: 'trust' },
        { label: 'Validation', value: 'validation' },
        { label: 'Solutions', value: 'solutions' },
        { label: 'Verify', value: 'verify' },
        { label: 'Regulatory', value: 'regulatory' },
      ],
    },
    {
      name: 'sectionType',
      type: 'select',
      required: true,
      label: '🎨 Section Type',
      options: [
        { label: 'Hero', value: 'hero' },
        { label: 'Feature Grid', value: 'feature-grid' },
        { label: 'Text + Image', value: 'text-image' },
        { label: 'CTA Block', value: 'cta' },
        { label: 'Stats', value: 'stats' },
        { label: 'Workflow Steps', value: 'workflow-steps' },
        { label: 'Product Evidence', value: 'product-evidence' },
        { label: 'Regulatory Grid', value: 'regulatory-grid' },
        { label: 'Security Compliance', value: 'security-compliance' },
        { label: 'Security Features Grid', value: 'security-features-grid' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Section Title (Internal)',
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle/Badge Text',
      admin: {
        condition: (data) => data?.sectionType === 'hero',
        description: 'Only for hero sections',
      },
    },
    {
      name: 'heading',
      type: 'richText',
      label: 'Heading',
      admin: {
        condition: (data) => data?.sectionType !== undefined,
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      admin: {
        condition: (data) => data?.sectionType !== undefined,
      },
    },
    {
      name: 'backgroundStyle',
      type: 'select',
      label: '🎨 Background Color',
      options: [
        { label: 'Light (cream-50)', value: 'light' },
        { label: 'White', value: 'white' },
        { label: 'Light Institutional', value: 'light-institutional' },
        { label: 'Dark (ink-800)', value: 'dark' },
        { label: 'Deep Dark (ink-900)', value: 'deep-dark' },
      ],
      defaultValue: 'light',
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
    },
    {
      name: 'published',
      type: 'checkbox',
      label: '✅ Published',
      defaultValue: true,
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Image URL',
      admin: {
        condition: (data) =>
          data?.sectionType === 'hero' ||
          data?.sectionType === 'text-image' ||
          data?.sectionType === 'product-evidence',
        description: 'Background/display image',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL (MP4)',
      admin: {
        condition: (data) => data?.sectionType === 'hero',
        description: 'Background video for hero',
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      admin: {
        condition: (data) =>
          data?.sectionType === 'hero' ||
          data?.sectionType === 'text-image' ||
          data?.sectionType === 'cta',
      },
    },
    {
      name: 'buttonUrl',
      type: 'text',
      label: 'Button URL',
      admin: {
        condition: (data) =>
          data?.sectionType === 'hero' ||
          data?.sectionType === 'text-image' ||
          data?.sectionType === 'cta',
      },
    },
    {
      name: 'secondaryButtonText',
      type: 'text',
      label: 'Secondary Button Text',
      admin: {
        condition: (data) => data?.sectionType === 'hero',
      },
    },
    {
      name: 'secondaryButtonUrl',
      type: 'text',
      label: 'Secondary Button URL',
      admin: {
        condition: (data) => data?.sectionType === 'hero',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items/Cards',
      admin: {
        condition: (data) => {
          const itemSections = [
            'feature-grid',
            'stats',
            'workflow-steps',
            'product-evidence',
            'regulatory-grid',
            'security-features-grid',
          ]
          return itemSections.includes(data?.sectionType)
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji)',
        },
        {
          name: 'value',
          type: 'text',
          label: 'Value/Number',
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'Image URL',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link URL',
        },
        {
          name: 'status',
          type: 'select',
          label: 'Status Badge',
          options: [
            { label: 'Validated', value: 'validated' },
            { label: 'Illustrative', value: 'illustrative' },
            { label: 'Roadmap', value: 'roadmap' },
          ],
        },
      ],
    },
    {
      name: 'leftTitle',
      type: 'text',
      label: 'Left Column Title',
      admin: {
        condition: (data) => data?.sectionType === 'security-compliance',
      },
    },
    {
      name: 'leftDescription',
      type: 'richText',
      label: 'Left Column Description',
      admin: {
        condition: (data) => data?.sectionType === 'security-compliance',
      },
    },
    {
      name: 'rightTitle',
      type: 'text',
      label: 'Right Column Title',
      admin: {
        condition: (data) => data?.sectionType === 'security-compliance',
      },
    },
    {
      name: 'rightDescription',
      type: 'richText',
      label: 'Right Column Description',
      admin: {
        condition: (data) => data?.sectionType === 'security-compliance',
      },
    },
  ],
}
