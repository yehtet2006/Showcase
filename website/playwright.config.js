import 'dotenv/config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './',

  testMatch: [
    '**/e2e/**/*.spec.js',
    // '**/authSetupTest/**/*.spec.js',
  ],

  projects: [
    // Main e2e tests (WITH auth)
    {
      name: 'e2e',
      testMatch: '**/e2e/**/*.spec.js',
      use: {
        baseURL: 'http://localhost:5173',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'on-first-retry',
        storageState: 'playwright/.auth/user.json',
      },
    },
    
  ],

  webServer: {
    command: 'npm run dev',
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});