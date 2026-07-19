import { test, expect } from '@playwright/test';

test.describe('Anonymous user SSR response headers', () => {
  test('Anonymous user (no auth cookie) should not get cache headers', async ({ page, context }) => {
    const response = await page.goto('/', { waitUntil: 'networkidle' });

    const cookies = await context.cookies();
    const authCookie = cookies.find(c => c.name === 'sb-localhost-auth-token');

    const signInButton = await page.locator('#navbar').getByRole('button', { name: 'Sign In' }).isVisible();
    const signOutButton = await page.locator('#navbar').getByRole('button', { name: 'Sign Out' }).isVisible();

    const cacheControl = response?.headers()['cache-control'];
    const expires = response?.headers()['expires'];
    const pragma = response?.headers()['pragma'];

    expect(authCookie).toBeUndefined();
    expect(signInButton).toBe(true);
    expect(signOutButton).toBe(false);
    expect(cacheControl).toBeUndefined();
    expect(expires).toBeUndefined();
    expect(pragma).toBeUndefined();
  });
});
