import { Page } from '@playwright/test';

type MockAuthUser = {
  id: string;
  email: string;
  username: string;
  role?: string;
};

type MockAuthPayload = {
  session: {
    access_token: string;
    refresh_token: string;
    token_type: string;
    expires_at: number;
    expires_in: number;
    user: {
      id: string;
      email: string;
      aud: string;
      role: string;
      app_metadata: { provider: string; providers: string[]; role?: string };
      user_metadata: Record<string, unknown>;
    };
  };
  consentRecord: {
    timestamp: string;
    version: string;
    categories: {
      necessary: boolean;
      functional: boolean;
      analytics: boolean;
      marketing: boolean;
    };
    userAgent: string;
    expiryDate: string;
  };
};

function createAuthPayload(user: MockAuthUser): MockAuthPayload {
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 6);

  const expiresAt = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
  const toBase64Url = (value: string): string =>
    Buffer.from(value)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  const accessToken = [
    toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
    toBase64Url(
      JSON.stringify({
        aud: 'authenticated',
        sub: user.id,
        role: 'authenticated',
        email: user.email,
        exp: expiresAt,
      })
    ),
    'mock-signature',
  ].join('.');
  const refreshToken = [
    toBase64Url(JSON.stringify({ alg: 'HS256', typ: 'JWT' })),
    toBase64Url(JSON.stringify({ exp: expiresAt + 60 * 60 * 24 })),
    'mock-signature',
  ].join('.');

  return {
    session: {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'bearer',
      expires_at: expiresAt,
      expires_in: 60 * 60 * 24,
      user: {
        id: user.id,
        email: user.email,
        aud: 'authenticated',
        role: 'authenticated',
        app_metadata: {
          provider: 'email',
          providers: ['email'],
          ...(user.role && { role: user.role })
        },
        user_metadata: {},
      },
    },
    consentRecord: {
      timestamp: new Date().toISOString(),
      version: '2.1',
      categories: {
        necessary: true,
        functional: true,
        analytics: false,
        marketing: false,
      },
      userAgent: 'playwright',
      expiryDate: expiryDate.toISOString(),
    },
  };
}

async function mockAuthAndProfileApis(
  page: Page,
  session: MockAuthPayload['session']
): Promise<void> {
  await page.route('**/auth/v1/token?grant_type=password*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(session),
    });
  });

  await page.route('**/auth/v1/token?grant_type=refresh_token*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(session),
    });
  });

  await page.route('**/auth/v1/user*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(session.user),
    });
  });

  await page.route('**/rest/v1/profiles*', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: session.user.id,
        username: session.user.email.split('@')[0],
      }),
    });
  });
}

export async function mockAuthenticatedUser(page: Page, user: MockAuthUser): Promise<void> {
  const payload = createAuthPayload(user);

  await mockAuthAndProfileApis(page, payload.session);
}
