import { expect, test } from '@playwright/test';

test('has title and handles cookie consent', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/AngularBlogApp/);

  const cookieConsentDialog = page
    .getByLabel('Cookie Consent')
    .locator('div')
    .filter({ hasText: 'Cookie Consent Consent' })
    .nth(1);

  await expect(cookieConsentDialog).toBeVisible();

  const allowAllButton = page.getByRole('button', { name: 'Allow All' });
  await allowAllButton.click();

  await expect(cookieConsentDialog).not.toBeVisible();
});
