import express, { Express, Request, Response } from "express";
import cors from "cors";
import { env } from "@cms/config";
import { errorHandler, successResponse } from "@cms/http";

/**
 * Bootstrap the Public Web Express application.
 * Marketing, admission inquiries, public announcements, and landing pages mount here.
 */
export function createApp(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root endpoint info
  app.get("/", (_req: Request, res: Response) => {
    successResponse(res, {
      service: "web-service",
      version: "1.0.0",
      environment: env.NODE_ENV,
    });
  });

  // Health check endpoint
  app.get("/api/health", (_req: Request, res: Response) => {
    successResponse(res, {
      status: "healthy",
      service: "web-service",
      timestamp: new Date().toISOString(),
    });
  });

  // Foundational auth test routes for Playwright E2E harness
  app.get("/login", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Login - College Management System</title>
          <style>
            body { font-family: system-ui, sans-serif; display: grid; place-content: center; height: 100vh; margin: 0; background: #f8fafc; }
            .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); width: 320px; }
            input { width: 100%; padding: 0.5rem; margin: 0.5rem 0 1rem; border: 1px solid #cbd5e1; border-radius: 4px; box-sizing: border-box; }
            button { width: 100%; padding: 0.6rem; background: #2563eb; color: white; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Sign In</h2>
            <form action="/dashboard" method="GET">
              <label for="email">Email Address</label>
              <input id="email" name="email" type="email" required placeholder="name@college.edu" />
              <label for="password">Password</label>
              <input id="password" name="password" type="password" required />
              <button id="login-button" type="submit">Sign In</button>
            </form>
          </div>
        </body>
      </html>
    `);
  });

  app.get("/dashboard", (_req: Request, res: Response) => {
    res.setHeader("Content-Type", "text/html");
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Dashboard - College Management System</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 2rem; background: #f8fafc; }
            #dashboard { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1); }
          </style>
        </head>
        <body>
          <div id="dashboard" data-testid="dashboard">
            <h1>Welcome to Dashboard</h1>
            <p>Platform infrastructure operational. Ready for domain features.</p>
          </div>
        </body>
      </html>
    `);
  });

  app.use(errorHandler);

  return app;
}

export const app: Express = createApp();

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;
  app.listen(port, () => {
    console.log(`[Web Portal] Server listening on port ${port}`);
  });
}
