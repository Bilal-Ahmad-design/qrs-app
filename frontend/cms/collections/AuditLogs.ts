import { CollectionConfig } from 'payload'

export const AuditLogs: CollectionConfig = {
  slug: 'audit-logs',
  admin: {
    useAsTitle: 'timestamp',
    defaultColumns: ['user', 'action', 'collectionName', 'documentId', 'timestamp'],
    group: 'Management',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userEmail',
      type: 'email',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'collectionName',
      type: 'select',
      required: true,
      options: [
        { label: 'Users', value: 'users' },
        { label: 'Pages', value: 'pages' },
        { label: 'Blog', value: 'blog' },
        { label: 'Validation Reports', value: 'validation-reports' },
        { label: 'Peril Status', value: 'peril-status' },
        { label: 'Product Showcase', value: 'product-showcase' },
        { label: 'Solutions', value: 'solutions' },
        { label: 'Platform Capabilities', value: 'platform-capabilities' },
        { label: 'Media', value: 'media' },
        { label: 'Form Submissions', value: 'form-submissions' },
        { label: 'Form Entries', value: 'form-entries' },
        { label: 'Email Settings', value: 'email-settings' },
        { label: 'Email Logs', value: 'email-logs' },
        { label: 'Redirects', value: 'redirects' },
        { label: 'Page Sections', value: 'page-sections' },
        { label: 'Documentation', value: 'documentation' },
        { label: 'Regulatory Compliance', value: 'regulatory-compliance' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'documentId',
      type: 'text',
      required: true,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Create', value: 'create' },
        { label: 'Update', value: 'update' },
        { label: 'Delete', value: 'delete' },
        { label: 'Publish', value: 'publish' },
        { label: 'Unpublish', value: 'unpublish' },
        { label: 'Login', value: 'login' },
        { label: 'Login Failed', value: 'login-failed' },
        { label: 'Logout', value: 'logout' },
        { label: 'Role Change', value: 'role-change' },
        { label: 'Form Submit', value: 'form-submit' },
      ],
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'changes',
      type: 'json',
      required: false,
      admin: {
        readOnly: true,
        hidden: false,
      },
    },
    {
      name: 'ipAddress',
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'userAgent',
      type: 'text',
      required: false,
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'timestamp',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        readOnly: true,
      },
    },
  ],
  timestamps: false,
  access: {
    read: ({ req }) => {
      if (!req.user) return false
      if (req.user.role === 'super-admin' || req.user.role === 'admin') return true
      return false
    },
    create: () => false,
    update: () => false,
    delete: () => false,
  },
}
