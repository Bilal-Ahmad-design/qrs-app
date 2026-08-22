import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('signup new user', async ({ page }) => {
    await page.goto('/signup')
    await page.fill('input[name="email"]', `test-${Date.now()}@example.com`)
    await page.fill('input[name="password"]', 'TestPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard', { timeout: 5000 })
    expect(page.url()).toContain('/admin/dashboard')
  })

  test('login existing user', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'AdminPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard', { timeout: 5000 })
    expect(page.url()).toContain('/admin/dashboard')
  })

  test('logout user', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@example.com')
    await page.fill('input[name="password"]', 'AdminPassword123!')
    await page.click('button[type="submit"]')
    await page.waitForURL('/admin/dashboard')
    await page.click('button:has-text("Logout")')
    await page.waitForURL('/', { timeout: 5000 })
    expect(page.url()).toContain('/')
  })

  test('protect admin routes', async ({ page }) => {
    await page.goto('/admin/dashboard')
    await page.waitForURL('/login', { timeout: 5000 })
    expect(page.url()).toContain('/login')
  })
})
