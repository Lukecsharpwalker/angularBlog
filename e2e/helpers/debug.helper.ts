import { Page } from '@playwright/test';

export async function debugPageState(page: Page, testName: string) {
  console.log(`=== DEBUG INFO FOR: ${testName} ===`);

  // 1. Check current URL
  console.log('Current URL:', page.url());

  // 2. Check if Angular app is loaded
  const angularLoaded = await page.evaluate(() => {
    return !!(window as any).ng;
  });
  console.log('Angular loaded:', angularLoaded);

  // 3. Check network requests
  const allRequests: string[] = [];
  page.on('request', (request) => {
    allRequests.push(`${request.method()} ${request.url()}`);
  });

  // 4. Check for JavaScript errors
  const jsErrors: string[] = [];
  page.on('pageerror', (error) => {
    jsErrors.push(error.message);
  });

  // 5. Check console logs
  const consoleLogs: string[] = [];
  page.on('console', (msg) => {
    consoleLogs.push(`${msg.type()}: ${msg.text()}`);
  });

  // 6. Check if tags container exists
  const tagsContainer = await page.locator('[data-testid="tags-container"]').count();
  console.log('Tags container count:', tagsContainer);

  // 7. Check if tags list exists
  const tagsList = await page.locator('[data-testid="tags-list"]').count();
  console.log('Tags list count:', tagsList);

  // 8. Check if any tag items exist
  const tagItems = await page.locator('[data-testid="tag-item"]').count();
  console.log('Tag items count:', tagItems);

  // 9. Check the HTML content of tags container
  if (tagsContainer > 0) {
    const tagsContainerHTML = await page.locator('[data-testid="tags-container"]').innerHTML();
    console.log('Tags container HTML:', tagsContainerHTML);
  }

  // 10. Check for @for loop elements (Angular control flow)
  const ngForElements = await page.locator('[ng-for]').count();
  console.log('ng-for elements count:', ngForElements);

  // 11. Check Angular component state
  const componentState = await page.evaluate(() => {
    // Try to access Angular component data
    const appRoot = document.querySelector('app-root');
    if (appRoot) {
      return {
        hasAppRoot: true,
        innerHTML: appRoot.innerHTML.substring(0, 500) + '...'
      };
    }
    return { hasAppRoot: false };
  });
  console.log('Component state:', componentState);

  // 12. Check API calls
  console.log('Recent network requests:', allRequests.slice(-10));
  console.log('JavaScript errors:', jsErrors);
  console.log('Recent console logs:', consoleLogs.slice(-10));

  // 13. Check if Supabase client is available
  const supabaseAvailable = await page.evaluate(() => {
    return typeof (window as any).supabase !== 'undefined';
  });
  console.log('Supabase client available:', supabaseAvailable);

  // 14. Check environment variables
  const envCheck = await page.evaluate(() => {
    return {
      hasSupabaseUrl: typeof process !== 'undefined' && !!process.env?.['SUPABASE_URL'],
      hasSupabaseKey: typeof process !== 'undefined' && !!process.env?.['SUPABASE_ANON_KEY']
    };
  });
  console.log('Environment check:', envCheck);

  console.log('=== END DEBUG INFO ===\n');
}

export async function waitForAngularToLoad(page: Page, timeout = 10000) {
  console.log('Waiting for Angular to load...');

  try {
    // Wait for Angular to be ready
    await page.waitForFunction(() => {
      return !!(window as any).ng && document.querySelector('app-root');
    }, { timeout });

    console.log('Angular loaded successfully');
    return true;
  } catch (error) {
    console.log('Angular failed to load within timeout:', error);
    return false;
  }
}

export async function waitForApiCall(page: Page, urlPattern: string, timeout = 15000) {
  console.log(`Waiting for API call matching: ${urlPattern}`);

  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`API call to ${urlPattern} not detected within ${timeout}ms`));
    }, timeout);

    const requestHandler = (request: any) => {
      if (request.url().includes(urlPattern)) {
        console.log(`API call detected: ${request.url()}`);
        clearTimeout(timer);
        page.off('request', requestHandler);
        resolve(request);
      }
    };

    page.on('request', requestHandler);
  });
}
