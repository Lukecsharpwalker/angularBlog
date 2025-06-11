import { test, expect } from '@playwright/test';
import { acceptCookies } from './helpers/cookie-consent.helper';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Handle cookie consent using helper
  await acceptCookies(page);

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/AngularBlogApp/);
});
