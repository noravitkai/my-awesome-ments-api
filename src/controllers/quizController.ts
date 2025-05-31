import { Request, Response } from "express";
import { QuestionModel } from "../models/quizModel";

/**
 * Creates new quiz question.
 * @param req
 * @param res
 */
export async function createQuestion(
  req: Request,
  res: Response
): Promise<void> {
  const { text, options } = req.body;
  const _createdBy: string = req.body._createdBy;

  try {
    // Validate required fields
    if (!text || !Array.isArray(options) || options.length < 2 || !_createdBy) {
      res.status(400).json({
        error: "Missing required fields: text, options (>=2), _createdBy.",
      });
      return;
    }

    const question = new QuestionModel({ text, options, _createdBy });
    const saved = await question.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(500).json({ error: "Error creating question: " + error });
  }
}

/**
 * Retrieves all questions for the quiz.
 * @param req
 * @param res
 */
export async function getAllQuestions(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const questions = await QuestionModel.find().populate(
      "_createdBy",
      "username email"
    );
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving questions: " + error });
  }
}

/**
 * Retrieves a quiz question by ID.
 * @param req
 * @param res
 */
export async function getQuestionById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  try {
    const question = await QuestionModel.findById(id).populate(
      "_createdBy",
      "username email"
    );
    if (!question) {
      res.status(404).json({ error: "Quiz question not found." });
      return;
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving question: " + error });
  }
}

/**
 * Updates a question by ID.
 * @param req
 * @param res
 */
export async function updateQuestionById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const existing = await QuestionModel.findById(id).lean();
    if (!existing) {
      res.status(404).json({ error: "Cannot update question. Not found." });
      return;
    }
    if (existing._createdBy !== req.body._createdBy) {
      res.status(403).json({ error: "Access denied." });
      return;
    }
    const updated = await QuestionModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    res
      .status(200)
      .json({ message: "Question updated successfully.", updated });
  } catch (error) {
    res.status(500).json({ error: "Error updating quiz question: " + error });
  }
}

/**
 * Deletes a question by ID.
 * @param req
 * @param res
 */
export async function deleteQuestionById(
  req: Request,
  res: Response
): Promise<void> {
  const { id } = req.params;

  try {
    const existing = await QuestionModel.findById(id).lean();
    if (!existing) {
      res
        .status(404)
        .json({ error: "Cannot delete quiz question. Not found." });
      return;
    }
    if (existing._createdBy !== req.body._createdBy) {
      res.status(403).json({ error: "Access denied." });
      return;
    }
    const deleted = await QuestionModel.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Quiz question deleted successfully.", deleted });
  } catch (error) {
    res.status(500).json({ error: "Error deleting question: " + error });
  }
}
