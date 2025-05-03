import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/basePage';

test('User visits the webpage', async ({ page }) => {
  const ThisPage = new BasePage(page);
  await ThisPage.goto();
});