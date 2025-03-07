import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import { Application } from "express";

/**
 * Setup the Swagger documentation
 * @param app
 */
export function setupDocs(app: Application) {
  const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
      title: "A Hungarian Mythical Creatures API",
      version: "1.0.0",
      description:
        "API documentation for managing a collection of mythical creatures from Hungarian folklore.",
    },
    servers: [
      {
        url: "http://localhost:4000/api/",
        description: "Development server",
      },
      {
        url: "https://my-awesome-ments-api.onrender.com/api/",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "auth-token",
        },
      },
      schemas: {
        Creature: {
          type: "object",
          properties: {
            name: { type: "string" },
            translation: { type: "string" },
            description: { type: "string" },
            powerLevel: { type: "number" },
            strengths: { type: "string" },
            weaknesses: { type: "string" },
            funFact: { type: "string" },
            imageURL: { type: "string" },
            _createdBy: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            createdAt: { type: "string" },
            updatedAt: { type: "string" },
          },
        },
      },
    },
  };

  const options = {
    swaggerDefinition,
    apis: ["**/*.ts"],
  };

  const swaggerSpec = swaggerJSDoc(options);

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
