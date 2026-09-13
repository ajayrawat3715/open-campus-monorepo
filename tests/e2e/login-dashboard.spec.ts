import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/auth.js";

test.describe("Core Authentication & Dashboard Smoke Test", () => {
  test("Scenario: User navigates to login, authenticates, and reaches dashboard", async ({
    page,
  }) => {
    // Retrieve credentials from environment variables
    const email = process.env.E2E_TEST_EMAIL || "admin@college.edu";
    const password = process.env.E2E_TEST_PASSWORD || "AdminSecurePassword123!";

    // 1. Open login page
    await page.goto("/login");
    await expect(page).toHaveTitle(/Login/i);

    // 2 & 3. Enter credentials and click login via reusable helper
    await loginUser(page, { email, password });

    // 4. Verify successful navigation to dashboard
    await expect(page).toHaveURL(/.*dashboard.*/);

    // 5. Verify dashboard view is visible
    const dashboardElement = page.locator("#dashboard, [data-testid='dashboard']");
    await expect(dashboardElement).toBeVisible();
  });
});
