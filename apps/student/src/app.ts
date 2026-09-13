import express, { Express, Request, Response } from "express";
import cors from "cors";
import { env } from "@cms/config";
import { errorHandler, successResponse } from "@cms/http";

/**
 * Bootstrap the Student Express application.
 * Domain feature teams (attendance, marks, assignments) should mount their routers here.
 */
export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req: Request, res: Response) => {
    successResponse(res, {
      service: "student-service",
      version: "1.0.0",
      environment: env.NODE_ENV,
    });
  });

  app.get("/api/health", (_req: Request, res: Response) => {
    successResponse(res, {
      status: "healthy",
      service: "student-service",
      timestamp: new Date().toISOString(),
    });
  });

  app.use(errorHandler);

  return app;
}

export const app: Express = createApp();

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4002;
  app.listen(port, () => {
    console.log(`[Student Portal] Server listening on port ${port}`);
  });
}
