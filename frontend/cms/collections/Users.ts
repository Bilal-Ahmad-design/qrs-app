import { CollectionConfig } from 'payload'
import { auditAfterChangeHook, auditAfterDeleteHook } from '../lib/audit'

// Users collection with Payload authentication
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'fullname', 'role', 'isActive', 'createdAt'],
    group: 'Management',
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        autoComplete: 'email',
      },
    },
    {
      name: 'fullname',
      type: 'text',
      required: false,
      admin: {
        placeholder: 'John Doe',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'read-only',
      options: [
        { label: 'Super Admin', value: 'super-admin' },
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Reviewer', value: 'reviewer' },
        { label: 'Read-Only', value: 'read-only' },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      required: true,
    },
    {
      name: 'lastLoginAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
    {
      name: 'timezone',
      type: 'text',
      defaultValue: 'UTC',
    },
    {
      name: 'emailNotifications',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  timestamps: true,
  hooks: {
    afterChange: [auditAfterChangeHook('users')],
    afterDelete: [auditAfterDeleteHook('users')],
  },
}
