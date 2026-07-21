import { test, expect } from '@playwright/test';

test('cat 1 visual flow', async ({ page }) => {
  await page.goto(process.env.GAME_URL || 'https://shifulegend.github.io/cat-simulator-endless-city/');
  await page.screenshot({ path: 'output/preload.png' });
});
