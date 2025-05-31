import { Types } from "mongoose";

export interface Choice {
  text: string;
  creatureIds: string[];
}

export interface Question extends Document {
  _id: string;
  text: string;
  options: Choice[];
  _createdBy: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}
