import { Request, Response } from "express";
import { CreatureModel } from "../models/creatureModel";

/**
 * Creates a new mythical creature in the database based on the request body
 * @param req
 * @param res
 */
export async function createCreature(
  req: Request,
  res: Response
): Promise<void> {
  const {
    name,
    translation,
    description,
    powerLevel,
    strengths,
    weaknesses,
    funFact,
  } = req.body;
  const { imageURL } = req.body;
  const _createdBy: string = req.body._createdBy;

  if (
    !name ||
    !translation ||
    !description ||
    !powerLevel ||
    !strengths ||
    !weaknesses ||
    !funFact ||
    !imageURL ||
    !_createdBy
  ) {
    res.status(400).json({ error: "Missing required fields." });
    return;
  }

  try {
    // Prevent duplicate creature names
    const existingCreature = await CreatureModel.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (existingCreature) {
      res
        .status(400)
        .json({ error: "A creature with this name already exists." });
      return;
    }

    // Create new creature object
    const creatureData = {
      name,
      translation,
      description,
      powerLevel,
      strengths,
      weaknesses,
      funFact,
      imageURL,
      _createdBy,
    };

    const creature = new CreatureModel(creatureData);
    const result = await creature.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating creature: " + error });
  }
}

/**
 * Retrieves all mythical creatures from the database.
 * @param req
 * @param res
 */
export async function getAllCreatures(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const creatures = await CreatureModel.find({}).populate(
      "_createdBy",
      "username email"
    );
    res.status(200).json(creatures);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving creatures: " + error });
  }
}

/**
 * Retrieves a mythical creature by its ID from the database.
 * @param req
 * @param res
 */
export async function getCreatureById(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const id = req.params.id;
    const creature = await CreatureModel.findById(id).populate(
      "_createdBy",
      "username email"
    );

    if (!creature) {
      res.status(404).json({ error: "Creature not found." });
      return;
    }

    res.status(200).json(creature);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving creature: " + error });
  }
}

/**
 * Updates a mythical creature by its ID in the database.
 * @param req
 * @param res
 */
export async function updateCreatureById(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;
  const updateData = req.body;

  try {
    // Check existence and authorization
    const existing = await CreatureModel.findById(id).lean();
    if (!existing) {
      res.status(404).json({ error: "Cannot update creature. Not found." });
      return;
    }
    if (existing._createdBy.toString() !== req.body._createdBy) {
      res.status(403).json({ error: "Access denied." });
      return;
    }

    const updatedCreature = await CreatureModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedCreature) {
      res
        .status(404)
        .json({ error: `Cannot update creature with id=${id}. Not found.` });
      return;
    }

    res.status(200).json({
      message: "Creature was successfully updated.",
      updatedCreature,
    });
  } catch (error) {
    res.status(500).json({ error: "Error updating creature: " + error });
  }
}

/**
 * Deletes a mythical creature by its ID from the database.
 * @param req
 * @param res
 */
export async function deleteCreatureById(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;

  try {
    // Check existence and authorization
    const existing = await CreatureModel.findById(id).lean();
    if (!existing) {
      res
        .status(404)
        .json({ error: `Cannot delete creature with id=${id}. Not found.` });
      return;
    }
    if (existing._createdBy.toString() !== req.body._createdBy) {
      res.status(403).json({ error: "Access denied." });
      return;
    }

    const deletedCreature = await CreatureModel.findByIdAndDelete(id);

    if (!deletedCreature) {
      res
        .status(404)
        .json({ error: `Cannot delete creature with id=${id}. Not found.` });
      return;
    }

    res.status(200).json({
      message: "Creature was successfully deleted.",
      deletedCreature,
    });
  } catch (error) {
    res.status(500).json({ error: "Error deleting creature: " + error });
  }
}
