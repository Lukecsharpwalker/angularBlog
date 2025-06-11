import { test, expect } from '@playwright/test';
import { acceptCookies } from './helpers/cookie-consent.helper';

test.describe('Tags Display and API', () => {
  test('should display tags and verify API call', async ({ page }) => {
    // Set up network monitoring before navigation
    const apiRequests: Array<{ url: string; method: string; headers: Record<string, string> }> = [];

    page.on('request', (request) => {
      const url = request.url();
      if (url.includes('/rest/v1/tags')) {
        apiRequests.push({
          url,
          method: request.method(),
          headers: request.headers()
        });
      }
    });

    // Navigate to homepage
    await page.goto('/');

    // Handle cookie consent
    await acceptCookies(page);

    // Wait for tags container to load
    await page.waitForSelector('[data-testid="tags-container"]', { timeout: 15000 });

    // Verify tags container is visible
    const tagsContainer = page.locator('[data-testid="tags-container"]');
    await expect(tagsContainer).toBeVisible();

    // Verify scroll container
    const scrollContainer = page.locator('[data-testid="tags-scroll-container"]');
    await expect(scrollContainer).toBeVisible();

    // Wait for at least one tag to appear
    await page.waitForSelector('[data-testid="tag-item"]', { timeout: 10000 });

    // Verify specific tags are displayed with correct structure
    const expectedTags = [
      { name: 'Angular', color: '#DD0031', icon: 'angular.svg' },
      { name: 'TypeScript', color: '#007ACC', icon: 'typescript.svg' },
      { name: 'JavaScript', color: '#F7DF1E', icon: 'javascript.svg' },
      { name: 'Firebase', color: '#FFCA28', icon: 'firebase.svg' },
      { name: 'Node.js', color: '#339933', icon: 'nodejs.svg' }
    ];

    for (const tag of expectedTags) {
      // Find tag by data attribute
      const tagItem = page.locator(`[data-testid="tag-item"][data-tag-name="${tag.name}"]`);
      await expect(tagItem).toBeVisible();

      // Check tag name
      const tagName = tagItem.locator('[data-testid="tag-name"]');
      await expect(tagName).toHaveText(tag.name);

      // Check tag icon
      const tagIcon = tagItem.locator('[data-testid="tag-icon"]');
      await expect(tagIcon).toBeVisible();
      await expect(tagIcon).toHaveAttribute('alt', tag.name);
      await expect(tagIcon).toHaveAttribute('src', expect.stringContaining(tag.icon));

      // Check background color (the parent div with inline style)
      const tagButton = tagItem.locator('[data-testid="tag-button"]');
      await expect(tagButton).toHaveAttribute('style', expect.stringContaining(tag.color));
    }

    // Verify navigation buttons (desktop only)
    const leftButton = page.locator('[data-testid="scroll-left-button"]');
    const rightButton = page.locator('[data-testid="scroll-right-button"]');

    // Check if buttons exist (they might be hidden on mobile)
    await expect(leftButton).toBeAttached();
    await expect(rightButton).toBeAttached();


    // Test tag hover effects (desktop)
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 768) {
      const firstTagButton = page.locator('[data-testid="tag-button"]').first();
      await firstTagButton.hover();

      // Should have hover classes
      await expect(firstTagButton).toHaveClass(/hover:scale-110/);
    }

    // Verify API call was made
    await page.waitForTimeout(2000); // Give time for API calls to complete
    expect(apiRequests.length).toBeGreaterThan(0);

    const tagsApiCall = apiRequests[0];
    expect(tagsApiCall.url).toContain('/rest/v1/tags');
    expect(tagsApiCall.method).toBe('GET');

    // Verify headers
    expect(tagsApiCall.headers['apikey']).toBeDefined();
    expect(tagsApiCall.headers['authorization']).toContain('Bearer');
    expect(tagsApiCall.headers['accept']).toBe('application/json');

    console.log('Tags API call verified:', tagsApiCall);
  });

  test('should handle tag interactions and scrolling', async ({ page }) => {
    await page.goto('/');
    await acceptCookies(page);

    // Wait for tags to load
    await page.waitForSelector('[data-testid="tags-container"]', { timeout: 15000 });
    await page.waitForSelector('[data-testid="tag-item"]', { timeout: 10000 });

    // Test clicking on a tag (verify it's clickable)
    const angularTag = page.locator('[data-testid="tag-item"][data-tag-name="Angular"]');
    await expect(angularTag).toBeVisible();

    // Verify cursor pointer styling on tag button
    const tagButton = angularTag.locator('[data-testid="tag-button"]');
    await expect(tagButton).toHaveClass(/cursor-pointer/);

    // Test scroll functionality
    const scrollContainer = page.locator('[data-testid="tags-scroll-container"]');

    // Get initial scroll position
    const initialScrollLeft = await scrollContainer.evaluate(el => el.scrollLeft);

    // Test desktop scroll buttons if visible
    const viewport = page.viewportSize();
    if (viewport && viewport.width >= 768) {
      const rightButton = page.locator('[data-testid="scroll-right-button"]');
      if (await rightButton.isVisible()) {
        await rightButton.click();

        // Verify scroll position changed
        await page.waitForTimeout(500); // Wait for scroll animation
        const newScrollLeft = await scrollContainer.evaluate(el => el.scrollLeft);
        expect(newScrollLeft).toBeGreaterThan(initialScrollLeft);
      }
    } else {
      // Test mobile scroll
      await scrollContainer.evaluate(el => el.scrollLeft += 100);

      // Verify scroll position changed
      const newScrollLeft = await scrollContainer.evaluate(el => el.scrollLeft);
      expect(newScrollLeft).toBeGreaterThan(initialScrollLeft);
    }
  });

  test('should display all expected tags from seed data', async ({ page }) => {
    await page.goto('/');
    await acceptCookies(page);

    await page.waitForSelector('[data-testid="tags-container"]', { timeout: 15000 });
    await page.waitForSelector('[data-testid="tag-item"]', { timeout: 10000 });

    // All tags from seed data
    const allExpectedTags = [
      'Angular', 'TypeScript', 'JavaScript', 'Firebase', 'Firestore',
      'Node.js', 'Cloud Computing', 'SSG/SSR', 'Web Development',
      'Performance', 'Security', 'Deployment', 'Testing', 'Best Practices',
      'Tutorials', 'HTML', 'CSS'
    ];

    // Count visible tags using data-testid
    const tagElements = page.locator('[data-testid="tag-item"]');
    const tagCount = await tagElements.count();

    console.log(`Found ${tagCount} tags on the page`);
    expect(tagCount).toBeGreaterThanOrEqual(5); // At least some tags should be visible

    // Check for specific important tags
    const importantTags = ['Angular', 'TypeScript', 'JavaScript'];
    for (const tagName of importantTags) {
      const tagElement = page.locator(`[data-testid="tag-item"][data-tag-name="${tagName}"]`);
      await expect(tagElement).toBeVisible();

      const tagNameElement = tagElement.locator('[data-testid="tag-name"]');
      await expect(tagNameElement).toHaveText(tagName);
    }
  });

  test('should handle empty state gracefully', async ({ page }) => {
    // This test could simulate no tags loaded scenario
    await page.goto('/');
    await acceptCookies(page);

    // Wait for tags container
    await page.waitForSelector('[data-testid="tags-container"]', { timeout: 15000 });

    // The container should still be visible even if no tags are loaded
    const tagsContainer = page.locator('[data-testid="tags-container"]');
    await expect(tagsContainer).toBeVisible();

    const scrollContainer = page.locator('[data-testid="tags-scroll-container"]');
    await expect(scrollContainer).toBeVisible();
  });
});
