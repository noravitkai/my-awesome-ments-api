import { test, expect } from "@playwright/test";

export default function health() {
  test("Health check for API root route", async ({ request }) => {
    const response = await request.get("/api/");
    const text = await response.text();

    expect(response.status()).toBe(200);
    expect(text).toBe("Welcome to a Hungarian Mythical Creatures API!");
  });
}
