import { ApiClient } from "./client.js";

export * from "./client.js";

/**
 * Factory to create custom configured ApiClient instances.
 */
export function createApiClient(baseURL?: string, headers?: Record<string, string>): ApiClient {
  return new ApiClient({ baseURL, headers });
}

/**
 * Default singleton instance configured from current environment.
 */
export const client = new ApiClient();
