import { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'admin',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Quantitative Risk Systems',
          admin: { description: 'Hero heading' },
        },
        {
          name: 'subheading',
          type: 'textarea',
          defaultValue: 'Cryptographically verified catastrophe modeling and risk deployment',
          admin: { description: 'Hero subheading' },
        },
        {
          name: 'backgroundImage',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'cta1Label',
          type: 'text',
          defaultValue: 'Request Demo',
        },
        {
          name: 'cta1Url',
          type: 'text',
          defaultValue: '/demo',
        },
        {
          name: 'cta2Label',
          type: 'text',
          defaultValue: 'Learn More',
        },
        {
          name: 'cta2Url',
          type: 'text',
          defaultValue: '/features',
        },
      ],
    },
    {
      name: 'kpiSection',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Why Choose QRS',
        },
        {
          name: 'kpis',
          type: 'array',
          maxRows: 6,
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
              admin: { description: 'KPI value (e.g., "99.99%", "24/7")' },
            },
            {
              name: 'label',
              type: 'text',
              required: true,
              admin: { description: 'KPI label (e.g., "Uptime", "Support")' },
            },
            {
              name: 'description',
              type: 'textarea',
              admin: { description: 'Optional description' },
            },
          ],
        },
      ],
    },
    {
      name: 'featuredSections',
      type: 'array',
      maxRows: 4,
      admin: { description: 'Featured sections on homepage' },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'ctaLabel',
          type: 'text',
        },
        {
          name: 'ctaUrl',
          type: 'text',
        },
      ],
    },
    {
      name: 'testimonials',
      type: 'array',
      maxRows: 6,
      admin: { description: 'Customer testimonials' },
      fields: [
        {
          name: 'quote',
          type: 'textarea',
          required: true,
        },
        {
          name: 'author',
          type: 'text',
          required: true,
        },
        {
          name: 'company',
          type: 'text',
        },
        {
          name: 'role',
          type: 'text',
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'cta',
      type: 'group',
      admin: { description: 'Final call-to-action section' },
      fields: [
        {
          name: 'heading',
          type: 'text',
          defaultValue: 'Ready to Get Started?',
        },
        {
          name: 'description',
          type: 'textarea',
          defaultValue: 'Request a demo and see how QRS can help secure your enterprise.',
        },
        {
          name: 'buttonLabel',
          type: 'text',
          defaultValue: 'Request Demo',
        },
        {
          name: 'buttonUrl',
          type: 'text',
          defaultValue: '/demo',
        },
      ],
    },
  ],
}
