import { z } from 'zod'

// Base form schema
const baseFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  company: z.string().optional(),
  phone: z.string().optional(),
  turnstileToken: z.string().min(1, 'Please complete the verification'),
})

// Contact form
export const contactFormSchema = baseFormSchema.extend({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
})

// Demo request form
export const demoFormSchema = baseFormSchema.extend({
  companySize: z.enum(['startup', 'small', 'medium', 'enterprise']),
  useCases: z.array(z.string()).min(1, 'Select at least one use case'),
  timeline: z.enum(['immediate', '1-3-months', '3-6-months', 'exploring']),
})

// Support form
export const supportFormSchema = baseFormSchema.extend({
  issueType: z.enum(['bug', 'feature-request', 'billing', 'general']),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  caseNumber: z.string().optional(),
})

// Newsletter signup
export const newsletterFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  interests: z.array(z.string()).optional(),
  turnstileToken: z.string().min(1, 'Please complete the verification'),
})

// Privacy request
export const privacyFormSchema = baseFormSchema.extend({
  requestType: z.enum(['access', 'delete', 'export', 'rectify']),
  accountId: z.string().optional(),
})

// RFP (Request for Proposal)
export const rfpFormSchema = baseFormSchema.extend({
  proposalType: z.string(),
  budget: z.string().optional(),
  deadline: z.string().optional(),
  attachmentUrl: z.string().optional(),
})

// Press inquiry
export const pressFormSchema = baseFormSchema.extend({
  organization: z.string().min(2, 'Organization name required'),
  publicationUrl: z.string().url('Invalid publication URL'),
  deadline: z.string().optional(),
})

// Partner inquiry
export const partnerFormSchema = baseFormSchema.extend({
  partnerType: z.enum(['reseller', 'technology', 'service', 'other']),
  regions: z.array(z.string()).min(1, 'Select at least one region'),
})

// Validation report request
export const validationReportFormSchema = baseFormSchema.extend({
  analysisType: z.string(),
  dataSize: z.string().optional(),
  urgency: z.enum(['low', 'normal', 'high']),
})

// Form type to schema mapping
export const formSchemas = {
  contact: contactFormSchema,
  'demo-request': demoFormSchema,
  support: supportFormSchema,
  newsletter: newsletterFormSchema,
  'privacy-request': privacyFormSchema,
  rfp: rfpFormSchema,
  'press-inquiry': pressFormSchema,
  'partner-inquiry': partnerFormSchema,
  'validation-report-request': validationReportFormSchema,
} as const

export type FormType = keyof typeof formSchemas
export type ContactForm = z.infer<typeof contactFormSchema>
export type DemoForm = z.infer<typeof demoFormSchema>
export type SupportForm = z.infer<typeof supportFormSchema>
export type NewsletterForm = z.infer<typeof newsletterFormSchema>
export type PrivacyForm = z.infer<typeof privacyFormSchema>
export type RfpForm = z.infer<typeof rfpFormSchema>
export type PressForm = z.infer<typeof pressFormSchema>
export type PartnerForm = z.infer<typeof partnerFormSchema>
export type ValidationReportForm = z.infer<typeof validationReportFormSchema>
