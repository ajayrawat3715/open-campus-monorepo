import type { Request, Response, NextFunction, RequestHandler } from "express";
import { AppError } from "./errors.js";
import { errorResponse } from "./response.js";

/**
 * Async wrapper for Express route handlers to capture unhandled promise rejections
 * and route them cleanly to the centralized error middleware.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Centralized error handler middleware.
 * Transforms AppErrors, Mongoose validation errors, and untrapped exceptions into
 * consistent JSON error responses.
 */
export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  // If the error is a recognized operational AppError
  if (err instanceof AppError) {
    errorResponse(res, err.message, err.statusCode, err.details);
    return;
  }

  // Handle Mongoose / MongoDB duplicate key error (E11000)
  if ("code" in err && (err as { code: unknown }).code === 11000) {
    errorResponse(res, "Duplicate record found. This entity already exists.", 409);
    return;
  }

  // Handle Mongoose Validation Error
  if (err.name === "ValidationError") {
    errorResponse(res, "Validation failed", 400, (err as unknown as { errors: unknown }).errors);
    return;
  }

  // Handle Mongoose CastError (invalid ObjectId)
  if (err.name === "CastError") {
    errorResponse(res, "Invalid identifier format", 400);
    return;
  }

  // Unexpected runtime error (log for observability, return opaque message in production)
  console.error("Unhandled Application Exception:", err);

  const isProduction = process.env.NODE_ENV === "production";
  const message = isProduction ? "An unexpected internal error occurred" : err.message;

  errorResponse(res, message, 500);
}
