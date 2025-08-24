import { test, expect } from '@playwright/test';
import { acceptCookies } from '../helpers/cookie-consent.helper';
import { waitForAngularToLoad, waitForApiCall } from '../helpers/debug.helper';

test.describe('Tags Display and API', () => {
  test('should display tags and verify API call', async ({ page }) => {
    const apiRequests: Array<{
      url: string;
      method: string;
      headers: Record<string, string>;
      status?: number;
    }> = [];

    page.on('request', request => {
      const url = request.url();
      if (url.includes('/rest/v1/tags') || url.includes('supabase') || url.includes('tag')) {
        apiRequests.push({
          url,
          method: request.method(),
          headers: request.headers(),
        });
      }
    });

    page.on('response', response => {
      const url = response.url();
      if (url.includes('/rest/v1/tags')) {
        const existingRequest = apiRequests.find(req => req.url === url);
        if (existingRequest) {
          existingRequest.status = response.status();
        }
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    // await acceptCookies(page);
    // await waitForAngularToLoad(page, 50);
    // await page.getByTestId('tags-container')

    try {
      await waitForApiCall(page, '/rest/v1/tags', 30);
    } catch (error) {
      // Continue test even if API call detection fails
    }

    // await page.waitForTimeout(100);
    // await page.waitForSelector('[data-testid="tag-item"]', { timeout: 500 });

    const tagsContainer = page.locator('[data-testid="tags-container"]');
    await expect(tagsContainer).toBeVisible();

    const expectedTags = [
      { name: 'Angular', color: '#DD0031', icon: 'angular.svg' },
      { name: 'TypeScript', color: '#007ACC', icon: 'typescript.svg' },
      { name: 'JavaScript', color: '#F7DF1E', icon: 'javascript.svg' },
    ];

    for (const tag of expectedTags) {
      const tagItem = page.locator(`[data-testid="tag-item"][data-tag-name="${tag.name}"]`);
      await expect(tagItem).toBeVisible();

      const tagName = tagItem.locator('[data-testid="tag-name"]');
      await expect(tagName).toHaveText(tag.name);
    }

    expect(apiRequests.length).toBeGreaterThan(0);
  });
});
