import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:4173/';

export default defineConfig({
  testDir: 'src/visual-tests',
  testMatch: '**/*.e2e.mts',
  timeout: 60_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  // Retries would post duplicate snapshot names to Percy.
  retries: 0,
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command:
      'npx vite preview --config vite.visual-tests.config.ts --port 4173 --strictPort',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    // Keeps `preview.open` from launching a browser.
    env: { BROWSER: 'none' },
  },
});
