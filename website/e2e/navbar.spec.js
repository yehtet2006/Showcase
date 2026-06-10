import { test, expect } from "@playwright/test";

test("navbar working properly", async ({page}) => {
    await page.goto("/");

    // Check if all nav links are visible
    await expect(page.getByTestId("nav-dashboard")).toBeVisible();
    await expect(page.getByTestId("nav-transactions")).toBeVisible();
    await expect(page.getByTestId("nav-analytics")).toBeVisible();
    await expect(page.getByTestId("nav-profile")).toBeVisible();
    // Check if collapse button is working
    const collapseBtn = page.getByTestId("collapse-btn");
    await expect(collapseBtn).toBeVisible();
    await collapseBtn.click();
    await expect(page.getByTestId("sidebar")).toHaveClass(/collapsed/);
    await collapseBtn.click();
    await expect(page.getByTestId("sidebar")).not.toHaveClass(/collapsed/);

    // Check if admin link is visible for admin users
    await expect(page.getByTestId("nav-settings")).not.toBeVisible();

    await page.getByTestId("nav-dashboard").click();
    await expect(page).toHaveURL("/");

    await page.getByTestId("nav-transactions").click();
    await expect(page).toHaveURL("/transactions");

    await page.getByTestId("nav-analytics").click();
    await expect(page).toHaveURL("/analytics");

    await page.getByTestId("nav-profile").click();
    await expect(page).toHaveURL("/profile");
})
