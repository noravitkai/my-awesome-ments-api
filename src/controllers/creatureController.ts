import { Request, Response } from "express";
import { CreatureModel } from "../models/creatureModel";
import { connect, disconnect } from "../repository/database";

/**
 * Creates a new mythical creature in the database based on the request body
 * @param req
 * @param res
 */
export async function createCreature(
  req: Request,
  res: Response
): Promise<void> {
  const data = req.body;

  try {
    await connect();

    // Validate required fields
    if (
      !data.name ||
      !data.translation ||
      !data.description ||
      !data.powerLevel ||
      !data.strengths ||
      !data.weaknesses ||
      !data.folkloreStory ||
      !data.imageURL ||
      !data.category ||
      !data._createdBy
    ) {
      res.status(400).json({ error: "Missing required fields." });
      return;
    }

    // Check if creature already exists
    const existingCreature = await CreatureModel.findOne({
      name: new RegExp(`^${data.name}$`, "i"),
    });
    if (existingCreature) {
      res
        .status(400)
        .json({ error: "A creature with this name already exists." });
      return;
    }

    // Create new creature
    const creature = new CreatureModel(data);
    const result = await creature.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating creature: " + error });
  } finally {
    await disconnect();
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
    await connect();

    const creatures = await CreatureModel.find({});

    res.status(200).json(creatures);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving creatures: " + error });
  } finally {
    await disconnect();
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
    await connect();

    const id = req.params.id;
    const creature = await CreatureModel.findById(id);

    if (!creature) {
      res.status(404).json({ error: "Creature not found." });
      return;
    }

    res.status(200).json(creature);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving creature: " + error });
  } finally {
    await disconnect();
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
    await connect();

    const updatedCreature = await CreatureModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedCreature) {
      res
        .status(404)
        .json({ error: `Cannot update creature with id=${id}. Not found.` });
    } else {
      res.status(200).json({
        message: "Creature was successfully updated.",
        updatedCreature,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating creature: " + error });
  } finally {
    await disconnect();
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
    await connect();

    const deletedCreature = await CreatureModel.findByIdAndDelete(id);

    if (!deletedCreature) {
      res
        .status(404)
        .json({ error: `Cannot delete creature with id=${id}. Not found.` });
    } else {
      res.status(200).json({
        message: "Creature was successfully deleted.",
        deletedCreature,
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error deleting creature: " + error });
  } finally {
    await disconnect();
  }
}
