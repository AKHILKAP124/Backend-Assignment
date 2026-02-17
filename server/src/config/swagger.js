import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Management API",
      version: "1.0.0",
      description: "Scalable REST API with JWT & RBAC",
    },
    servers: [
      {
        url: "https://backend-assignment-1-e7a1.onrender.com/api",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [process.env.SWAGGER_BEARERAUTH],
      },
    ],
    schemas: {
      User: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string", enum: ["user", "admin"] },
          createdAt: { type: "string" },
        },
      },
      Task: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          status: {
            type: "string",
            enum: ["pending", "completed"],
          },
          user: {
            $ref: "#/components/schemas/User",
          },
          createdAt: { type: "string" },
        },
      },
    },
    tags: [
      { name: "Auth", description: "Authentication routes" },
      { name: "Tasks", description: "User task operations" },
      { name: "Admin", description: "Admin operations" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};
