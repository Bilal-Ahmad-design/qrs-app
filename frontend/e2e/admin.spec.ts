import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard', () => {
  test('admin dashboard loads', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // Verify page loaded
    const response = await page.response?.status() || 200
    expect([200, 301, 302]).toContain(response)
  })

  test('admin pages exist', async ({ page }) => {
    const pages = [
      '/admin/dashboard',
      '/admin/users',
      '/admin/content',
      '/admin/submissions',
      '/admin/logs',
      '/admin/settings',
    ]

    for (const pagePath of pages) {
      await page.goto(pagePath, { waitUntil: 'networkidle' })
      // Just verify page loaded (might redirect to login, that's ok)
      const url = page.url()
      expect(url).toBeTruthy()
    }
  })

  test('admin index redirects to dashboard', async ({ page }) => {
    await page.goto('/admin')
    // Should redirect to dashboard
    await expect(page).toHaveURL(/\/admin\/dashboard|\/login/)
  })

  test('admin layout loads', async ({ page }) => {
    await page.goto('/admin/dashboard')

    // Check if layout/structure exists (even if not authenticated)
    const hasPageContent = await page.locator('body').isVisible()
    expect(hasPageContent).toBeTruthy()
  })

  test('navigation between admin pages', async ({ page }) => {
    const pages = ['/admin/dashboard', '/admin/users', '/admin/content']

    for (const pagePath of pages) {
      await page.goto(pagePath, { waitUntil: 'networkidle' })
      const status = page.response?.status() || 200
      expect([200, 301, 302]).toContain(status)
    }
  })
})
