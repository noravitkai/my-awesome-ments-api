import { defineConfig } from "@playwright/test";

export default defineConfig({
  timeout: 5000,
  testDir: "./tests",
  fullyParallel: false,
  testMatch: "test.list.ts",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:4000",

    trace: "on-first-retry",
  },

  webServer: {
    command: "npm run testdb",
    url: "http://localhost:4000/api",
    reuseExistingServer: false,
  },
});
