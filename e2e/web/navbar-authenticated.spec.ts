import { test, expect } from '@playwright/test';
import { mockProfile } from '../helpers/profile-mock.helper';

const userProfileResponse = {
  id: 1,
  username: 'Lukasz',
};

test.describe('Navbar (authenticated)', () => {
  test('renders authenticated state on app start', async ({ page }) => {
    await mockProfile(page, userProfileResponse);

    await page.goto('/');

    await expect(page.getByText(`Hello, ${userProfileResponse.username}`)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign Out' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign In' })).toHaveCount(0);
  });
});
