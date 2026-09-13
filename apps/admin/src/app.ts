import express, { Express, Request, Response } from "express";
import cors from "cors";
import { env } from "@cms/config";
import { errorHandler, successResponse } from "@cms/http";

/**
 * Bootstrap the Admin Express application.
 * Contains foundational middleware and error handling without business logic.
 * Feature teams should mount their domain routers to this app instance.
 */
export function createApp(): Express {
  const app = express();

  // Foundational Security & Parsing Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root endpoint info
  app.get("/", (_req: Request, res: Response) => {
    successResponse(res, {
      service: "admin-service",
      version: "1.0.0",
      environment: env.NODE_ENV,
    });
  });

  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    successResponse(res, {
      status: "healthy",
      service: "admin-service",
      timestamp: new Date().toISOString(),
    });
  });

  // Centralized Error Handling Middleware (must be registered last)
  app.use(errorHandler);

  return app;
}

export const app: Express = createApp();

// Start standalone server when executed directly (local development)
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4001;
  app.listen(port, () => {
    console.log(`[Admin Portal] Server listening on port ${port}`);
  });
}
