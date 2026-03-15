import { defineConfig, devices } from '@playwright/test';
import fs from 'fs';

const storageStatePath = 'playwright/.auth/user.json';
const hasStorageState = fs.existsSync(storageStatePath);

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 45000,
  expect: {
    timeout: 10000,
  },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://localhost:3000',
    storageState: hasStorageState ? storageStatePath : undefined,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1720, height: 980 },
        launchOptions: {
          args: ['--window-size=1920,1080'],
        },
      },
    },
  ],
  webServer: {
    command: 'npm run dev -- --host localhost --port 3000',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
