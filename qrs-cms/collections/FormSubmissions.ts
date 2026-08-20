import { CollectionConfig } from 'payload'
import { hasPermission } from '../lib/rbac/roles'

export const FormSubmissions: CollectionConfig = {
  slug: 'form-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['formType', 'email', 'submittedAt', 'reviewStatus'],
  },
  access: {
    read: ({ req: { user } }) => hasPermission(user?.role as any, 'forms:read'),
    create: ({ req }) => {
      // Only allow via API, not via admin UI
      if (req.data?.fromAPI) return true
      return false
    },
    update: ({ req: { user } }) => hasPermission(user?.role as any, 'forms:read'),
    delete: ({ req: { user } }) => hasPermission(user?.role as any, 'audit:read'),
  },
  fields: [
    {
      name: 'formType',
      type: 'select',
      required: true,
      options: [
        { label: 'Demo Request', value: 'demo-request' },
        { label: 'Validation Report Request', value: 'validation-report-request' },
        { label: 'Newsletter Signup', value: 'newsletter' },
        { label: 'General Contact', value: 'contact' },
        { label: 'Privacy Request', value: 'privacy-request' },
        { label: 'Press Inquiry', value: 'press' },
        { label: 'RFP Response', value: 'rfp' },
        { label: 'Partner Inquiry', value: 'partner' },
        { label: 'Escalation', value: 'escalation' },
      ],
    },
    {
      name: 'data',
      type: 'json',
      required: true,
      admin: { description: 'Raw form submission data' },
    },
    { name: 'email', type: 'email', required: true, index: true },
    { name: 'ipAddress', type: 'text' },
    { name: 'turnstileVerified', type: 'checkbox', defaultValue: false },
    { name: 'submittedAt', type: 'date', required: true, defaultValue: () => new Date().toISOString() },
    {
      name: 'reviewStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Reviewed', value: 'reviewed' },
        { label: 'Responded', value: 'responded' },
        { label: 'Archived', value: 'archived' },
      ],
    },
  ],
  timestamps: true,
}
