import type { Response } from "express";

/**
 * Standard successful API response payload contract.
 */
export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  message?: string;
}

/**
 * Standard failed API error response payload contract.
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  details?: unknown;
}

/**
 * Framework-agnostic payload creator for successful responses.
 */
export function createSuccessPayload<T>(data: T, message?: string): ApiResponse<T> {
  const payload: ApiResponse<T> = {
    success: true,
    data,
  };
  if (message) {
    payload.message = message;
  }
  return payload;
}

/**
 * Framework-agnostic payload creator for error responses.
 */
export function createErrorPayload(message: string, details?: unknown): ApiErrorResponse {
  const payload: ApiErrorResponse = {
    success: false,
    message,
  };
  if (details !== undefined) {
    payload.details = details;
  }
  return payload;
}

/**
 * Express helper to send a standardized success response.
 */
export function successResponse<T>(
  res: Response,
  data: T,
  statusCode = 200,
  message?: string,
): Response {
  return res.status(statusCode).json(createSuccessPayload(data, message));
}

/**
 * Express helper to send a standardized error response.
 */
export function errorResponse(
  res: Response,
  message: string,
  statusCode = 500,
  details?: unknown,
): Response {
  return res.status(statusCode).json(createErrorPayload(message, details));
}
