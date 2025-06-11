import { test, expect } from '@playwright/test';
import { acceptCookies } from './helpers/cookie-consent.helper';
import { debugPageState, waitForAngularToLoad, waitForApiCall } from './helpers/debug.helper';

test.describe('Tags Display and API', () => {
  test('should display tags and verify API call', async ({ page }) => {
    console.log('Starting tags test...');

    // Set up comprehensive network monitoring
    const apiRequests: Array<{ url: string; method: string; headers: Record<string, string>; status?: number }> = [];
    const failedRequests: Array<{ url: string; error: string }> = [];

    page.on('request', (request) => {
      const url = request.url();
      console.log(`REQUEST: ${request.method()} ${url}`);

      if (url.includes('/rest/v1/tags') || url.includes('supabase') || url.includes('tag')) {
        apiRequests.push({
          url,
          method: request.method(),
          headers: request.headers()
        });
      }
    });

    page.on('response', (response) => {
      const url = response.url();
      console.log(`RESPONSE: ${response.status()} ${url}`);

      if (url.includes('/rest/v1/tags')) {
        const existingRequest = apiRequests.find(req => req.url === url);
        if (existingRequest) {
          existingRequest.status = response.status();
        }
      }
    });

    page.on('requestfailed', (request) => {
      const url = request.url();
      console.log(`REQUEST FAILED: ${url} - ${request.failure()?.errorText}`);

      if (url.includes('tag') || url.includes('supabase')) {
        failedRequests.push({
          url,
          error: request.failure()?.errorText || 'Unknown error'
        });
      }
    });

    // Navigate to homepage
    console.log('Navigating to homepage...');
    await page.goto('/', { waitUntil: 'networkidle' });

    // Debug initial page state
    await debugPageState(page, 'After navigation');

    // Handle cookie consent
    await acceptCookies(page);
    console.log('Cookie consent handled');

    // Wait for Angular to load
    const angularLoaded = await waitForAngularToLoad(page, 15000);
    if (!angularLoaded) {
      await debugPageState(page, 'Angular failed to load');
      throw new Error('Angular failed to load');
    }

    // Wait for tags container to appear
    console.log('Waiting for tags container...');
    try {
      await page.waitForSelector('[data-testid="tags-container"]', { timeout: 15000 });
      console.log('Tags container found');
    } catch (error) {
      await debugPageState(page, 'Tags container not found');
      throw error;
    }

    // Debug state after container loads
    await debugPageState(page, 'After tags container loads');

    // Try to wait for API call
    try {
      console.log('Waiting for tags API call...');
      await waitForApiCall(page, '/rest/v1/tags', 10000);
      console.log('Tags API call detected');
    } catch (error) {
      console.log('Tags API call not detected:', error);
      console.log('All API requests so far:', apiRequests);
      console.log('Failed requests:', failedRequests);
    }

    // Wait a bit more for data to load
    await page.waitForTimeout(3000);

    // Check if tags are now available
    const tagItemsCount = await page.locator('[data-testid="tag-item"]').count();
    console.log(`Tag items found: ${tagItemsCount}`);

    if (tagItemsCount === 0) {
      // Detailed debugging when no tags found
      await debugPageState(page, 'No tags found - detailed debug');

      // Check if Angular signals are working
      const signalState = await page.evaluate(() => {
        try {
          // Try to access component state through Angular DevTools
          const appRoot = document.querySelector('app-root');
          if (appRoot) {
            // Check if we can find the component instance
            const componentInstance = (appRoot as any).__ngContext__;
            return {
              hasNgContext: !!componentInstance,
              innerHTML: appRoot.innerHTML.length
            };
          }
          return { hasNgContext: false, innerHTML: 0 };
        } catch (e) {
          return { error: e.message };
        }
      });
      console.log('Angular component state:', signalState);

      // Check if the service is working
      const serviceCheck = await page.evaluate(() => {
        // Try to manually check if the service exists
        return {
          hasDocument: typeof document !== 'undefined',
          hasWindow: typeof window !== 'undefined',
          angularVersion: (window as any).ng?.version || 'not found'
        };
      });
      console.log('Service check:', serviceCheck);

      // Force a manual API call to test connectivity
      try {
        const manualApiTest = await page.evaluate(async () => {
          const response = await fetch('http://127.0.0.1:54321/rest/v1/tags', {
            headers: {
              'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
              'Accept': 'application/json',
            }
          });
          return {
            status: response.status,
            ok: response.ok,
            data: response.ok ? await response.text() : 'Failed to fetch'
          };
        });
        console.log('Manual API test result:', manualApiTest);
      } catch (error) {
        console.log('Manual API test failed:', error);
      }
    }

    // Wait for at least one tag to appear (with extended timeout)
    console.log('Waiting for tag items to appear...');
    await page.waitForSelector('[data-testid="tag-item"]', { timeout: 20000 });

    // Continue with the rest of the test...
    const tagsContainer = page.locator('[data-testid="tags-container"]');
    await expect(tagsContainer).toBeVisible();

    // Verify specific tags are displayed
    const expectedTags = [
      { name: 'Angular', color: '#DD0031', icon: 'angular.svg' },
      { name: 'TypeScript', color: '#007ACC', icon: 'typescript.svg' },
      { name: 'JavaScript', color: '#F7DF1E', icon: 'javascript.svg' }
    ];

    for (const tag of expectedTags) {
      const tagItem = page.locator(`[data-testid="tag-item"][data-tag-name="${tag.name}"]`);
      await expect(tagItem).toBeVisible();

      const tagName = tagItem.locator('[data-testid="tag-name"]');
      await expect(tagName).toHaveText(tag.name);
    }

    // Verify API call was made
    expect(apiRequests.length).toBeGreaterThan(0);
    console.log('Test completed successfully');
  });

  test('should handle empty state gracefully', async ({ page }) => {
    console.log('Testing empty state...');

    await page.goto('/');
    await acceptCookies(page);

    // Wait for Angular to load
    await waitForAngularToLoad(page);

    // Debug state
    await debugPageState(page, 'Empty state test');

    // Wait for tags container
    await page.waitForSelector('[data-testid="tags-container"]', { timeout: 15000 });

    // The container should still be visible even if no tags are loaded
    const tagsContainer = page.locator('[data-testid="tags-container"]');
    await expect(tagsContainer).toBeVisible();

    const scrollContainer = page.locator('[data-testid="tags-scroll-container"]');
    await expect(scrollContainer).toBeVisible();

    console.log('Empty state test completed');
  });
});
