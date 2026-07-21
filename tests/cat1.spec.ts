import { test, expect } from '@playwright/test';

test('cat 1 visual flow', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.screenshot({ path: testInfo.outputPath('01-loaded.png'), fullPage: true });
});
