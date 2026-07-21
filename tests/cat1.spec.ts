
import { test, expect } from '@playwright/test';

test('cat 1 visual flow', async ({ page }, testInfo) => {
  await page.goto('/');
  await page.getByRole('button', { name: /start/i }).click();
  await page.screenshot({ path: testInfo.outputPath('01-started.png'), fullPage: true });
});
