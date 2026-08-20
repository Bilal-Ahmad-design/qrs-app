/**
 * Unified response and error shapes for all API routes
 * Used by both frontend and CMS to ensure consistency
 */

import { NextResponse } from 'next/server'
import type { SuccessResponse, ErrorResponse } from './schemas'

// ============================================================================
// Success Response Builder
// ============================================================================

/**
 * Creates a standardized success response
 * @param data - The response payload
 * @param status - HTTP status code (default 200)
 * @param meta - Optional metadata
 */
export function createSuccessResponse<T>(
  data: T,
  status: number = 200,
  meta?: Record<string, any>
): NextResponse<SuccessResponse<T>> {
  const response: SuccessResponse<T> = {
    data,
    meta: meta ? {
      timestamp: new Date().toISOString(),
      ...meta,
    } : undefined,
  }

  return NextResponse.json(response, { status })
}

// ============================================================================
// Error Response Builder
// ============================================================================

type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'CONFLICT'
  | 'RATE_LIMITED'
  | 'INTERNAL_SERVER_ERROR'
  | 'SERVICE_UNAVAILABLE'

interface ErrorOptions {
  code: ErrorCode
  message: string
  details?: Record<string, any>
  status?: number
}

/**
 * Creates a standardized error response
 * @param code - Error code (user-safe identifier)
 * @param message - User-facing error message
 * @param details - Optional details for debugging (logged server-side)
 * @param status - HTTP status code
 */
export function createErrorResponse(
  { code, message, details, status = 500 }: ErrorOptions
): NextResponse<ErrorResponse> {
  // Log full error details server-side
  if (details) {
    console.error(`[${code}] ${message}`, details)
  }

  const response: ErrorResponse = {
    error: {
      code,
      message,
      // Only include details in development or for internal errors
      ...(process.env.NODE_ENV === 'development' && details ? { details } : {}),
    },
  }

  return NextResponse.json(response, { status })
}

// ============================================================================
// Convenience Error Creators
// ============================================================================

export const ApiErrors = {
  validation: (message: string, details?: Record<string, any>) =>
    createErrorResponse({
      code: 'VALIDATION_ERROR',
      message,
      details,
      status: 400,
    }),

  unauthorized: (message = 'Authentication required') =>
    createErrorResponse({
      code: 'UNAUTHORIZED',
      message,
      status: 401,
    }),

  forbidden: (message = 'You do not have permission to access this resource') =>
    createErrorResponse({
      code: 'FORBIDDEN',
      message,
      status: 403,
    }),

  notFound: (message = 'Resource not found') =>
    createErrorResponse({
      code: 'NOT_FOUND',
      message,
      status: 404,
    }),

  conflict: (message: string) =>
    createErrorResponse({
      code: 'CONFLICT',
      message,
      status: 409,
    }),

  rateLimited: (message = 'Too many requests. Please try again later') =>
    createErrorResponse({
      code: 'RATE_LIMITED',
      message,
      status: 429,
    }),

  internal: (message = 'An unexpected error occurred', details?: Record<string, any>) =>
    createErrorResponse({
      code: 'INTERNAL_SERVER_ERROR',
      message,
      details,
      status: 500,
    }),

  unavailable: (message = 'Service temporarily unavailable') =>
    createErrorResponse({
      code: 'SERVICE_UNAVAILABLE',
      message,
      status: 503,
    }),
}

// ============================================================================
// Validation Error Helper
// ============================================================================

import { z } from 'zod'

/**
 * Converts Zod validation errors to API error response
 */
export function handleValidationError(error: z.ZodError) {
  const details: Record<string, string[]> = {}

  for (const issue of error.issues) {
    const path = issue.path.join('.')
    if (!details[path]) {
      details[path] = []
    }
    details[path].push(issue.message)
  }

  return ApiErrors.validation('Validation failed', details)
}
