import { Category } from "./category";
import { User } from "./user";

export interface Creature extends Document {
  _id: string;
  name: string;
  translation: string;
  description: string;
  powerLevel: number;
  strengths: string;
  weaknesses: string;
  folkloreStory: string;
  imageURL: string;
  category: Category["_id"];
  _createdBy: User["_id"];
}
