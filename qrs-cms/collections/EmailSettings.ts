import { CollectionConfig } from 'payload'

export const EmailSettings: CollectionConfig = {
  slug: 'email-settings',
  labels: {
    singular: 'Email Settings',
    plural: 'Email Settings',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'smtpHost', 'isActive'],
    description: 'Configure SMTP settings for form email notifications',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: ({ req }) => req.user?.role === 'super-admin',
    update: ({ req }) => req.user?.role === 'super-admin',
    delete: ({ req }) => req.user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      defaultValue: 'Default SMTP Configuration',
      label: '📧 Configuration Name',
      admin: {
        description: 'Name for this SMTP configuration',
      },
    },

    // SMTP Settings Section
    {
      type: 'collapsible',
      label: '🔧 SMTP Server Settings',
      fields: [
        {
          name: 'smtpHost',
          type: 'text',
          required: true,
          label: 'SMTP Host',
          placeholder: 'smtp.gmail.com',
          admin: {
            description: 'SMTP server hostname (e.g., smtp.gmail.com, smtp.office365.com)',
          },
        },
        {
          name: 'smtpPort',
          type: 'number',
          required: true,
          defaultValue: 587,
          label: 'SMTP Port',
          admin: {
            description: 'SMTP port (usually 587 for TLS or 465 for SSL)',
          },
        },
        {
          name: 'smtpUser',
          type: 'text',
          required: true,
          label: 'SMTP Username',
          placeholder: 'your-email@gmail.com',
          admin: {
            description: 'Email account username/address',
          },
        },
        {
          name: 'smtpPassword',
          type: 'text',
          required: true,
          label: 'SMTP Password',
          admin: {
            type: 'password',
            description: 'Email account password or app password',
          },
        },
        {
          name: 'smtpSecure',
          type: 'checkbox',
          defaultValue: true,
          label: '🔒 Use TLS/SSL',
          admin: {
            description: 'Enable secure connection (TLS or SSL)',
          },
        },
      ],
    },

    // Email Receiving Settings
    {
      type: 'collapsible',
      label: '📨 Email Receiving Settings',
      fields: [
        {
          name: 'contactFormEmail',
          type: 'text',
          required: true,
          label: 'Contact Form Recipient Email',
          placeholder: 'support@qrsrisk.com',
          admin: {
            description: 'Where contact form submissions are sent',
          },
        },
        {
          name: 'privacyRequestEmail',
          type: 'text',
          required: true,
          label: 'Privacy Request Recipient Email',
          placeholder: 'privacy@qrsrisk.com',
          admin: {
            description: 'Where privacy/GDPR requests are sent',
          },
        },
        {
          name: 'supportEmail',
          type: 'text',
          required: true,
          label: 'Support Email Address',
          placeholder: 'support@qrsrisk.com',
          admin: {
            description: 'General support email (shown on website)',
          },
        },
        {
          name: 'senderName',
          type: 'text',
          defaultValue: 'QRS Risk Systems',
          label: 'Sender Display Name',
          admin: {
            description: 'Name shown as email sender',
          },
        },
      ],
    },

    // Email Sending Settings
    {
      type: 'collapsible',
      label: '✉️ Email Sending Settings',
      fields: [
        {
          name: 'sendContactConfirmation',
          type: 'checkbox',
          defaultValue: true,
          label: 'Send Contact Form Confirmation',
          admin: {
            description: 'Send confirmation email to user after form submission',
          },
        },
        {
          name: 'contactConfirmationTemplate',
          type: 'textarea',
          label: 'Confirmation Email Template',
          defaultValue: `Hi {{name}},

Thank you for reaching out to us. We have received your message and will respond as soon as possible.

Best regards,
QRS Risk Systems Team`,
          admin: {
            description: 'Email template for contact form confirmation. Use {{name}}, {{email}} as placeholders',
            rows: 8,
          },
        },
        {
          name: 'sendPrivacyConfirmation',
          type: 'checkbox',
          defaultValue: true,
          label: 'Send Privacy Request Confirmation',
        },
        {
          name: 'privacyConfirmationTemplate',
          type: 'textarea',
          label: 'Privacy Request Confirmation Template',
          defaultValue: `Hi {{name}},

We have received your privacy request and will process it within 30 days as required by law.

Best regards,
QRS Risk Systems Privacy Team`,
          admin: {
            rows: 8,
          },
        },
      ],
    },

    // Status & Testing
    {
      type: 'collapsible',
      label: '✅ Status & Testing',
      fields: [
        {
          name: 'isActive',
          type: 'checkbox',
          defaultValue: true,
          label: 'Activate Configuration',
          admin: {
            description: 'Enable/disable this SMTP configuration',
          },
        },
        {
          name: 'testStatus',
          type: 'text',
          admin: {
            readOnly: true,
            description: 'Last test result status',
          },
        },
        {
          name: 'lastTestedAt',
          type: 'date',
          admin: {
            readOnly: true,
            description: 'When SMTP connection was last tested',
          },
        },
      ],
    },

    // Metadata
    {
      name: 'createdAt',
      type: 'date',
      admin: {
        readOnly: true,
        hidden: true,
      },
      defaultValue: () => new Date(),
    },
  ],
}
