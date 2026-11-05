import { test, expect } from "@playwright/test";

test("F01 create page loads and accepts a title", async ({ page }) => {
  await page.goto("/create");
  await page.getByPlaceholder(/Free Sample Pack/i).fill("PW Test Link");
  await expect(page.getByText(/What people get/i)).toBeVisible();
});

test("admin guard redirects anonymous users", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/(login)?$/);
});
