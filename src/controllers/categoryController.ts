import { Request, Response } from "express";
import { CategoryModel } from "../models/categoryModel";
import { connect, disconnect } from "../repository/database";

/**
 * Creates a new category in the database.
 * @param req
 * @param res
 */
export async function createCategory(
  req: Request,
  res: Response
): Promise<void> {
  const { name } = req.body;

  try {
    await connect();

    // Validate required field
    if (!name) {
      res.status(400).json({ error: "Category name is required." });
      return;
    }

    // Check if category already exists
    const existingCategory = await CategoryModel.findOne({
      name: new RegExp(`^${name}$`, "i"),
    });
    if (existingCategory) {
      res.status(400).json({ error: "Category already exists." });
      return;
    }

    // Create new category
    const category = new CategoryModel({ name });
    const result = await category.save();

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Error creating category: " + error });
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves all categories from the database.
 * @param req
 * @param res
 */
export async function getAllCategories(
  req: Request,
  res: Response
): Promise<void> {
  try {
    await connect();

    const categories = await CategoryModel.find({});

    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving categories: " + error });
  } finally {
    await disconnect();
  }
}

/**
 * Retrieves a category by its ID from the database.
 * @param req
 * @param res
 */
export async function getCategoryById(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;

  try {
    await connect();

    const category = await CategoryModel.findById(id);

    if (!category) {
      res.status(404).json({ error: `Category with id=${id} not found.` });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving category: " + error });
  } finally {
    await disconnect();
  }
}

/**
 * Updates a category by its ID in the database.
 * @param req
 * @param res
 */
export async function updateCategoryById(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;
  const { name } = req.body;

  try {
    await connect();

    // Validate required field
    if (!name) {
      res.status(400).json({ error: "Category name is required." });
      return;
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    );

    if (!updatedCategory) {
      res
        .status(404)
        .json({ error: `Cannot update category with id=${id}. Not found.` });
      return;
    }

    res
      .status(200)
      .json({ message: "Category successfully updated.", updatedCategory });
  } catch (error) {
    res.status(500).json({ error: "Error updating category: " + error });
  } finally {
    await disconnect();
  }
}

/**
 * Deletes a category by its ID from the database.
 * @param req
 * @param res
 */
export async function deleteCategoryById(
  req: Request,
  res: Response
): Promise<void> {
  const id = req.params.id;

  try {
    await connect();

    const deletedCategory = await CategoryModel.findByIdAndDelete(id);

    if (!deletedCategory) {
      res
        .status(404)
        .json({ error: `Cannot delete category with id=${id}. Not found.` });
      return;
    }

    res
      .status(200)
      .json({ message: "Category successfully deleted.", deletedCategory });
  } catch (error) {
    res.status(500).json({ error: "Error deleting category: " + error });
  } finally {
    await disconnect();
  }
}
