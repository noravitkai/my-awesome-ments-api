import { Schema, model } from "mongoose";
import { Creature } from "../interfaces/creature";

const creatureSchema = new Schema<Creature>(
  {
    name: { type: String, required: true, min: 3, max: 255 },
    translation: { type: String, required: true, min: 3, max: 255 },
    description: { type: String, required: true, min: 6, max: 300 },
    powerLevel: { type: Number, required: true, min: 1, max: 100 },
    strengths: { type: String, required: true, min: 3, max: 255 },
    weaknesses: { type: String, required: true, min: 3, max: 255 },
    funFact: { type: String, required: true, min: 6, max: 255 },
    imageURL: { type: String, required: true },
    _createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const CreatureModel = model<Creature>("Creature", creatureSchema);
