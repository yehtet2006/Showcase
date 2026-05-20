import { test, expect } from '@playwright/test';

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/"); // adjust if dashboard route differs
  });

  test("renders welcome message", async ({ page }) => {
    await expect(page.getByTestId("Welcome-title")).toContainText(
      "Welkom"
    );
  });

  test("renders dashboard description", async ({ page }) => {
    await expect(
      page.getByTestId("Dashboard-description")
    ).toBeVisible();
  });

  test("month selection works", async ({ page }) => {
    const monthButtons = page.getByTestId("month-button");
    const lastThreeMonths = []; // will return [ 'mei', 'apr', 'mrt' ] for example if currunt month is May
    for (let i = 0; i < 3; i++) {
      const date = new Date();
      // Subtract i months from the current date
      date.setMonth(date.getMonth() - i); 
      lastThreeMonths.push(
        date.toLocaleString("nl", { month: "short" })
      );
    }
    // click first available month button
    const first = monthButtons.first(); // should be the most recent month
    const second = monthButtons.nth(1); // should be the second most recent month
    const third = monthButtons.nth(2); // should be the third most recent month

    await first.click();
    await expect(page.getByRole("button", { name: lastThreeMonths[0] })).toBeVisible();
    await expect(first).toHaveClass(/active/);

    await second.click();
    await expect(page.getByRole("button", { name: lastThreeMonths[1] })).toBeVisible();
    await expect(second).toHaveClass(/active/);

    await third.click();
    await expect(page.getByRole("button", { name: lastThreeMonths[2] })).toBeVisible();
    await expect(third).toHaveClass(/active/);
    
  });

  test("navigates to add transaction page", async ({ page }) => {
    await page.getByTestId("add-transaction-button").click();

    await expect(page).toHaveURL(/transactions\/add/);
  });

  test("amount cards are visible", async ({ page }) => {
    await expect(page.getByTestId("amount-card-total")).toBeVisible();
    await expect(page.getByTestId("amount-card-income")).toBeVisible();
    await expect(page.getByTestId("amount-card-expenses")).toBeVisible();
    await expect(page.getByTestId("amount-card-savings")).toBeVisible();
  });

  test("switches between 6 and 12 month chart view", async ({ page }) => {
    const btn6 = page.getByTestId("month-btn-6");
    const btn12 = page.getByTestId("month-btn-12");

    await expect(btn6).toBeVisible();
    await expect(btn12).toBeVisible();
    await btn12.click();
    await expect(btn12).toHaveClass(/active/);
    await btn6.click();
    await expect(btn6).toHaveClass(/active/);
  });

  test("toggles expense view (all vs current month)", async ({ page }) => {
    const toggle = page.getByTestId("show-all-expenses-btn");

    await expect(toggle).toBeVisible();

    await toggle.click();
    await toggle.click();
  });

  test("recent transactions section is visible", async ({ page }) => {
    await expect(
      page.getByTestId("all-transaction-div")
    ).toBeVisible();
  });
});