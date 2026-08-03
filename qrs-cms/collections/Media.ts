import { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    useAsTitle: 'filename',
  },
  upload: {
    staticDir: '../public/media',
    staticURL: '/media',
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        crop: 'center',
      },
      {
        name: 'card',
        width: 600,
        height: 400,
        crop: 'center',
      },
      {
        name: 'hero',
        width: 1200,
        height: 600,
        crop: 'center',
      },
    ],
    mimeTypes: ['image/*', 'application/pdf'],
  },
  access: {
    read: true,
    create: ({ req: { user } }) => ['editor', 'admin', 'super-admin'].includes(user?.role),
    update: ({ req: { user } }) => ['editor', 'admin', 'super-admin'].includes(user?.role),
    delete: ({ req: { user } }) => ['admin', 'super-admin'].includes(user?.role),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  timestamps: true,
}
