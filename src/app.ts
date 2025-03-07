import express, { Application } from "express";
import dotenvFlow from "dotenv-flow";
import routes from "./routes";
import { testConnection } from "./repository/database";
import cors from "cors";
import fileUpload from "express-fileupload";
import { setupDocs } from "./util/documentation";

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

  setupDocs(app);

  app.use(
    fileUpload({
      createParentPath: true,
    })
  );

  app.use("/api", routes);

  testConnection();

  const PORT: number = parseInt(process.env.PORT as string) || 4000;
  app.listen(PORT, function () {
    console.log("Server is up and running on port", PORT);
  });
}
