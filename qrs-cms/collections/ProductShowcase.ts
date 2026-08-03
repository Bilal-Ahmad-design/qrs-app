import { CollectionConfig } from 'payload'

export const ProductShowcase: CollectionConfig = {
  slug: 'product-showcase',
  labels: {
    singular: 'Product Showcase',
    plural: 'Product Showcases',
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
      name: 'title',
      type: 'text',
      required: true,
      label: 'Title',
      admin: {
        description: 'Display title for this product showcase (e.g., "Hero Dashboard", "Risk Map")',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Description',
      admin: {
        description: 'Detailed description of what this showcase demonstrates',
      },
    },
    {
      name: 'imageUrl',
      type: 'relationship',
      relationTo: 'media',
      label: 'Main Image',
      admin: {
        description: 'Primary product screenshot or image (recommended: 1600x900+)',
      },
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'Video URL (Optional)',
      admin: {
        description: 'URL to product demo video (MP4, WebM, etc.)',
        placeholder: 'https://example.com/video.mp4',
      },
    },
    {
      name: 'posterImage',
      type: 'relationship',
      relationTo: 'media',
      label: 'Video Poster Image (Optional)',
      admin: {
        description: 'Fallback image displayed before video plays (1600x900+)',
      },
    },
    {
      name: 'reducedMotion',
      type: 'checkbox',
      label: 'Respect Reduced Motion',
      defaultValue: true,
      admin: {
        description: 'If enabled, video will not autoplay for users who prefer reduced motion',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Image Caption (Optional)',
      admin: {
        description: 'Short caption displayed below the image',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        description: 'Controls the display order on pages (lower numbers appear first)',
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      options: [
        { label: 'Hero', value: 'hero' },
        { label: 'Risk Map', value: 'risk-map' },
        { label: 'War Room', value: 'war-room' },
        { label: 'EP Curve', value: 'ep-curve' },
        { label: 'Portfolio Analysis', value: 'portfolio' },
        { label: 'Verification', value: 'verification' },
        { label: 'Platform Feature', value: 'platform-feature' },
      ],
      admin: {
        description: 'Categorize this showcase for easy filtering',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      label: 'Published',
      defaultValue: true,
      admin: {
        description: 'Show this showcase on the website',
      },
    },
  ],
}
