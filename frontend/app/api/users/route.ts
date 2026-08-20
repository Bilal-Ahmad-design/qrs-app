import { NextRequest, NextResponse } from 'next/server'
import pg from 'pg'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { requirePermission, requireRole } from '@/lib/rbac/middleware'
import { createSuccessResponse, createErrorResponse, ApiErrors } from '@/lib/validation/responses'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

// Validation schemas
const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullname: z.string().min(1, 'Fullname is required'),
  role: z.enum(['super-admin', 'admin', 'editor', 'reviewer', 'read-only']).optional().default('read-only'),
})

const updateUserSchema = z.object({
  id: z.number().positive('User ID must be a positive number'),
  fullname: z.string().min(1, 'Fullname is required').optional(),
  role: z.enum(['super-admin', 'admin', 'editor', 'reviewer', 'read-only']).optional(),
  status: z.enum(['active', 'inactive', 'suspended']).optional(),
})

const deleteUserSchema = z.object({
  id: z.number().positive('User ID must be a positive number'),
})

/**
 * GET /api/users - List all users (requires users:read permission)
 */
export async function GET(request: NextRequest) {
  try {
    // Check auth + permission using middleware
    const auth = requirePermission(request, 'users:read')
    if (auth instanceof NextResponse) return auth

    const result = await pool.query(
      'SELECT id, email, fullname, role, created_at FROM users ORDER BY created_at DESC'
    )

    return createSuccessResponse(result.rows, 'Users retrieved successfully')
  } catch (error) {
    console.error('Get users error:', error)
    return createErrorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to retrieve users')
  }
}

/**
 * POST /api/users - Create new user (requires users:create permission)
 */
export async function POST(request: NextRequest) {
  try {
    // Check auth + permission
    const auth = requirePermission(request, 'users:create')
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    // Validate input
    const result = createUserSchema.safeParse(body)
    if (!result.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid input', result.error.errors)
    }

    const { email, password, fullname, role } = result.data

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    )

    if (existingUser.rows.length > 0) {
      return createErrorResponse('USER_EXISTS', 'Email already registered')
    }

    // Super-admin can create any role, admin can create up to editor
    if (auth.role === 'admin' && ['super-admin', 'admin'].includes(role)) {
      return ApiErrors.forbidden('Insufficient permissions to create this role')
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const insertResult = await pool.query(
      `INSERT INTO users (email, password, fullname, role, created_at)
       VALUES ($1, $2, $3, $4, NOW())
       RETURNING id, email, fullname, role, created_at`,
      [email, hashedPassword, fullname, role]
    )

    const newUser = insertResult.rows[0]

    return createSuccessResponse(newUser, 'User created successfully', 201)
  } catch (error) {
    console.error('Create user error:', error)
    return createErrorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to create user')
  }
}

/**
 * PUT /api/users/:id - Update user (requires users:update permission)
 */
export async function PUT(request: NextRequest) {
  try {
    // Check auth + permission
    const auth = requirePermission(request, 'users:update')
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    // Validate input
    const result = updateUserSchema.safeParse(body)
    if (!result.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid input', result.error.errors)
    }

    const { id, fullname, role, status } = result.data

    // Build update query
    const updates: string[] = []
    const values: any[] = []
    let paramCount = 1

    if (fullname !== undefined) {
      updates.push(`fullname = $${paramCount}`)
      values.push(fullname)
      paramCount++
    }

    if (role !== undefined) {
      // Super-admin can set any role, admin cannot set super-admin
      if (auth.role === 'admin' && role === 'super-admin') {
        return ApiErrors.forbidden('Cannot promote to super-admin')
      }

      updates.push(`role = $${paramCount}`)
      values.push(role)
      paramCount++
    }

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`)
      values.push(status)
      paramCount++
    }

    if (updates.length === 0) {
      return createErrorResponse('VALIDATION_ERROR', 'No fields to update')
    }

    values.push(id)

    const query = `
      UPDATE users
      SET ${updates.join(', ')}, updated_at = NOW()
      WHERE id = $${paramCount}
      RETURNING id, email, fullname, role, created_at
    `

    const updateResult = await pool.query(query, values)

    if (updateResult.rows.length === 0) {
      return createErrorResponse('NOT_FOUND', 'User not found')
    }

    return createSuccessResponse(updateResult.rows[0], 'User updated successfully')
  } catch (error) {
    console.error('Update user error:', error)
    return createErrorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to update user')
  }
}

/**
 * DELETE /api/users/:id - Delete user (requires users:delete permission)
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check auth + permission
    const auth = requirePermission(request, 'users:delete')
    if (auth instanceof NextResponse) return auth

    const body = await request.json()

    // Validate input
    const result = deleteUserSchema.safeParse(body)
    if (!result.success) {
      return createErrorResponse('VALIDATION_ERROR', 'Invalid input', result.error.errors)
    }

    const { id } = result.data

    // Prevent deleting own account
    if (id === parseInt(auth.userId)) {
      return createErrorResponse('VALIDATION_ERROR', 'Cannot delete your own account')
    }

    await pool.query('DELETE FROM users WHERE id = $1', [id])

    return createSuccessResponse({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Delete user error:', error)
    return createErrorResponse('INTERNAL_ERROR', error instanceof Error ? error.message : 'Failed to delete user')
  }
}
