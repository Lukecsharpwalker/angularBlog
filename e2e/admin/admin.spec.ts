import { test, expect } from '@playwright/test';

test.describe('Admin Application', () => {
  test('admin app loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Admin/);
  });

  test('displays admin dashboard', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText('Admin')).toBeVisible();
  });
});