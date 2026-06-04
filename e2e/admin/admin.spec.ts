import { test, expect } from '@playwright/test';

test.describe('Admin Application', () => {
  test('should navigate to /posts if admin is logged in (authAdminGuard allows access)', async ({ page }) => {
    await page.goto('/posts');
    await expect(page.getByRole('heading', { name: 'Create New Post' })).toBeVisible();
  });
});
