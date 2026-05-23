import { test, expect } from "@playwright/test";

test.describe("Transactions page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/transactions");
  });

  test("renders transactions table", async ({ page }) => {
    const table = page.getByTestId("transactions-list");
    await expect(table).toBeVisible();

    // Add transaction link
    await expect(
      page.getByRole("link", { name: "+ Voeg een transactie toe" })
    ).toBeVisible();

    // Header row assertions
    await expect(page.getByTestId("transaction-header-name")).toContainText("Naam");
    await expect(page.getByTestId("transaction-header-description")).toContainText("Beschrijving");
    await expect(page.getByTestId("transaction-header-amount")).toContainText("Bedrag");
    await expect(page.getByTestId("transaction-header-date")).toContainText("Datum");
    await expect(page.getByTestId("transaction-header-category")).toContainText("Categorie");
    await expect(page.getByTestId("transaction-header-actions")).toContainText("Acties");

    // Either transactions exist or empty state is shown
    const rows = page.getByTestId("transaction-name");

    if (await rows.count() > 0) {
      // Basic sanity check on first row
      await expect(rows.first()).toBeVisible();

      await expect(page.getByTestId("transaction-description").first()).toBeVisible();
      await expect(page.getByTestId("transaction-amount").first()).toBeVisible();
      await expect(page.getByTestId("transaction-date").first()).toBeVisible();
      await expect(page.getByTestId("transaction-category").first()).toBeVisible();
    } else {
      await expect(page.getByText("Geen transacties gevonden.")).toBeVisible();
    }
  });
});