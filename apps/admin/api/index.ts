import type { Request, Response } from "express";
import { app } from "../src/app.js";
import { connectDB } from "@cms/models";
import { errorResponse } from "@cms/http";

/**
 * Vercel Serverless Function entry point for Admin portal API.
 * Ensures serverless-safe Mongoose connection pre-warming prior to routing the request.
 */
export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    // Pre-warm database connection via serverless global cache
    await connectDB();
    // Dispatch to Express application
    app(req, res);
  } catch (error) {
    console.error("[Admin Serverless Gateway Error]:", error);
    errorResponse(res, "Database or server gateway failure", 500);
  }
}
