import { CollectionConfig } from 'payload'

export const PlatformCapability: CollectionConfig = {
  slug: 'platform-capability',
  labels: {
    singular: 'Platform Capability',
    plural: 'Platform Capabilities',
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.role === 'super-admin' || req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'super-admin' || req.user?.role === 'admin',
    delete: ({ req }) => req.user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'category',
      type: 'select',
      required: true,
      label: 'Category',
      options: [
        { label: 'Risk Engine', value: 'risk-engine' },
        { label: 'Quantum Computing', value: 'quantum' },
        { label: 'AI & Machine Learning', value: 'ai' },
        { label: 'Integration & APIs', value: 'integration' },
        { label: 'Verification & Security', value: 'verification' },
        { label: 'Analytics', value: 'analytics' },
      ],
      admin: {
        description: 'Platform category for this capability',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Capability Title',
      admin: {
        description: 'Name of this platform capability',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      admin: {
        description: 'Detailed explanation of this capability',
      },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Key Features',
      fields: [
        {
          name: 'feature',
          type: 'text',
          label: 'Feature',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description (Optional)',
        },
      ],
      admin: {
        description: 'List of features included in this capability',
      },
    },
    {
      name: 'icon',
      type: 'relationship',
      relationTo: 'media',
      label: 'Icon or Visual (Optional)',
      admin: {
        description: 'Icon or illustration for this capability',
      },
    },
    {
      name: 'relatedCapabilities',
      type: 'relationship',
      relationTo: 'platform-capability',
      hasMany: true,
      label: 'Related Capabilities',
      admin: {
        description: 'Link to other related capabilities',
      },
    },
    {
      name: 'technicalDetails',
      type: 'richText',
      label: 'Technical Details (Optional)',
      admin: {
        description: 'Deep technical information for advanced users',
      },
    },
    {
      name: 'useCases',
      type: 'array',
      label: 'Use Cases',
      fields: [
        {
          name: 'useCase',
          type: 'text',
          label: 'Use Case',
        },
      ],
      admin: {
        description: 'Specific use cases for this capability',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description: 'Controls display order within category',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Published',
      defaultValue: true,
      admin: {
        description: 'Show this capability on the website',
      },
    },
  ],
}
