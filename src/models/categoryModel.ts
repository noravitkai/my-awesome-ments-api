import { Schema, model } from "mongoose";
import { Category } from "../interfaces/category";

const categorySchema = new Schema<Category>(
  {
    name: { type: String, required: true, unique: true, min: 3, max: 255 },
  },
  { timestamps: true }
);

export const CategoryModel = model<Category>("Category", categorySchema);
