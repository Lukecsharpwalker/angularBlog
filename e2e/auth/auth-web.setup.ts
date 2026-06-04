import { test as setup, expect, type Page } from '@playwright/test';
import { mockAuthenticatedUser } from '../helpers/auth-mock.helper';
import { acceptCookies } from '../helpers/cookie-consent.helper';
import { dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';

const authFile = 'playwright/.auth/web-user.json';

setup('authenticate via login flow', async ({ page }: { page: Page }) => {
  await mockAuthenticatedUser(page, {
    id: 'user-1',
    email: 'lukasz@example.com',
    username: 'Lukasz',
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Angular.fun' })).toBeVisible();
  await acceptCookies(page);

  await page.locator('#navbar').getByRole('button', { name: 'Sign In' }).click();
  await page.getByLabel('Email Address').fill('lukasz@example.com');
  await page.getByLabel('Password').fill('secret123');
  await page.getByLabel('Password').press('Enter');

  await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();

  await mkdir(dirname(authFile), { recursive: true });

  await page.context().storageState({ path: authFile });
});
