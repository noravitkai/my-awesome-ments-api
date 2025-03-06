import { Schema, model } from "mongoose";
import { User } from "../interfaces/user";

const userSchema = new Schema<User>(
  {
    username: { type: String, required: true, unique: true, min: 3, max: 255 },
    email: {
      type: String,
      required: true,
      min: 6,
      max: 255,
      unique: true,
      match: /\S+@\S+\.\S+/,
    },
    password: { type: String, required: true, min: 6, max: 255 },
  },
  { timestamps: true }
);

export const UserModel = model<User>("User", userSchema);
