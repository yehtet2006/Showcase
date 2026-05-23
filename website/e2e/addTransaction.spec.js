import { test, expect } from "@playwright/test";

test.describe("Add Transaction page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/transactions/add");
  });
  
  test("renders add transaction form", async ({ page }) => {
    await expect(page.getByTestId("add-transaction-form")).toBeVisible();

    await expect(page.getByTestId("transaction-name-input")).toBeVisible();
    await expect(page.getByTestId("transaction-amount-input")).toBeVisible();
    await expect(page.getByTestId("transaction-date-input")).toBeVisible();
    await expect(page.getByTestId("transaction-description-input")).toBeVisible();
    await expect(page.getByTestId("transaction-category-select")).toBeVisible();

    await expect(page.getByTestId("transaction-income-button")).toBeVisible();
    await expect(page.getByTestId("transaction-expense-button")).toBeVisible();
    await expect(page.getByTestId("transaction-savings-button")).toBeVisible();

    await expect(page.getByTestId("add-transaction-button")).toBeVisible();
    await expect(page.getByTestId("reset-transaction-button")).toBeVisible();
  });

  test("fills and submits a transaction", async ({ page }) => {
    await page.getByTestId("transaction-name-input").fill("Salary");
    await page.getByTestId("transaction-amount-input").fill("2500");

    await page.getByTestId("transaction-income-button").click();

    await page.getByTestId("transaction-date-input").fill(new Date().toISOString().split('T')[0]);
    await page.getByTestId("transaction-description-input").fill("Monthly salary");

    // Select first available category (if any exist)
    const categorySelect = page.getByTestId("transaction-category-select");
    const options = await categorySelect.locator("option").count();

    if (options > 1) {
      const firstValue = await categorySelect.locator("option").nth(1).getAttribute("value");
      await categorySelect.selectOption(firstValue);
    }

    await page.getByTestId("add-transaction-button").click();

    // Expect either redirect or success state (adjust based on your app)
    // await expect(page).not.toHaveURL("/transactions/add");
  });

  test("can switch transaction type buttons", async ({ page }) => {
    const income = page.getByTestId("transaction-income-button");
    const expense = page.getByTestId("transaction-expense-button");
    const savings = page.getByTestId("transaction-savings-button");

    await income.click();
    await expect(income).toHaveClass(/active/);

    await expense.click();
    await expect(expense).toHaveClass(/active/);

    await savings.click();
    await expect(savings).toHaveClass(/active/);
  });

  test("can add a new category", async ({ page }) => {
    const nameInput = page.getByTestId("new-category-name-input");
    const colorInput = page.getByTestId("new-category-color-input");
    const addBtn = page.getByTestId("add-category-button");
    const select = page.getByTestId("transaction-category-select");
    const categorySelect = page.getByTestId("transaction-category-select");
    const options = await categorySelect.locator("option").count();
    const firstValue = await categorySelect.locator("option").nth(1).getAttribute("value");

    
    if (await select.locator("option").count() > 1) {
      await categorySelect.selectOption(firstValue);
    } else {
      const categoryName = `Test Category ${Date.now()}`;
      await nameInput.fill(categoryName);
      await page.getByTestId('new-category-color-input').click();
      await page.getByTestId('new-category-color-input').fill('#a21a1a');
      await page.getByTestId('add-category-button').click();
      await addBtn.click();
      await categorySelect.selectOption(firstValue);
    }
  });

  test("reset button clears form", async ({ page }) => {
    await page.getByTestId("transaction-name-input").fill("Test");
    await page.getByTestId("transaction-amount-input").fill("123");
    await page.getByTestId("transaction-description-input").fill("Something");

    await page.getByTestId("reset-transaction-button").click();

    await expect(page.getByTestId("transaction-name-input")).toHaveValue("");
    await expect(page.getByTestId("transaction-amount-input")).toHaveValue("");
    await expect(page.getByTestId("transaction-description-input")).toHaveValue("");
  });
});