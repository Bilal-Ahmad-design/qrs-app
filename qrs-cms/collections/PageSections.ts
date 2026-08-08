import { CollectionConfig } from 'payload'

export const PageSections: CollectionConfig = {
  slug: 'page-sections',
  labels: {
    singular: 'Page Section',
    plural: 'Page Sections',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'page', 'order', 'published'],
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
      label: 'Page',
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
      admin: {
        description: 'Which page this section appears on',
      },
    },
    {
      name: 'sectionType',
      type: 'select',
      required: true,
      label: 'Section Type',
      options: [
        { label: 'Hero', value: 'hero' },
        { label: 'Feature Grid', value: 'feature-grid' },
        { label: 'Text + Image', value: 'text-image' },
        { label: 'CTA Block', value: 'cta' },
        { label: 'Testimonial/Quote', value: 'quote' },
        { label: 'FAQ', value: 'faq' },
        { label: 'Stats', value: 'stats' },
        { label: 'Comparison', value: 'comparison' },
        { label: 'Custom', value: 'custom' },
      ],
      admin: {
        description: 'Type of section layout',
        hidden: true,
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Section Title',
      admin: {
        description: 'Display title for this section',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      label: 'Subtitle',
      admin: {
        description: 'Optional subtitle or tagline',
      },
    },
    {
      name: 'heading',
      type: 'richText',
      label: 'Heading (H1/H2)',
      admin: {
        description: 'Main heading text for this section',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      admin: {
        description: 'Main description/body text',
      },
    },
    {
      name: 'content',
      type: 'json',
      label: 'Section Content (JSON)',
      admin: {
        description: 'Flexible JSON field for section-specific data',
      },
    },
    {
      name: 'backgroundStyle',
      type: 'select',
      label: 'Background Style',
      options: [
        { label: 'Dark (ink-800)', value: 'dark' },
        { label: 'Light Gray (cream-50)', value: 'light' },
        { label: 'White', value: 'white' },
        { label: 'Light Institutional (light-bg-primary)', value: 'light-institutional' },
        { label: 'Deep Dark (ink-900)', value: 'deep-dark' },
      ],
      defaultValue: 'light',
      admin: {
        description: 'Background color for this section',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Items/Cards',
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Item Title',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Item Description',
        },
        {
          name: 'icon',
          type: 'text',
          label: 'Icon (emoji or name)',
        },
        {
          name: 'value',
          type: 'text',
          label: 'Value/Number (for stats)',
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
          admin: {
            description: 'Display status badge on card (optional)',
          },
        },
      ],
      admin: {
        description: 'Array of items for grids, cards, stats, etc',
      },
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Hero Image URL',
      admin: {
        description: 'URL to hero image (only for hero sections)',
        condition: (data) => data?.sectionType === 'hero',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Hero Video URL',
      admin: {
        description: 'URL to hero video MP4 (only for hero sections)',
        condition: (data) => data?.sectionType === 'hero',
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Button Text',
      admin: {
        description: 'Text for primary CTA button (only for hero sections)',
        condition: (data) => data?.sectionType === 'hero',
      },
    },
    {
      name: 'buttonUrl',
      type: 'text',
      label: 'Button URL',
      admin: {
        description: 'Link for primary CTA button (only for hero sections)',
        condition: (data) => data?.sectionType === 'hero',
      },
    },
    {
      name: 'secondaryButtonText',
      type: 'text',
      label: 'Secondary Button Text',
      admin: {
        description: 'Text for secondary CTA button (only for hero sections)',
        condition: (data) => data?.sectionType === 'hero',
      },
    },
    {
      name: 'secondaryButtonUrl',
      type: 'text',
      label: 'Secondary Button URL',
      admin: {
        description: 'Link for secondary CTA button (only for hero sections)',
        condition: (data) => data?.sectionType === 'hero',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description: 'Controls order of sections on page (0, 1, 2, etc)',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Published',
      defaultValue: true,
      admin: {
        description: 'Show this section on the website',
      },
    },
  ],
}
