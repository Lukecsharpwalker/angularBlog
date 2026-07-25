import { test, expect } from '@playwright/test';

test.describe('SSR setAll() cookie handler verification', () => {
  test('setAll() refreshes expired tokens during SSR (JavaScript disabled)', async ({ browser }) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/web-user-real-supabase.json',
      javaScriptEnabled: false,
    });
    const page = await context.newPage();

    const cookiesInitial = await context.cookies();
    const authCookieInitial = cookiesInitial.find(c => c.name === 'sb-localhost-auth-token');
    expect(authCookieInitial).toBeDefined();

    const sessionInitial = JSON.parse(
      Buffer.from(authCookieInitial!.value.replace('base64-', ''), 'base64').toString()
    );

    const originalAccessToken = sessionInitial.access_token;
    const secondsUntilExpiry = Math.floor(sessionInitial.expires_at - Date.now() / 1000);

    if (secondsUntilExpiry > 0) {
      await new Promise(resolve => setTimeout(resolve, (secondsUntilExpiry + 2) * 1000));
    }

    const response = await page.goto('/', { waitUntil: 'networkidle' });

    const cookiesAfter = await context.cookies();
    const authCookieAfter = cookiesAfter.find(c => c.name === 'sb-localhost-auth-token');

    if (!authCookieAfter) {
      throw new Error('Auth cookie was removed - token refresh failed');
    }

    const sessionAfter = JSON.parse(
      Buffer.from(authCookieAfter!.value.replace('base64-', ''), 'base64').toString()
    );

    const tokenWasRefreshed = sessionAfter.access_token !== originalAccessToken;
    const newTokenIsValid = sessionAfter.expires_at > Date.now() / 1000 + 60;

    expect(tokenWasRefreshed).toBe(true);
    expect(newTokenIsValid).toBe(true);

    const cacheControl = response?.headers()['cache-control'];
    const expires = response?.headers()['expires'];
    const pragma = response?.headers()['pragma'];

    expect(cacheControl).toContain('private');
    expect(cacheControl).toContain('no-cache');
    expect(cacheControl).toContain('no-store');
    expect(cacheControl).toContain('must-revalidate');
    expect(cacheControl).toContain('max-age=0');
    expect(expires).toBe('0');
    expect(pragma).toBe('no-cache');

    await context.close();
  });
});

/**
 * WHY THIS TEST EXISTS:
 *
 * Verifies Supabase SSR `setAll()` cookie handler in projects/shared/src/core/supabase/supabase.client.ts
 * correctly sets both auth cookies AND cache control headers during server-side token refresh.
 *
 * THE CRITICAL CODE BEING TESTED:
 *
 * Object.entries(headers).forEach(([key, value]) => {
 *   if (key.toLowerCase() === 'set-cookie') {
 *     responseHeaders.append(key, value);
 *   } else {
 *     responseHeaders.set(key, value);
 *   }
 * });
 *
 * WHY IT'S MANDATORY:
 *
 * When Supabase refreshes expired tokens during SSR, it passes cache control headers via the `headers`
 * parameter to prevent CDNs/reverse proxies from caching auth responses. Without these headers, one user's
 * session tokens could be cached and served to different users (critical security vulnerability).
 *
 * Headers passed by Supabase (from @supabase/ssr v0.10.3, node_modules/@supabase/ssr/src/cookies.ts:501):
 * - Cache-Control: private, no-cache, no-store, must-revalidate, max-age=0
 * - Expires: 0
 * - Pragma: no-cache
 *
 * WHEN CACHE HEADERS ARE SET:
 *
 * Source: @supabase/ssr/src/createServerClient.ts:179-204 and cookies.ts:501-520
 *
 * Cache headers are ONLY set via applyServerStorage() when:
 * 1. onAuthStateChange event fires (SIGNED_IN, TOKEN_REFRESHED, USER_UPDATED, PASSWORD_RECOVERY, SIGNED_OUT, MFA_CHALLENGE_VERIFIED)
 * 2. AND hasStorageChanges is true (cookies need updating)
 *
 * Regular SSR requests (no auth state change) call setAll() with empty headers {} (see cookies.ts:302).
 * Only auth state changes call applyServerStorage() which passes cache control headers (cookies.ts:514-519).
 *
 * TEST MECHANICS:
 *
 * 1. Setup (auth-real-supabase.setup.ts): Login with real Supabase credentials, modify session cookie
 *    to expire in 10 seconds (manipulates `expires_at` field only, keeps real `refresh_token`).
 *
 * 2. Test starts: Loads page with JavaScript DISABLED (critical - ensures only SSR can update cookies).
 *
 * 3. Wait for token expiry: Sleeps until 10-second token expires.
 *
 * 4. Trigger SSR: Navigate to homepage, Angular SSR calls Supabase client, detects expired token,
 *    calls refresh endpoint, receives new tokens, calls `setAll()` to write cookies AND headers.
 *
 * 5. Verify cookies: New access_token is different (token was refreshed), new expiry is valid.
 *
 * 6. Verify headers: Response contains cache control headers preventing CDN caching.
 *
 * WITH CODE: Test passes - cookies refreshed, cache headers present.
 * WITHOUT CODE: Test fails - cookies refreshed, cache headers MISSING (cacheControl === undefined).
 *
 * REFERENCES:
 * - Supabase SSR docs: https://supabase.com/docs/guides/auth/server-side-rendering
 * - @supabase/ssr SetAllCookies signature: node_modules/@supabase/ssr/src/types.ts:25-52
 * - Angular SSR RESPONSE_INIT: https://angular.dev/api/core/RESPONSE_INIT
 */