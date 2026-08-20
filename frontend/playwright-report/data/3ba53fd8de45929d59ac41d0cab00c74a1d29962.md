# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: phase4-simplified.spec.ts >> Phase 4.1: RBAC & Security >> Rate Limit: enforce 5 requests per minute on signup
- Location: e2e\phase4-simplified.spec.ts:303:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected value: 429
Received array: [201, 400, 409]
```

# Test source

```ts
  214 |       },
  215 |       data: {
  216 |         email: `newuser-${Date.now()}@example.com`,
  217 |         password: 'NewUser123!',
  218 |         fullname: 'New User',
  219 |         role: 'editor',
  220 |       },
  221 |     })
  222 | 
  223 |     expect(createResponse.status()).toBe(403)
  224 |     const body = await createResponse.json()
  225 |     expect(body.error?.code).toBe('FORBIDDEN')
  226 |   })
  227 | 
  228 |   test('RBAC: reject POST /api/users with invalid email', async ({ request }) => {
  229 |     const email = `admin2-${Date.now()}@example.com`
  230 | 
  231 |     // Create admin
  232 |     const signupResponse = await request.post(`${API_BASE}/auth/signup`, {
  233 |       data: {
  234 |         email,
  235 |         password: 'Admin2Test123!',
  236 |         fullname: 'Admin 2',
  237 |         role: 'admin',
  238 |         adminToken: 'fake-token',
  239 |       },
  240 |     })
  241 | 
  242 |     const setCookie = signupResponse.headers()['set-cookie']
  243 |     const tokenMatch = setCookie?.match(/token=([^;]+)/)
  244 |     const token = tokenMatch?.[1]
  245 | 
  246 |     // Try to create user with invalid email
  247 |     const createResponse = await request.post(`${API_BASE}/users`, {
  248 |       headers: {
  249 |         'Cookie': `token=${token}`,
  250 |       },
  251 |       data: {
  252 |         email: 'invalid-email',
  253 |         password: 'Password123!',
  254 |         fullname: 'Test',
  255 |         role: 'editor',
  256 |       },
  257 |     })
  258 | 
  259 |     expect(createResponse.status()).toBe(400)
  260 |     const body = await createResponse.json()
  261 |     expect(body.error?.code).toBe('VALIDATION_ERROR')
  262 |   })
  263 | 
  264 |   test('RBAC: successfully create user with admin role', async ({ request }) => {
  265 |     const adminEmail = `admin3-${Date.now()}@example.com`
  266 | 
  267 |     // Create admin
  268 |     const adminSignup = await request.post(`${API_BASE}/auth/signup`, {
  269 |       data: {
  270 |         email: adminEmail,
  271 |         password: 'Admin3Test123!',
  272 |         fullname: 'Admin 3',
  273 |         role: 'admin',
  274 |         adminToken: 'fake-token',
  275 |       },
  276 |     })
  277 | 
  278 |     const setCookie = adminSignup.headers()['set-cookie']
  279 |     const tokenMatch = setCookie?.match(/token=([^;]+)/)
  280 |     const token = tokenMatch?.[1]
  281 | 
  282 |     // Create new user
  283 |     const newUserEmail = `newuser-${Date.now()}@example.com`
  284 |     const createResponse = await request.post(`${API_BASE}/users`, {
  285 |       headers: {
  286 |         'Cookie': `token=${token}`,
  287 |       },
  288 |       data: {
  289 |         email: newUserEmail,
  290 |         password: 'NewUserPass123!',
  291 |         fullname: 'New Test User',
  292 |         role: 'editor',
  293 |       },
  294 |     })
  295 | 
  296 |     expect(createResponse.status()).toBe(201)
  297 |     const body = await createResponse.json()
  298 |     expect(body.success).toBe(true)
  299 |     expect(body.data.email).toBe(newUserEmail)
  300 |     expect(body.data.role).toBe('editor')
  301 |   })
  302 | 
  303 |   test('Rate Limit: enforce 5 requests per minute on signup', async ({ request }) => {
  304 |     // Make 5 requests (should succeed or validation fail, not rate limit)
  305 |     for (let i = 0; i < 5; i++) {
  306 |       const response = await request.post(`${API_BASE}/auth/signup`, {
  307 |         data: {
  308 |           email: `ratelimit-${Date.now()}-${i}@example.com`,
  309 |           password: 'Password123!',
  310 |           fullname: 'Test',
  311 |         },
  312 |       })
  313 |       // Should be 201 (success) or 400/409 (validation/conflict), not 429
> 314 |       expect([201, 400, 409]).toContain(response.status())
      |                               ^ Error: expect(received).toContain(expected) // indexOf
  315 |     }
  316 | 
  317 |     // 6th request should be rate limited
  318 |     const limitedResponse = await request.post(`${API_BASE}/auth/signup`, {
  319 |       data: {
  320 |         email: `ratelimit-${Date.now()}-limit@example.com`,
  321 |         password: 'Password123!',
  322 |         fullname: 'Test',
  323 |       },
  324 |     })
  325 | 
  326 |     expect(limitedResponse.status()).toBe(429)
  327 |   })
  328 | })
  329 | 
```