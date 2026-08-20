import { z } from 'zod'

/**
 * Shared validation schemas used across frontend and CMS
 * All schemas exported for both runtime validation and type inference
 */

// ============================================================================
// Auth Schemas
// ============================================================================

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullname: z.string().min(2, 'Full name must be at least 2 characters'),
})

export type SignupInput = z.infer<typeof signupSchema>

export const profileUpdateSchema = z.object({
  fullname: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

export const authResponseSchema = z.object({
  token: z.string(),
  user: z.object({
    id: z.number(),
    email: z.string(),
    fullname: z.string(),
    role: z.string(),
  }),
})

export type AuthResponse = z.infer<typeof authResponseSchema>

// ============================================================================
// Form Schemas
// ============================================================================

export const contactFormSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(2, 'Name is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  turnstileToken: z.string().min(1, 'Turnstile verification failed'),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>

export const privacyRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
  requestType: z.string(),
  description: z.string().optional(),
  turnstileToken: z.string().min(1, 'Turnstile verification failed'),
})

export type PrivacyRequestInput = z.infer<typeof privacyRequestSchema>

// ============================================================================
// Response Schemas
// ============================================================================

export const successResponseSchema = z.object({
  data: z.unknown(),
  meta: z.object({
    timestamp: z.string().datetime().optional(),
    version: z.string().optional(),
  }).optional(),
})

export type SuccessResponse<T = any> = z.infer<typeof successResponseSchema> & { data: T }

export const errorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.record(z.string(), z.unknown()).optional(),
  }),
})

export type ErrorResponse = z.infer<typeof errorResponseSchema>

// ============================================================================
// User Schemas
// ============================================================================

export const userSchema = z.object({
  id: z.number(),
  email: z.string().email(),
  fullname: z.string(),
  role: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
})

export type User = z.infer<typeof userSchema>

// ============================================================================
// CMS Page Schemas
// ============================================================================

export const pageSchema = z.object({
  id: z.number(),
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  content: z.string().optional(),
  publishedAt: z.string().datetime().optional(),
  status: z.string().optional(),
})

export type Page = z.infer<typeof pageSchema>

// ============================================================================
// Pagination Schemas
// ============================================================================

export const paginationSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
})

export type PaginationParams = z.infer<typeof paginationSchema>

export const paginatedResponseSchema = z.object({
  data: z.unknown().array(),
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
  }),
})

export type PaginatedResponse<T> = {
  data: T[]
  meta: {
    total: number
    limit: number
    offset: number
  }
}
