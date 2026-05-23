import { test, expect } from '@playwright/test';

test.describe('Edit Profile Page', () => {
    test.beforeEach(async ({ page }) => {
        if (page.url().includes('/signin')) {
            await page.getByRole('textbox', { name: 'Email address' }).fill(process.env.E2E_EMAIL);
            await page.getByRole('button', { name: 'Continue' }).click();
            await page.getByRole('textbox', { name: 'Password' }).fill(process.env.E2E_PASSWORD);
            await page.getByRole('button', { name: 'Continue' }).click();
            // await page.context().storageState({
            // path: 'playwright/.auth/user.json',
            // });
        }
        await page.goto('/profile');
        
    });

    test('renders profile information', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Account' })).toBeVisible();
        await expect(page.getByText('Manage your account info.')).toBeVisible();
        await expect(page.getByRole('button', { name: 'Profile', exact: true })).toBeVisible();
        await expect (page.getByRole('paragraph').filter({ hasText: 'Profile' })).toBeVisible();
        await expect (page.getByRole('button', { name: 'Update profile' })).toBeVisible();
        await expect (page.getByText('Email addresses')).toBeVisible();
        await expect (page.getByText(process.env.E2E_EMAIL)).toBeVisible();

        await page.getByRole('button', { name: 'Open menu' }).click();
        await page.locator('button').filter({ hasText: 'Security' }).click();

        await expect (page.getByText('Password', { exact: true })).toBeVisible();
        await expect (page.getByText('••••••••••')).toBeVisible();
        await expect (page.getByRole('button', { name: 'Update password' })).toBeVisible();
    });

    test('edit profile information', async ({ page }) => {
        const randomNum = Math.floor(Math.random() * 1000);

        await page.getByRole('button', { name: 'Profile', exact: true }).click();
        await page.getByRole('button', { name: 'Update profile' }).click();
        await page.getByRole('textbox', { name: 'Last name' }).click();
        await page.getByRole('textbox', { name: 'Last name' }).fill(`Test${randomNum}`);
        await page.getByRole('button', { name: 'Save' }).click();
        await expect(page.getByText(`Tester Test${randomNum}`)).toBeVisible();
    });

    
});