export interface ApiClientOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  fetchFn?: typeof fetch;
}

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | undefined | null>;
  signal?: AbortSignal;
}

/**
 * Custom error thrown when API responses return non-2xx status codes.
 */
export class ApiClientError extends Error {
  public readonly status: number;
  public readonly statusText: string;
  public readonly data: unknown;

  constructor(status: number, statusText: string, data: unknown) {
    const message =
      typeof data === "object" && data !== null && "message" in data
        ? String((data as { message: unknown }).message)
        : `API request failed with status ${status}: ${statusText}`;
    super(message);
    this.name = "ApiClientError";
    this.status = status;
    this.statusText = statusText;
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Determines the default base URL based on runtime environment variables.
 */
export function resolveBaseUrl(explicitUrl?: string): string {
  if (explicitUrl) return explicitUrl.replace(/\/$/, "");

  // Client / Node environment check
  if (typeof process !== "undefined" && process.env) {
    if (process.env.API_URL) {
      return process.env.API_URL.replace(/\/$/, "");
    }
    if (process.env.VERCEL_URL) {
      const prefix = process.env.VERCEL_URL.startsWith("http") ? "" : "https://";
      return `${prefix}${process.env.VERCEL_URL}`.replace(/\/$/, "");
    }
    if (process.env.PORT) {
      return `http://localhost:${process.env.PORT}`;
    }
  }

  // Browser environment check
  if (typeof window !== "undefined" && window.location) {
    return window.location.origin;
  }

  return "http://localhost:4000";
}

/**
 * Lightweight, fully typed HTTP Client wrapping standard fetch.
 */
export class ApiClient {
  private readonly baseURL: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly fetchImpl: typeof fetch;

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = resolveBaseUrl(options.baseURL);
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };
    this.fetchImpl =
      options.fetchFn ||
      (typeof fetch !== "undefined" ? fetch.bind(globalThis) : (fetch as typeof fetch));
  }

  /**
   * Helper to build fully-qualified URL with query parameters.
   */
  private buildUrl(path: string, params?: RequestOptions["params"]): string {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = new URL(`${this.baseURL}${cleanPath}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value));
        }
      });
    }

    return url.toString();
  }

  /**
   * Core request dispatcher.
   */
  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options: RequestOptions = {},
  ): Promise<T> {
    const targetUrl = this.buildUrl(path, options.params);

    const headers: Record<string, string> = {
      ...this.defaultHeaders,
      ...options.headers,
    };

    const init: RequestInit = {
      method,
      headers,
      signal: options.signal,
    };

    if (body !== undefined) {
      init.body = JSON.stringify(body);
    }

    const response = await this.fetchImpl(targetUrl, init);

    // Parse response body
    let data: unknown;
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = text ? { text } : null;
    }

    if (!response.ok) {
      throw new ApiClientError(response.status, response.statusText, data);
    }

    return data as T;
  }

  public get<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("GET", path, undefined, options);
  }

  public post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("POST", path, body, options);
  }

  public put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PUT", path, body, options);
  }

  public patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<T> {
    return this.request<T>("PATCH", path, body, options);
  }

  public delete<T>(path: string, options?: RequestOptions): Promise<T> {
    return this.request<T>("DELETE", path, undefined, options);
  }
}
