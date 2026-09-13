import { Schema, Document, Model } from "mongoose";
import { defineModel } from "../define-model.js";

export interface ICourse extends Document {
  code: string;
  name: string;
  credits: number;
  departmentCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
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
    credits: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    departmentCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Course: Model<ICourse> = defineModel<ICourse>("Course", courseSchema);
