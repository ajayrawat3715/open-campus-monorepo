import type { Request, Response } from "express";
import { app } from "../src/app.js";
import { connectDB } from "@cms/models";
import { errorResponse } from "@cms/http";

export default async function handler(req: Request, res: Response): Promise<void> {
  try {
    await connectDB();
    app(req, res);
  } catch (error) {
    console.error("[Web Serverless Gateway Error]:", error);
    errorResponse(res, "Database or server gateway failure", 500);
  }
}
