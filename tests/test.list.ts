process.env.NODE_ENV = "test";

import { test } from "@playwright/test";

import health from "./health.test";
import userTestCollection from "./user.test";

import { UserModel } from "../src/models/userModel";

import dotenvFlow from "dotenv-flow";
import { connect, disconnect } from "../src/repository/database";

dotenvFlow.config();

/**
 * Set up the test environment by cleaning the database before and after tests
 */
function setup() {
  test.beforeEach(async () => {
    await connect();
    await UserModel.deleteMany({});
    await disconnect();
  });

  test.afterAll(async () => {
    await connect();
    await UserModel.deleteMany({});
    await disconnect();
  });
}

setup();

// Register the test collections
test.describe(health); // Simple health check test
test.describe(userTestCollection); // User registration and login tests
