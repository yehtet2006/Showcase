import { test, expect } from '@playwright/test';

test('auth setup', async ({ page }) => {
  await page.goto('/signin');

  if (page.url().includes('/signin')) {
    await page.getByRole('textbox', { name: 'Email address' }).fill(process.env.E2E_EMAIL);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.getByRole('textbox', { name: 'Password' }).fill(process.env.E2E_PASSWORD);
    await page.getByRole('button', { name: 'Continue' }).click();
    await page.context().storageState({
      path: 'playwright/.auth/user.json',
    });
  }
  test.skip(true, 'Not on signin page');
});