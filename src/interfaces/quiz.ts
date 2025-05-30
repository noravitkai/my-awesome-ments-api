export interface Choice {
  text: string;
  creatureIds: string[];
}

export interface Question extends Document {
  _id: string;
  text: string;
  options: Choice[];
  _createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
