import { CollectionConfig } from 'payload'

export const FormEntries: CollectionConfig = {
  slug: 'form-entries',
  labels: {
    singular: 'Form Entry',
    plural: 'Form Entries',
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'formType', 'reviewStatus', 'createdAt'],
    description: 'Manage all form submissions and their email status',
    group: 'Forms & Emails',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => false, // Only API can create
    update: ({ req }) => req.user?.role === 'admin' || req.user?.role === 'super-admin',
    delete: ({ req }) => req.user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'email',
      type: 'text',
      required: true,
      label: '📧 Email Address',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'formType',
      type: 'select',
      required: true,
      label: 'Form Type',
      options: [
        { label: '💬 Contact Form', value: 'contact' },
        { label: '🔐 Privacy Request', value: 'privacy-request' },
      ],
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'submitterName',
      type: 'text',
      label: 'Submitter Name',
      admin: {
        readOnly: true,
      },
    },

    {
      type: 'collapsible',
      label: '📝 Form Data',
      fields: [
        {
          name: 'formData',
          type: 'json',
          label: 'Raw Form Data',
          admin: {
            readOnly: true,
          },
        },

        {
          name: 'message',
          type: 'textarea',
          label: 'Message Content',
          admin: {
            readOnly: true,
            rows: 8,
          },
        },
      ],
    },

    {
      type: 'collapsible',
      label: '✉️ Email Status',
      fields: [
        {
          name: 'adminEmailSent',
          type: 'checkbox',
          defaultValue: false,
          label: 'Admin Notification Sent',
          admin: {
            readOnly: true,
          },
        },

        {
          name: 'adminEmailStatus',
          type: 'select',
          defaultValue: 'pending',
          label: 'Admin Email Status',
          options: [
            { label: '⏳ Pending', value: 'pending' },
            { label: '✅ Sent', value: 'sent' },
            { label: '❌ Failed', value: 'failed' },
          ],
          admin: {
            readOnly: true,
          },
        },

        {
          name: 'confirmationEmailSent',
          type: 'checkbox',
          defaultValue: false,
          label: 'User Confirmation Email Sent',
          admin: {
            readOnly: true,
          },
        },

        {
          name: 'confirmationEmailStatus',
          type: 'select',
          defaultValue: 'pending',
          label: 'Confirmation Email Status',
          options: [
            { label: '⏳ Pending', value: 'pending' },
            { label: '✅ Sent', value: 'sent' },
            { label: '❌ Failed', value: 'failed' },
          ],
          admin: {
            readOnly: true,
          },
        },

        {
          name: 'emailErrors',
          type: 'textarea',
          label: 'Email Errors (if any)',
          admin: {
            readOnly: true,
            rows: 4,
          },
        },
      ],
    },

    {
      type: 'collapsible',
      label: '🔍 Review & Response',
      fields: [
        {
          name: 'reviewStatus',
          type: 'select',
          required: true,
          defaultValue: 'pending',
          label: 'Review Status',
          options: [
            { label: '⏳ Pending', value: 'pending' },
            { label: '👀 In Review', value: 'reviewing' },
            { label: '✅ Responded', value: 'responded' },
            { label: '❓ Needs Info', value: 'needs-info' },
            { label: '🚫 Spam', value: 'spam' },
          ],
        },

        {
          name: 'reviewedBy',
          type: 'relationship',
          relationTo: 'users',
          label: 'Reviewed By (Admin)',
        },

        {
          name: 'reviewedAt',
          type: 'date',
          label: 'Reviewed At',
        },

        {
          name: 'adminNotes',
          type: 'textarea',
          label: 'Admin Notes',
          admin: {
            rows: 6,
          },
        },

        {
          name: 'responseText',
          type: 'textarea',
          label: 'Response Sent to User',
          admin: {
            rows: 6,
          },
        },
      ],
    },

    {
      type: 'collapsible',
      label: '🔒 Security & Metadata',
      fields: [
        {
          name: 'ipAddress',
          type: 'text',
          label: 'IP Address',
          admin: {
            readOnly: true,
          },
        },

        {
          name: 'turnstileVerified',
          type: 'checkbox',
          label: 'Turnstile CAPTCHA Verified',
          admin: {
            readOnly: true,
          },
        },

        {
          name: 'createdAt',
          type: 'date',
          label: 'Submitted At',
          admin: {
            readOnly: true,
          },
        },

        {
          name: 'userAgent',
          type: 'textarea',
          label: 'User Agent',
          admin: {
            readOnly: true,
            rows: 2,
          },
        },
      ],
    },
  ],
}
