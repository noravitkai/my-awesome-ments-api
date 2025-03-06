import { User } from "./user";

export interface Creature extends Document {
  _id: string;
  name: string;
  translation: string;
  description: string;
  powerLevel: number;
  strengths: string;
  weaknesses: string;
  funFact: string;
  imageURL: string;
  _createdBy: User["_id"];
}
