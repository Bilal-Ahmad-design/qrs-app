import { CollectionConfig } from 'payload'

export const Solutions: CollectionConfig = {
  slug: 'solutions',
  labels: {
    singular: 'Solution',
    plural: 'Solutions',
  },
  admin: {
    useAsTitle: 'displayName',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'super-admin' || req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'super-admin' || req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'roleTitle',
      type: 'select',
      required: true,
      label: 'Buyer Role',
      options: [
        { label: 'Underwriter', value: 'underwriter' },
        { label: 'Portfolio Manager', value: 'portfolio' },
        { label: 'Reinsurance Buyer', value: 'reinsurance' },
        { label: 'ILS Manager', value: 'ils' },
        { label: 'Chief Risk Officer (CRO)', value: 'cro' },
      ],
      admin: {
        description: 'Target buyer persona for this solution',
      },
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
      label: 'Display Name',
      admin: {
        description: 'Human-readable name (e.g., "Underwriting Solutions")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      label: 'URL Slug',
      admin: {
        description: 'URL-friendly slug (e.g., "underwriting")',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      label: 'Tagline',
      admin: {
        description: 'Short description of this solution (one sentence)',
      },
    },
    {
      name: 'challenges',
      type: 'array',
      label: 'Key Challenges',
      fields: [
        {
          name: 'challenge',
          type: 'richText',
          label: 'Challenge Description',
        },
      ],
      admin: {
        description: 'List of challenges this buyer persona faces',
      },
    },
    {
      name: 'qrsValue',
      type: 'array',
      label: 'QRS Value Propositions',
      fields: [
        {
          name: 'value',
          type: 'richText',
          label: 'Value Description',
        },
      ],
      admin: {
        description: 'How QRS solves these challenges',
      },
    },
    {
      name: 'useCases',
      type: 'array',
      label: 'Use Cases',
      fields: [
        {
          name: 'useCase',
          type: 'richText',
          label: 'Use Case Description',
        },
      ],
      admin: {
        description: 'Specific use cases for this role',
      },
    },
    {
      name: 'roi',
      type: 'richText',
      label: 'Return on Investment / Benefits',
      admin: {
        description: 'Quantified or qualitative benefits of using QRS',
      },
    },
    {
      name: 'icon',
      type: 'relationship',
      relationTo: 'media',
      label: 'Role Icon (Optional)',
      admin: {
        description: 'Icon or avatar representing this buyer role',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description: 'Controls the display order on solutions page',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Published',
      defaultValue: true,
      admin: {
        description: 'Show this solution on the website',
      },
    },
  ],
}
