import { Types } from "mongoose";

export interface Creature {
  name: string;
  translation: string;
  description: string;
  powerLevel: number;
  strengths: string;
  weaknesses: string;
  funFact: string;
  imageURL: string;
  _createdBy: Types.ObjectId | string;
}
