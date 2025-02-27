import express, { Application, Request, Response } from "express";
import dotenvFlow from "dotenv-flow";
import routes from "./routes";
import { testConnection } from "./repository/database";

dotenvFlow.config();

const app: Application = express();

export function startServer() {
  app.use(express.json());

  app.use("/api", routes);

  testConnection();

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, function () {
    console.log("Server is up and running on port 4000.");
  });
}
