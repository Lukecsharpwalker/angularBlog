import { Page, expect } from '@playwright/test';

export async function acceptCookies(page: Page): Promise<void> {
  const cookieConsentDialog = page
    .getByLabel('Cookie Consent')
    .locator('div')
    .filter({ hasText: 'Cookie Consent Consent' })
    .nth(1);

  await expect(cookieConsentDialog).toBeVisible();

  const allowAllButton = page.getByRole('button', { name: 'Allow All' });
  await allowAllButton.click();

  await expect(cookieConsentDialog).not.toBeVisible();
}
