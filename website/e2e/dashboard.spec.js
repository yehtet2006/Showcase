import { test, expect } from '@playwright/test';

test('dashboard loads for authenticated user', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Welkom, Tester 1!')).toBeVisible();
});