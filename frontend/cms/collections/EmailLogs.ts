import { CollectionConfig } from 'payload'

export const EmailLogs: CollectionConfig = {
  slug: 'email-logs',
  labels: {
    singular: 'Email Log',
    plural: 'Email Logs',
  },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['recipient', 'subject', 'status', 'sentAt'],
    description: 'Track all sent emails from forms',
    group: 'Forms & Emails',
  },
  access: {
    read: ({ req }) => !!req.user,
    create: () => false, // Only API can create
    update: ({ req }) => req.user?.role === 'super-admin',
    delete: ({ req }) => req.user?.role === 'super-admin',
  },
  fields: [
    {
      name: 'formSubmissionId',
      type: 'text',
      label: 'Form Submission ID',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'recipient',
      type: 'text',
      required: true,
      label: 'Recipient Email',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'sender',
      type: 'text',
      label: 'Sender Email',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'subject',
      type: 'text',
      required: true,
      label: 'Subject',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'emailType',
      type: 'select',
      required: true,
      label: 'Email Type',
      options: [
        { label: 'Form Submission (Admin)', value: 'form-submission' },
        { label: 'Confirmation (User)', value: 'confirmation' },
        { label: 'Privacy Request (Admin)', value: 'privacy-request' },
      ],
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'bodyPreview',
      type: 'textarea',
      label: 'Email Body Preview',
      admin: {
        readOnly: true,
        rows: 6,
      },
    },

    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      label: 'Status',
      options: [
        { label: '⏳ Pending', value: 'pending' },
        { label: '✅ Sent', value: 'sent' },
        { label: '❌ Failed', value: 'failed' },
        { label: '⚠️ Bounced', value: 'bounced' },
      ],
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'errorMessage',
      type: 'textarea',
      label: 'Error Message',
      admin: {
        readOnly: true,
        rows: 3,
        condition: (data) => data?.status === 'failed',
      },
    },

    {
      name: 'sentAt',
      type: 'date',
      label: 'Sent At',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'attemptCount',
      type: 'number',
      defaultValue: 0,
      label: 'Retry Attempts',
      admin: {
        readOnly: true,
      },
    },

    {
      name: 'nextRetryAt',
      type: 'date',
      label: 'Next Retry At',
      admin: {
        readOnly: true,
        condition: (data) => data?.status === 'failed',
      },
    },
  ],
}
