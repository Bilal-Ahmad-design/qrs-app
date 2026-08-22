import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => user?.role === 'super-admin' || user?.role === 'admin',
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      defaultValue: 'QRS - Quantitative Risk Systems',
      admin: {
        description: 'Primary site name',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Cryptographically verified catastrophe modeling and risk deployment',
      admin: {
        description: 'Site tagline for meta descriptions',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Main logo (light theme)',
      },
    },
    {
      name: 'logoDark',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Logo for dark backgrounds',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Favicon for browser tabs',
      },
    },
    {
      name: 'contactEmails',
      type: 'group',
      fields: [
        {
          name: 'support',
          type: 'email',
          defaultValue: 'support@qrs.app',
        },
        {
          name: 'sales',
          type: 'email',
          defaultValue: 'sales@qrs.app',
        },
        {
          name: 'security',
          type: 'email',
          defaultValue: 'security@qrs.app',
        },
        {
          name: 'legal',
          type: 'email',
          defaultValue: 'legal@qrs.app',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Twitter', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'GitHub', value: 'github' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'announcementBar',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'message',
          type: 'textarea',
        },
        {
          name: 'backgroundColor',
          type: 'text',
          defaultValue: '#000',
        },
      ],
    },
    {
      name: 'maintenanceMode',
      type: 'group',
      fields: [
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'message',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'gaTrackingId',
          type: 'text',
          admin: { description: 'Google Analytics tracking ID' },
        },
        {
          name: 'enabled',
          type: 'checkbox',
          defaultValue: true,
        },
      ],
    },
  ],
}
