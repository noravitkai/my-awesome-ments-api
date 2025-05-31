import { Schema, model } from "mongoose";
import { Question } from "../interfaces/quiz";

const choiceSchema = new Schema<Question["options"][0]>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    creatureIds: {
      type: [{ type: String, ref: "Creature", required: true }],
      validate: {
        validator: (arr: string[]) =>
          arr.length >= 1 && new Set(arr).size === arr.length,
        message:
          "Each option must map to at least one unique creature ID, with no duplicates",
      },
    },
  },
  { _id: false }
);

const questionSchema = new Schema<Question>(
  {
    text: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      maxlength: 200,
    },
    options: {
      type: [choiceSchema],
      validate: {
        validator: (arr: any[]) => arr.length >= 2,
        message: "At least two options are required",
      },
    },
    _createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export const QuestionModel = model<Question>("Question", questionSchema);
