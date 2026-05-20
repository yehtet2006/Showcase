import { test, expect } from '@playwright/test';

test('dashboard loads for authenticated user', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('Welkom, Tester 1!')).toBeVisible();
  await expect(page.getByRole('button', { name: 'apr' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'mei' })).toBeVisible();

  await page.pause();
});