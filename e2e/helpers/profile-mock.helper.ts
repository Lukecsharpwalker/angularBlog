import { Page } from '@playwright/test';

type MockProfile = {
  id: number | string;
  username: string;
};

export async function mockProfile(
  page: Page,
  profile: MockProfile = { id: 1, username: 'Lukasz' }
): Promise<void> {
  await page.route('**/rest/v1/profiles*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(profile),
    });
  });
}
