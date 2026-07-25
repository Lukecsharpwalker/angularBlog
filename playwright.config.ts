import { defineConfig, devices } from '@playwright/test';

const WEB_URL = process.env['PLAYWRIGHT_WEB_URL'] ?? 'http://localhost:4200';
const ADMIN_URL = process.env['PLAYWRIGHT_ADMIN_URL'] ?? 'http://localhost:4201';

export default defineConfig({
  testDir: './e2e',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env['CI'],
  /* Retry on CI only */
  retries: process.env['CI'] ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env['CI'] ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: process.env['PLAYWRIGHT_TEST_BASE_URL'] ?? 'http://localhost:4200',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'web-setup',
      testDir: './e2e',
      testMatch: /auth-web\.setup\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env['PLAYWRIGHT_TEST_BASE_URL'] ?? WEB_URL,
      },
    },
    {
      name: 'admin-setup',
      testDir: './e2e',
      testMatch: /auth-admin\.setup\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: ADMIN_URL,
      },
    },
    {
      name: 'real-supabase-setup',
      testDir: './e2e/ssr/auth',
      testMatch: /auth-real-supabase\.setup\.ts$/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: process.env['PLAYWRIGHT_TEST_BASE_URL'] ?? WEB_URL,
      },
    },
    {
      name: 'local',
      testDir: './e2e/web',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: WEB_URL,
        storageState: 'playwright/.auth/web-user.json',
      },
      dependencies: ['web-setup'],
    },
    {
      name: 'ssr-anonymous',
      testDir: './e2e/web/ssr/anonymous',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: WEB_URL,
      },
    },
    {
      name: 'ssr-auth',
      testDir: './e2e/web/ssr/auth',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: WEB_URL,
        storageState: 'playwright/.auth/web-user-real-supabase.json',
      },
      dependencies: ['real-supabase-setup'],
    },
    {
      name: 'web',
      testDir: './e2e/web',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: WEB_URL,
        storageState: 'playwright/.auth/web-user.json',
      },
      dependencies: ['web-setup'],
    },

    {
      name: 'admin',
      testDir: './e2e/admin',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: ADMIN_URL,
        storageState: 'playwright/.auth/admin-user.json',
      },
      dependencies: ['admin-setup'],
    },

    {
      name: 'firefox',
      testDir: './e2e/web',
      use: {
        ...devices['Desktop Firefox'],
        storageState: 'playwright/.auth/web-user.json',
      },
      dependencies: ['web-setup'],
    },

    {
      name: 'webkit',
      testDir: './e2e/web',
      use: {
        ...devices['Desktop Safari'],
        storageState: 'playwright/.auth/web-user.json',
      },
      dependencies: ['web-setup'],
    },

  ],

  /* Configure local web server for testing */
  webServer: process.env['CI']
    ? undefined
    : {
        command: 'npm run start:local',
        url: 'http://localhost:4200',
        reuseExistingServer: !process.env['CI'],
      },
});
