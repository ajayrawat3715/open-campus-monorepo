import mongoose, { Model, Schema } from "mongoose";

/**
 * Reusable helper to safely register Mongoose models in environments with hot-reloading
 * or serverless re-executions (e.g. Next.js, Vercel, tsx watch).
 *
 * In such runtimes, files defining models are frequently re-evaluated. If `mongoose.model()`
 * is called on an already registered model name, Mongoose throws an `OverwriteModelError`.
 *
 * `defineModel` safely checks the existing `mongoose.models` registry first. If the model
 * exists, it reuses that compiled model; otherwise, it creates and registers a new one.
 *
 * @template T - The TypeScript document interface
 * @template M - The Mongoose Model type (defaults to Model<T>)
 * @param name - The collection/model name (e.g. "User")
 * @param schema - The Mongoose schema instance
 * @returns The strongly-typed Mongoose Model
 *
 * @example
 * const User = defineModel<IUser>("User", userSchema);
 */
export function defineModel<T, M = Model<T>>(name: string, schema: Schema<T, M>): M {
  if (mongoose.models && mongoose.models[name]) {
    return mongoose.models[name] as unknown as M;
  }
  return mongoose.model<T, M>(name, schema);
}
