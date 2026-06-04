import { test, expect, Page } from '@playwright/test';
import { mockProfile } from '../helpers/profile-mock.helper';


test.describe('Login Modal', () => {
  test('failed login keeps modal open and shows error', async ({ page }) => {
    await page.route('**/auth/v1/token?grant_type=password*', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'invalid_grant', error_description: 'Invalid login credentials' }),
      });
    });

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Angular.fun' })).toBeVisible();

    await page.locator('#navbar').getByRole('button', { name: 'Sign In' }).click();

    const dialog = page.getByRole('dialog', { name: 'Sign In' });
    await expect(dialog).toBeVisible();

    const emailInput = page.getByLabel('Email Address');
    const passwordInput = page.getByLabel('Password');

    await emailInput.fill('wrong@example.com');
    await passwordInput.fill('wrongpassword');

    await dialog.getByRole('button', { name: 'Sign In' }).click();

    await expect(dialog).toBeVisible();
    await expect(dialog.getByText('Invalid login credentials')).toBeVisible();
  });

  test('logout clears session and shows login button', async ({ page }) => {
    await mockProfile(page);
    await page.goto('/');

    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
    await expect(page.locator('#navbar').getByRole('button', { name: 'Sign In' })).toHaveCount(0);

    await page.getByRole('button', { name: 'Sign Out' }).click();

    await expect(page.locator('#navbar').getByRole('button', { name: 'Sign In' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Out' })).toHaveCount(0);
  })
});

