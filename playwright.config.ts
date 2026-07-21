
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: process.env.GAME_URL || 'https://shifulegend.github.io/cat-simulator-endless-city/',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  reporter: [['html', { open: 'never' }]],
});
