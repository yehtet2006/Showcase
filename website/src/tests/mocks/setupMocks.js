import { usersMock } from "./usersMock";
import { dashboardMock } from "./dashboardMock";

export async function setupMocks(page) {

  // USERS
  await page.route("**/users/all", async route => {
    await route.fulfill({
      json: usersMock
    });
  });

  await page.route("**/users/*", async route => {
    await route.fulfill({
      json: {
        user: {
          name: "Test User",
          role: "admin"
        }
      }
    });
  });

  // DASHBOARD
  await page.route("**/transactions/dashboard/stats", async route => {
    await route.fulfill({
      json: dashboardMock
    });
  });
}