import express, { Application, Request, Response } from "express";
import dotenvFlow from "dotenv-flow";
import routes from "./routes";
import { testConnection } from "./repository/database";
import cors from "cors";
import fileUpload from "express-fileupload";
import path from "path";

dotenvFlow.config();

const app: Application = express();

function setupCors() {
  app.use(
    cors({
      origin: "*",
      methods: "GET,PUT,POST,DELETE",
      allowedHeaders: [
        "auth-token",
        "Origin",
        "X-Requested-With",
        "Content-Type",
        "Accept",
      ],
      credentials: true,
    })
  );
}

export function startServer() {
  setupCors();

  app.use(express.json());

  // Enable file uploads
  app.use(
    fileUpload({
      createParentPath: true,
    })
  );

  // Serve static files from an uploads folder
  app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

  app.use("/api", routes);

  testConnection();

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, function () {
    console.log("Server is up and running on port", PORT);
  });
}
