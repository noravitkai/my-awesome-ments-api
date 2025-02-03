import { Schema, model } from "mongoose";
import { Creature } from "../interfaces/creature";

const creatureSchema = new Schema<Creature>(
  {
    name: { type: String, required: true, min: 3, max: 255 },
    translation: { type: String, required: true, min: 3, max: 255 },
    description: { type: String, required: true, min: 6, max: 150 },
    powerLevel: { type: Number, required: true, min: 1, max: 100 },
    strengths: { type: String, required: true, min: 3, max: 255 },
    weaknesses: { type: String, required: true, min: 3, max: 255 },
    folkloreStory: { type: String, required: true, min: 10, max: 300 },
    imageURL: { type: String, required: true },
    category: { type: String, ref: "Category", required: true },
    _createdBy: { type: String, ref: "User", required: true },
  },
  { timestamps: true }
);

export const CreatureModel = model<Creature>("Creature", creatureSchema);
