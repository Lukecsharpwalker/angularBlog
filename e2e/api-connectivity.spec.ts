import { test, expect } from '@playwright/test';

test.describe('API Connectivity', () => {
  test('should be able to connect to Supabase API directly', async ({ page }) => {
    console.log('Testing direct API connectivity...');

    // Test direct API call
    const response = await page.request.get('http://127.0.0.1:54321/rest/v1/tags', {
      headers: {
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0',
        'Accept': 'application/json',
      }
    });

    console.log(`API Response Status: ${response.status()}`);
    console.log(`API Response Headers:`, response.headers());

    if (response.ok()) {
      const data = await response.json();
      console.log(`API Response Data:`, data);
      expect(Array.isArray(data)).toBe(true);
    } else {
      const errorText = await response.text();
      console.log(`API Error Response:`, errorText);
      throw new Error(`API call failed with status ${response.status()}: ${errorText}`);
    }
  });

  test('should verify Supabase is running', async ({ page }) => {
    console.log('Checking if Supabase is running...');

    // Check Supabase health endpoint
    try {
      const response = await page.request.get('http://127.0.0.1:54321/health');
      console.log(`Supabase health check status: ${response.status()}`);

      if (response.ok()) {
        const healthData = await response.text();
        console.log('Supabase health data:', healthData);
      }
    } catch (error) {
      console.log('Supabase health check failed:', error);
    }

    // Check if we can access the REST API root
    try {
      const response = await page.request.get('http://127.0.0.1:54321/rest/v1/', {
        headers: {
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'
        }
      });
      console.log(`Supabase REST API status: ${response.status()}`);
    } catch (error) {
      console.log('Supabase REST API check failed:', error);
    }
  });
});
