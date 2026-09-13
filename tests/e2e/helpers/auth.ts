import { Page, expect } from "@playwright/test";

export interface LoginCredentials {
  email?: string;
  password?: string;
}

/**
 * Reusable Playwright authentication helper for all monorepo feature teams.
 * Extracts credentials securely from environment variables.
 */
export async function loginUser(page: Page, credentials: LoginCredentials = {}): Promise<void> {
  const email = credentials.email || process.env.E2E_TEST_EMAIL || "admin@college.edu";
  const password =
    credentials.password || process.env.E2E_TEST_PASSWORD || "AdminSecurePassword123!";

  // 1. Navigate to login page
  await page.goto("/login");

  // 2. Fill in credentials
  await page.locator('input[name="email"], input[type="email"], #email').fill(email);
  await page.locator('input[name="password"], input[type="password"], #password').fill(password);

  // 3. Submit credentials
  await page.locator('button[type="submit"], #login-button').click();

  // 4. Verify successful redirection away from login
  await expect(page).not.toHaveURL(/\/login$/);
}
