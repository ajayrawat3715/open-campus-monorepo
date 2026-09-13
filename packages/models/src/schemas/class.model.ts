import { Schema, Document, Model } from "mongoose";
import { defineModel } from "../define-model.js";

export interface IClass extends Document {
  name: string;
  departmentCode: string;
  academicYear: string;
  semester: number;
  section: string;
  createdAt: Date;
  updatedAt: Date;
}

const classSchema = new Schema<IClass>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    departmentCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    academicYear: {
      type: String,
      required: true,
      trim: true,
    },
    semester: {
      type: Number,
      required: true,
      min: 1,
      max: 8,
    },
    section: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index to guarantee uniqueness of a class section per year & semester
classSchema.index(
  { departmentCode: 1, academicYear: 1, semester: 1, section: 1 },
  { unique: true },
);

export const ClassModel: Model<IClass> = defineModel<IClass>("Class", classSchema);
