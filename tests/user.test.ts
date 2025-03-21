import { test, expect } from "@playwright/test";

export default function userTestCollection() {
  const user = {
    username: "MythFan",
    email: "mythfan@example.com",
    password: "StrongPass123",
  };

  test("Registration with valid data should create a new user", async ({
    request,
  }) => {
    const response = await request.post("/api/user/register", { data: user });
    const json = await response.json();

    expect(response.status()).toBe(201);
    expect(json.error).toBeNull();
    expect(json.data).toBeDefined();
  });

  test("Registration with too short password should return a 400 error", async ({
    request,
  }) => {
    const invalidUser = {
      username: "ShortPassUser",
      email: "shortpass@example.com",
      password: "123",
    };

    const response = await request.post("/api/user/register", {
      data: invalidUser,
    });
    const json = await response.json();

    expect(response.status()).toBe(400);
    expect(json.error).toContain("password");
  });

  test("Registration with duplicate email should fail with 400", async ({
    request,
  }) => {
    await request.post("/api/user/register", { data: user });

    const response = await request.post("/api/user/register", { data: user });
    const json = await response.json();

    expect(response.status()).toBe(400);
    expect(json.error).toBe("Email already exists.");
  });

  test("Login with correct credentials should return token and userId", async ({
    request,
  }) => {
    await request.post("/api/user/register", { data: user });

    const response = await request.post("/api/user/login", {
      data: {
        email: user.email,
        password: user.password,
      },
    });

    const json = await response.json();

    expect(response.status()).toBe(200);
    expect(json.error).toBeNull();
    expect(json.data.token).toBeDefined();
    expect(json.data.userId).toBeDefined();
  });

  test("Login with incorrect password should return a 400 error", async ({
    request,
  }) => {
    await request.post("/api/user/register", { data: user });

    const response = await request.post("/api/user/login", {
      data: {
        email: user.email,
        password: "wrongpass",
      },
    });

    const json = await response.json();

    expect(response.status()).toBe(400);
    expect(json.error).toBe("Password or email is wrong.");
  });
}
