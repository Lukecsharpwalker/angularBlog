import { test as setup, expect, type Page } from '@playwright/test';
import { mockAuthenticatedUser } from '../helpers/auth-mock.helper';
import { dirname } from 'node:path';
import { mkdir } from 'node:fs/promises';

const authFile = 'playwright/.auth/admin-user.json';

setup('authenticate admin via login flow', async ({ page }: { page: Page }) => {
  await mockAuthenticatedUser(page, {
    id: 'admin-1',
    email: 'admin@example.com',
    username: 'Admin',
    role: 'Admin',
  });

  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Welcome to angular.fun admin panel' })).toBeVisible();

  await page.getByLabel('Email Address').fill('admin@example.com');
  await page.getByLabel('Password').fill('admin123');
  await page.getByLabel('Password').press('Enter');
  await expect(page.getByRole('button', { name: 'Sign In' })).not.toBeVisible();



  await mkdir(dirname(authFile), { recursive: true });

  await page.context().storageState({ path: authFile });
});
