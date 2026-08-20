import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3000'
const API_BASE = `${BASE_URL}/api`

/**
 * PHASE 4.1: RBAC Middleware + Zod Validation Tests (Simplified)
 */

test.describe('Phase 4.1: RBAC & Security', () => {
  test('signup: reject invalid email', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/signup`, {
      data: {
        email: 'invalid-email',
        password: 'Password123!',
        fullname: 'Test',
      },
    })
    expect(response.status()).toBe(400)
    const body = await response.json()
    expect(body.error?.code).toBe('VALIDATION_ERROR')
  })

  test('signup: reject short password', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/signup`, {
      data: {
        email: 'test@example.com',
        password: 'short',
        fullname: 'Test',
      },
    })
    expect(response.status()).toBe(400)
  })

  test('signup: success with valid data', async ({ request }) => {
    const email = `user-${Date.now()}@example.com`
    const response = await request.post(`${API_BASE}/auth/signup`, {
      data: {
        email,
        password: 'ValidPassword123!',
        fullname: 'Test User',
      },
    })
    expect(response.status()).toBe(201)
    const body = await response.json()
    expect(body.success).toBe(true)
    expect(body.data.user.email).toBe(email)
    expect(body.data.user.role).toBe('read-only')
  })

  test('login: reject invalid email format', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: {
        email: 'not-an-email',
        password: 'Password123!',
      },
    })
    expect(response.status()).toBe(400)
  })

  test('login: reject with non-existent email (generic error)', async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: {
        email: `nonexistent-${Date.now()}@example.com`,
        password: 'ValidPassword123!',
      },
    })
    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toContain('Email or password incorrect')
  })

  test('login: reject with wrong password (generic error)', async ({ request }) => {
    // Create user
    const email = `login-test-${Date.now()}@example.com`
    await request.post(`${API_BASE}/auth/signup`, {
      data: {
        email,
        password: 'CorrectPassword123!',
        fullname: 'Login Test',
      },
    })

    // Try wrong password
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: {
        email,
        password: 'WrongPassword123!',
      },
    })

    expect(response.status()).toBe(401)
    const body = await response.json()
    expect(body.error).toContain('Email or password incorrect')
  })

  test('login: success with valid credentials', async ({ request }) => {
    const email = `login-success-${Date.now()}@example.com`

    // Create user
    const signupResponse = await request.post(`${API_BASE}/auth/signup`, {
      data: {
        email,
        password: 'LoginTest123!',
        fullname: 'Login Test User',
      },
    })

    const signupData = await signupResponse.json()
    const userId = signupData.data.user.id

    // Login
    const loginResponse = await request.post(`${API_BASE}/auth/login`, {
      data: {
        email,
        password: 'LoginTest123!',
      },
    })

    expect(loginResponse.status()).toBe(200)
    const loginData = await loginResponse.json()
    expect(loginData.success).toBe(true)
    expect(loginData.data.user.id).toBe(userId)
  })

  test('RBAC: reject GET /api/users without auth', async ({ request }) => {
    const response = await request.get(`${API_BASE}/users`)
    expect(response.status()).toBe(401)
  })

  test('RBAC: reject GET /api/users with read-only user', async ({ request }) => {
    const email = `readonly-${Date.now()}@example.com`

    // Create read-only user
    const signupResponse = await request.post(`${API_BASE}/auth/signup`, {
      data: {
        email,
        password: 'ReadOnlyTest123!',
        fullname: 'Read Only',
      },
    })

    // Extract token from Set-Cookie header
    const setCookie = signupResponse.headers()['set-cookie']
    const tokenMatch = setCookie?.match(/token=([^;]+)/)
    const token = tokenMatch?.[1]

    // Try to access users endpoint with token
    const usersResponse = await request.get(`${API_BASE}/users`, {
      headers: {
        'Cookie': `token=${token}`,
      },
    })

    expect(usersResponse.status()).toBe(403)
    const body = await usersResponse.json()
    expect(body.error?.code).toBe('FORBIDDEN')
  })

  test('RBAC: allow GET /api/users with admin user', async ({ request }) => {
    const email = `admin-${Date.now()}@example.com`

    // Create admin user (fake admin token)
    const signupResponse = await request.post(`${API_BASE}/auth/signup`, {
      data: {
        email,
        password: 'AdminTest123!',
        fullname: 'Admin User',
        role: 'admin',
        adminToken: 'fake-admin-token',
      },
    })

    expect(signupResponse.status()).toBe(201)

    // Extract token
    const setCookie = signupResponse.headers()['set-cookie']
    const tokenMatch = setCookie?.match(/token=([^;]+)/)
    const token = tokenMatch?.[1]

    // Access users endpoint
    const usersResponse = await request.get(`${API_BASE}/users`, {
      headers: {
        'Cookie': `token=${token}`,
      },
    })

    expect(usersResponse.status()).toBe(200)
    const body = await usersResponse.json()
    expect(body.success).toBe(true)
    expect(Array.isArray(body.data)).toBe(true)
  })

  test('RBAC: reject POST /api/users without users:create permission', async ({ request }) => {
    const email = `editor-${Date.now()}@example.com`

    // Create editor user (no users:create)
    const signupResponse = await request.post(`${API_BASE}/auth/signup`, {
      data: {
        email,
        password: 'EditorTest123!',
        fullname: 'Editor',
      },
    })

    const setCookie = signupResponse.headers()['set-cookie']
    const tokenMatch = setCookie?.match(/token=([^;]+)/)
    const token = tokenMatch?.[1]

    // Try to create user
    const createResponse = await request.post(`${API_BASE}/users`, {
      headers: {
        'Cookie': `token=${token}`,
      },
      data: {
        email: `newuser-${Date.now()}@example.com`,
        password: 'NewUser123!',
        fullname: 'New User',
        role: 'editor',
      },
    })

    expect(createResponse.status()).toBe(403)
    const body = await createResponse.json()
    expect(body.error?.code).toBe('FORBIDDEN')
  })

  test('RBAC: reject POST /api/users with invalid email', async ({ request }) => {
    const email = `admin2-${Date.now()}@example.com`

    // Create admin
    const signupResponse = await request.post(`${API_BASE}/auth/signup`, {
      data: {
        email,
        password: 'Admin2Test123!',
        fullname: 'Admin 2',
        role: 'admin',
        adminToken: 'fake-token',
      },
    })

    const setCookie = signupResponse.headers()['set-cookie']
    const tokenMatch = setCookie?.match(/token=([^;]+)/)
    const token = tokenMatch?.[1]

    // Try to create user with invalid email
    const createResponse = await request.post(`${API_BASE}/users`, {
      headers: {
        'Cookie': `token=${token}`,
      },
      data: {
        email: 'invalid-email',
        password: 'Password123!',
        fullname: 'Test',
        role: 'editor',
      },
    })

    expect(createResponse.status()).toBe(400)
    const body = await createResponse.json()
    expect(body.error?.code).toBe('VALIDATION_ERROR')
  })

  test('RBAC: successfully create user with admin role', async ({ request }) => {
    const adminEmail = `admin3-${Date.now()}@example.com`

    // Create admin
    const adminSignup = await request.post(`${API_BASE}/auth/signup`, {
      data: {
        email: adminEmail,
        password: 'Admin3Test123!',
        fullname: 'Admin 3',
        role: 'admin',
        adminToken: 'fake-token',
      },
    })

    const setCookie = adminSignup.headers()['set-cookie']
    const tokenMatch = setCookie?.match(/token=([^;]+)/)
    const token = tokenMatch?.[1]

    // Create new user
    const newUserEmail = `newuser-${Date.now()}@example.com`
    const createResponse = await request.post(`${API_BASE}/users`, {
      headers: {
        'Cookie': `token=${token}`,
      },
      data: {
        email: newUserEmail,
        password: 'NewUserPass123!',
        fullname: 'New Test User',
        role: 'editor',
      },
    })

    expect(createResponse.status()).toBe(201)
    const body = await createResponse.json()
    expect(body.success).toBe(true)
    expect(body.data.email).toBe(newUserEmail)
    expect(body.data.role).toBe('editor')
  })

  test('Rate Limit: enforce 5 requests per minute on signup', async ({ request }) => {
    // Make 5 requests (should succeed or validation fail, not rate limit)
    for (let i = 0; i < 5; i++) {
      const response = await request.post(`${API_BASE}/auth/signup`, {
        data: {
          email: `ratelimit-${Date.now()}-${i}@example.com`,
          password: 'Password123!',
          fullname: 'Test',
        },
      })
      // Should be 201 (success) or 400/409 (validation/conflict), not 429
      expect([201, 400, 409]).toContain(response.status())
    }

    // 6th request should be rate limited
    const limitedResponse = await request.post(`${API_BASE}/auth/signup`, {
      data: {
        email: `ratelimit-${Date.now()}-limit@example.com`,
        password: 'Password123!',
        fullname: 'Test',
      },
    })

    expect(limitedResponse.status()).toBe(429)
  })
})
