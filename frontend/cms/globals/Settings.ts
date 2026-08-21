import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  admin: {
    group: 'Configuration',
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => ['admin', 'super-admin'].includes(user?.role),
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          defaultValue: 'Streamlined QRS Monitoring',
        },
        {
          name: 'subtitle',
          type: 'text',
          defaultValue: 'Enterprise-grade portfolio intelligence',
        },
        {
          name: 'cta_text',
          type: 'text',
          defaultValue: 'Request Demo',
        },
        {
          name: 'background_image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'kpis',
      type: 'group',
      fields: [
        {
          name: 'portfolio_tiv',
          type: 'text',
          defaultValue: '$15.2T',
          admin: { description: 'Portfolio Total Insurable Value' },
        },
        {
          name: 'monitored_policies',
          type: 'text',
          defaultValue: '250K+',
          admin: { description: 'Number of monitored insurance policies' },
        },
        {
          name: 'avg_var_reduction',
          type: 'text',
          defaultValue: '42%',
          admin: { description: 'Average Value at Risk reduction' },
        },
        {
          name: 'active_users',
          type: 'text',
          defaultValue: '5K+',
          admin: { description: 'Active platform users' },
        },
      ],
    },
    {
      name: 'branding',
      type: 'group',
      fields: [
        {
          name: 'company_name',
          type: 'text',
          defaultValue: 'QRS',
        },
        {
          name: 'tagline',
          type: 'text',
          defaultValue: 'The Intelligent QRS Platform',
        },
        {
          name: 'support_email',
          type: 'email',
          defaultValue: 'support@qrs.io',
        },
        {
          name: 'support_phone',
          type: 'text',
          defaultValue: '+1 (555) 123-4567',
        },
      ],
    },
  ],
}
