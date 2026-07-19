import { test as setup, expect } from '@playwright/test';
import { acceptCookies } from '../../helpers/cookie-consent.helper';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const authFile = 'playwright/.auth/web-user-real-supabase.json';

setup('create REAL Supabase auth with 10-second token', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Angular.fun' })).toBeVisible();
  await acceptCookies(page);

  await page.locator('#navbar').getByRole('button', { name: 'Sign In' }).click();
  await page.getByLabel('Email Address').fill('user@example.com');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByLabel('Password').press('Enter');

  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();

  const cookies = await page.context().cookies();
  const authCookie = cookies.find(c => c.name === 'sb-localhost-auth-token');

  if (!authCookie) {
    throw new Error('No auth cookie found after login!');
  }

  const session = JSON.parse(
    Buffer.from(authCookie.value.replace('base64-', ''), 'base64').toString()
  );

  const shortSession = {
    ...session,
    expires_at: Math.floor(Date.now() / 1000) + 10,
    expires_in: 10,
  };

  const shortCookieValue = `base64-${Buffer.from(JSON.stringify(shortSession)).toString('base64')}`;

  await page.context().clearCookies();
  await page.context().addCookies([
    {
      ...authCookie,
      value: shortCookieValue,
    },
  ]);

  await mkdir(dirname(authFile), { recursive: true });
  await page.context().storageState({ path: authFile });
});
