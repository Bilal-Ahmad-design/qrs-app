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
    // ============ COMMON FIELDS (ALL SECTIONS) ============
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

    // ============ HERO SECTION ONLY ============
    {
      type: 'collapsible',
      label: '🎬 HERO SECTION FIELDS',
      admin: {
        condition: (data) => data?.sectionType === 'hero',
      },
      fields: [
        {
          name: 'subtitle',
          type: 'text',
          label: 'Subtitle/Badge Text',
          admin: {
            description: 'Small badge text above heading',
          },
        },
        {
          name: 'heading',
          type: 'richText',
          label: 'Main Heading',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Description',
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'Hero Image URL',
          admin: {
            description: 'Background image for hero section',
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'Background Video URL (MP4)',
          admin: {
            description: 'Video plays behind content',
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'Primary Button Text',
        },
        {
          name: 'buttonUrl',
          type: 'text',
          label: 'Primary Button URL',
        },
        {
          name: 'secondaryButtonText',
          type: 'text',
          label: 'Secondary Button Text',
        },
        {
          name: 'secondaryButtonUrl',
          type: 'text',
          label: 'Secondary Button URL',
        },
      ],
    },

    // ============ TEXT-IMAGE & CTA SECTIONS ============
    {
      type: 'collapsible',
      label: '📝 TEXT-IMAGE / CTA FIELDS',
      admin: {
        condition: (data) =>
          data?.sectionType === 'text-image' ||
          data?.sectionType === 'cta',
      },
      fields: [
        {
          name: 'heading',
          type: 'richText',
          label: 'Heading',
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Description/Body Text',
        },
        {
          name: 'imageUrl',
          type: 'text',
          label: 'Image URL (for text-image only)',
          admin: {
            condition: (data) => data?.sectionType === 'text-image',
            description: 'Image displayed next to text',
          },
        },
        {
          name: 'buttonText',
          type: 'text',
          label: 'Button Text',
        },
        {
          name: 'buttonUrl',
          type: 'text',
          label: 'Button URL',
        },
      ],
    },

    // ============ ITEMS-BASED SECTIONS (Grid, Stats, Workflow, etc) ============
    {
      type: 'collapsible',
      label: '📋 ITEMS/CARDS CONFIGURATION',
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
          name: 'heading',
          type: 'richText',
          label: 'Section Heading',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Section Description',
        },
        {
          name: 'items',
          type: 'array',
          label: 'Items/Cards',
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
              admin: {
                description: 'Add emoji directly',
              },
            },
            {
              name: 'value',
              type: 'text',
              label: 'Value/Number (for stats only)',
            },
            {
              name: 'imageUrl',
              type: 'text',
              label: 'Image URL (product-evidence only)',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link URL',
            },
            {
              name: 'status',
              type: 'select',
              label: 'Status Badge (feature-grid only)',
              options: [
                { label: 'Validated', value: 'validated' },
                { label: 'Illustrative', value: 'illustrative' },
                { label: 'Roadmap', value: 'roadmap' },
              ],
            },
          ],
        },
      ],
    },

    // ============ SECURITY COMPLIANCE SECTION ============
    {
      type: 'collapsible',
      label: '🔒 SECURITY COMPLIANCE FIELDS',
      admin: {
        condition: (data) => data?.sectionType === 'security-compliance',
      },
      fields: [
        {
          name: 'heading',
          type: 'richText',
          label: 'Main Heading',
        },
        {
          name: 'description',
          type: 'richText',
          label: 'Main Description',
        },
        {
          name: 'leftTitle',
          type: 'text',
          label: 'Left Column Title',
        },
        {
          name: 'leftDescription',
          type: 'richText',
          label: 'Left Column Description',
        },
        {
          name: 'rightTitle',
          type: 'text',
          label: 'Right Column Title',
        },
        {
          name: 'rightDescription',
          type: 'richText',
          label: 'Right Column Description',
        },
      ],
    },
  ],
}
