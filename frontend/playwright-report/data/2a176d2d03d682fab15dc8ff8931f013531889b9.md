# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: phase4-simplified.spec.ts >> Phase 4.1: RBAC & Security >> RBAC: reject GET /api/users with read-only user
- Location: e2e\phase4-simplified.spec.ts:131:3

# Error details

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: 403
Received: 401
```

# Test source

```ts
  55  |         password: 'Password123!',
  56  |       },
  57  |     })
  58  |     expect(response.status()).toBe(400)
  59  |   })
  60  | 
  61  |   test('login: reject with non-existent email (generic error)', async ({ request }) => {
  62  |     const response = await request.post(`${API_BASE}/auth/login`, {
  63  |       data: {
  64  |         email: `nonexistent-${Date.now()}@example.com`,
  65  |         password: 'ValidPassword123!',
  66  |       },
  67  |     })
  68  |     expect(response.status()).toBe(401)
  69  |     const body = await response.json()
  70  |     expect(body.error).toContain('Email or password incorrect')
  71  |   })
  72  | 
  73  |   test('login: reject with wrong password (generic error)', async ({ request }) => {
  74  |     // Create user
  75  |     const email = `login-test-${Date.now()}@example.com`
  76  |     await request.post(`${API_BASE}/auth/signup`, {
  77  |       data: {
  78  |         email,
  79  |         password: 'CorrectPassword123!',
  80  |         fullname: 'Login Test',
  81  |       },
  82  |     })
  83  | 
  84  |     // Try wrong password
  85  |     const response = await request.post(`${API_BASE}/auth/login`, {
  86  |       data: {
  87  |         email,
  88  |         password: 'WrongPassword123!',
  89  |       },
  90  |     })
  91  | 
  92  |     expect(response.status()).toBe(401)
  93  |     const body = await response.json()
  94  |     expect(body.error).toContain('Email or password incorrect')
  95  |   })
  96  | 
  97  |   test('login: success with valid credentials', async ({ request }) => {
  98  |     const email = `login-success-${Date.now()}@example.com`
  99  | 
  100 |     // Create user
  101 |     const signupResponse = await request.post(`${API_BASE}/auth/signup`, {
  102 |       data: {
  103 |         email,
  104 |         password: 'LoginTest123!',
  105 |         fullname: 'Login Test User',
  106 |       },
  107 |     })
  108 | 
  109 |     const signupData = await signupResponse.json()
  110 |     const userId = signupData.data.user.id
  111 | 
  112 |     // Login
  113 |     const loginResponse = await request.post(`${API_BASE}/auth/login`, {
  114 |       data: {
  115 |         email,
  116 |         password: 'LoginTest123!',
  117 |       },
  118 |     })
  119 | 
  120 |     expect(loginResponse.status()).toBe(200)
  121 |     const loginData = await loginResponse.json()
  122 |     expect(loginData.success).toBe(true)
  123 |     expect(loginData.data.user.id).toBe(userId)
  124 |   })
  125 | 
  126 |   test('RBAC: reject GET /api/users without auth', async ({ request }) => {
  127 |     const response = await request.get(`${API_BASE}/users`)
  128 |     expect(response.status()).toBe(401)
  129 |   })
  130 | 
  131 |   test('RBAC: reject GET /api/users with read-only user', async ({ request }) => {
  132 |     const email = `readonly-${Date.now()}@example.com`
  133 | 
  134 |     // Create read-only user
  135 |     const signupResponse = await request.post(`${API_BASE}/auth/signup`, {
  136 |       data: {
  137 |         email,
  138 |         password: 'ReadOnlyTest123!',
  139 |         fullname: 'Read Only',
  140 |       },
  141 |     })
  142 | 
  143 |     // Extract token from Set-Cookie header
  144 |     const setCookie = signupResponse.headers()['set-cookie']
  145 |     const tokenMatch = setCookie?.match(/token=([^;]+)/)
  146 |     const token = tokenMatch?.[1]
  147 | 
  148 |     // Try to access users endpoint with token
  149 |     const usersResponse = await request.get(`${API_BASE}/users`, {
  150 |       headers: {
  151 |         'Cookie': `token=${token}`,
  152 |       },
  153 |     })
  154 | 
> 155 |     expect(usersResponse.status()).toBe(403)
      |                                    ^ Error: expect(received).toBe(expected) // Object.is equality
  156 |     const body = await usersResponse.json()
  157 |     expect(body.error?.code).toBe('FORBIDDEN')
  158 |   })
  159 | 
  160 |   test('RBAC: allow GET /api/users with admin user', async ({ request }) => {
  161 |     const email = `admin-${Date.now()}@example.com`
  162 | 
  163 |     // Create admin user (fake admin token)
  164 |     const signupResponse = await request.post(`${API_BASE}/auth/signup`, {
  165 |       data: {
  166 |         email,
  167 |         password: 'AdminTest123!',
  168 |         fullname: 'Admin User',
  169 |         role: 'admin',
  170 |         adminToken: 'fake-admin-token',
  171 |       },
  172 |     })
  173 | 
  174 |     expect(signupResponse.status()).toBe(201)
  175 | 
  176 |     // Extract token
  177 |     const setCookie = signupResponse.headers()['set-cookie']
  178 |     const tokenMatch = setCookie?.match(/token=([^;]+)/)
  179 |     const token = tokenMatch?.[1]
  180 | 
  181 |     // Access users endpoint
  182 |     const usersResponse = await request.get(`${API_BASE}/users`, {
  183 |       headers: {
  184 |         'Cookie': `token=${token}`,
  185 |       },
  186 |     })
  187 | 
  188 |     expect(usersResponse.status()).toBe(200)
  189 |     const body = await usersResponse.json()
  190 |     expect(body.success).toBe(true)
  191 |     expect(Array.isArray(body.data)).toBe(true)
  192 |   })
  193 | 
  194 |   test('RBAC: reject POST /api/users without users:create permission', async ({ request }) => {
  195 |     const email = `editor-${Date.now()}@example.com`
  196 | 
  197 |     // Create editor user (no users:create)
  198 |     const signupResponse = await request.post(`${API_BASE}/auth/signup`, {
  199 |       data: {
  200 |         email,
  201 |         password: 'EditorTest123!',
  202 |         fullname: 'Editor',
  203 |       },
  204 |     })
  205 | 
  206 |     const setCookie = signupResponse.headers()['set-cookie']
  207 |     const tokenMatch = setCookie?.match(/token=([^;]+)/)
  208 |     const token = tokenMatch?.[1]
  209 | 
  210 |     // Try to create user
  211 |     const createResponse = await request.post(`${API_BASE}/users`, {
  212 |       headers: {
  213 |         'Cookie': `token=${token}`,
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
```