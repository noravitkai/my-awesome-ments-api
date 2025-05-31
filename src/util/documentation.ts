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
        User: {
          type: "object",
          properties: {
            _id: { type: "string", readOnly: true },
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            createdAt: { type: "string", readOnly: true },
            updatedAt: { type: "string", readOnly: true },
          },
        },
        Creature: {
          type: "object",
          properties: {
            _id: { type: "string", readOnly: true },
            name: { type: "string" },
            translation: { type: "string" },
            description: { type: "string" },
            powerLevel: { type: "number" },
            strengths: { type: "string" },
            weaknesses: { type: "string" },
            funFact: { type: "string" },
            imageURL: { type: "string" },
            _createdBy: { type: "string", readOnly: true },
            createdAt: { type: "string", readOnly: true },
            updatedAt: { type: "string", readOnly: true },
          },
        },
        Question: {
          type: "object",
          properties: {
            _id: { type: "string", readOnly: true },
            text: { type: "string" },
            options: {
              type: "array",
              minItems: 2,
              items: {
                type: "object",
                properties: {
                  text: { type: "string" },
                  creatureIds: {
                    type: "array",
                    minItems: 1,
                    items: { type: "string" },
                  },
                },
                required: ["text", "creatureIds"],
              },
            },
            _createdBy: { type: "string", readOnly: true },
            createdAt: { type: "string", readOnly: true },
            updatedAt: { type: "string", readOnly: true },
          },
          required: ["text", "options", "_createdBy"],
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
