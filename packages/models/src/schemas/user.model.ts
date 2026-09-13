import { Schema, Document, Model } from "mongoose";
import { defineModel } from "../define-model.js";

export type UserRole = "admin" | "teacher" | "student";

export interface IUser extends Document {
  name: string;
  email: string;
  role: UserRole;
  passwordHash: string;
  department?: string;
  rollNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      required: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      trim: true,
    },
    rollNumber: {
      type: String,
      trim: true,
      sparse: true,
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

export const User: Model<IUser> = defineModel<IUser>("User", userSchema);
