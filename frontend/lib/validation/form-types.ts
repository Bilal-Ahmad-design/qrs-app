import { z } from 'zod'

export const FORM_TYPES = {
  CONTACT: 'contact',
  DEMO_REQUEST: 'demo-request',
  VALIDATION_REPORT: 'validation-report',
  NEWSLETTER: 'newsletter',
  PRESS_INQUIRY: 'press-inquiry',
  PARTNER_INQUIRY: 'partner-inquiry',
  PRIVACY_REQUEST: 'privacy-request',
} as const

export type FormType = typeof FORM_TYPES[keyof typeof FORM_TYPES]

export const formTypeSchemas = {
  contact: z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
    turnstileToken: z.string(),
  }),

  'demo-request': z.object({
    name: z.string().min(2),
    email: z.string().email(),
    company: z.string().min(2),
    industry: z.string(),
    turnstileToken: z.string(),
  }),

  'validation-report': z.object({
    email: z.string().email(),
    report_type: z.enum(['summary', 'detailed', 'executive']),
    turnstileToken: z.string(),
  }),

  newsletter: z.object({
    email: z.string().email(),
    frequency: z.enum(['daily', 'weekly', 'monthly']),
    turnstileToken: z.string(),
  }),

  'press-inquiry': z.object({
    name: z.string().min(2),
    email: z.string().email(),
    publication: z.string(),
    inquiry: z.string().min(10),
    turnstileToken: z.string(),
  }),

  'partner-inquiry': z.object({
    company_name: z.string().min(2),
    contact_email: z.string().email(),
    partnership_type: z.string(),
    message: z.string().min(10),
    turnstileToken: z.string(),
  }),
}
