import { Schema, Document, Model } from "mongoose";
import { defineModel } from "../define-model.js";

export interface IDepartment extends Document {
  code: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const departmentSchema = new Schema<IDepartment>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Department: Model<IDepartment> = defineModel<IDepartment>(
  "Department",
  departmentSchema,
);
