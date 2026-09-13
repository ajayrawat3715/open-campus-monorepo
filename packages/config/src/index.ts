import dotenv from "dotenv";
import { z } from "zod";

// Load local .env if available
dotenv.config();

/**
 * Zod schema defining the application environment contract.
 * Strictly validates presence and formatting of critical infrastructure variables.
 */
export const envSchema = z.object({
  // Required Database URI
  MONGODB_URI: z
    .string({
      required_error:
        "CRITICAL: MONGODB_URI is required. Please define it in your .env or platform variables.",
    })
    .min(1, "MONGODB_URI cannot be empty")
    .refine(
      (uri) => uri.startsWith("mongodb://") || uri.startsWith("mongodb+srv://"),
      "MONGODB_URI must begin with 'mongodb://' or 'mongodb+srv://'",
    ),

  // Required Runtime Environment
  NODE_ENV: z
    .enum(["development", "test", "production"], {
      invalid_type_error: "NODE_ENV must be one of 'development', 'test', or 'production'",
      required_error: "NODE_ENV is required (e.g. 'development', 'production', 'test')",
    })
    .default("development"),

  // Optional Server Port
  PORT: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 4000))
    .pipe(z.number().positive("PORT must be a positive integer")),

  // Optional Base API URL
  API_URL: z.string().url("API_URL must be a valid URL").optional(),

  // Optional Vercel System Deployment URL
  VERCEL_URL: z.string().optional(),

  // Optional E2E credentials for automated testing
  E2E_TEST_EMAIL: z.string().email().optional(),
  E2E_TEST_PASSWORD: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Validates environment variables and outputs formatted human-readable diagnostics on failure.
 */
export function validateEnv(rawEnv: Record<string, unknown> = process.env): EnvConfig {
  const result = envSchema.safeParse(rawEnv);

  if (!result.success) {
    const formattedErrors = result.error.errors
      .map((err) => `  ✖ [${err.path.join(".")}] ${err.message}`)
      .join("\n");

    const message = [
      "\n=======================================================",
      "🚨 ENVIRONMENT CONFIGURATION ERROR",
      "=======================================================",
      "The following environment variables failed validation:\n",
      formattedErrors,
      "\n👉 Please check your .env file or deployment settings.",
      "Refer to docs/onboarding.md or .env.example for guidance.",
      "=======================================================\n",
    ].join("\n");

    // In non-test environments or when explicitly validated, throw descriptive error
    console.error(message);
    throw new Error(message);
  }

  return result.data;
}

// Lazy/safe singleton parsed env.
// During build/CI steps where MONGODB_URI may not be provided, we provide safe fallback handling.
let cachedEnv: EnvConfig | null = null;

export function getEnv(): EnvConfig {
  if (!cachedEnv) {
    cachedEnv = validateEnv(process.env);
  }
  return cachedEnv;
}

export const env: EnvConfig = ((): EnvConfig => {
  try {
    return validateEnv(process.env);
  } catch (_err) {
    // If running in CI or build phase where env vars are not yet populated, return safe partial defaults
    return {
      MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/college-cms",
      NODE_ENV: (process.env.NODE_ENV as "development" | "test" | "production") || "development",
      PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
      API_URL: process.env.API_URL,
      VERCEL_URL: process.env.VERCEL_URL,
      E2E_TEST_EMAIL: process.env.E2E_TEST_EMAIL,
      E2E_TEST_PASSWORD: process.env.E2E_TEST_PASSWORD,
    };
  }
})();
