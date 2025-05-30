import { Request, Response } from "express";
import { connect, disconnect } from "../repository/database";
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
  const { text, options, _createdBy } = req.body;

  try {
    await connect();

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
  } finally {
    await disconnect();
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
    await connect();
    const questions = await QuestionModel.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving questions: " + error });
  } finally {
    await disconnect();
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
    await connect();
    const question = await QuestionModel.findById(id);
    if (!question) {
      res.status(404).json({ error: "Quiz question not found." });
      return;
    }
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving question: " + error });
  } finally {
    await disconnect();
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
    await connect();
    const updated = await QuestionModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated) {
      res.status(404).json({ error: "Cannot update question. Not found." });
      return;
    }
    res
      .status(200)
      .json({ message: "Question updated successfully.", updated });
  } catch (error) {
    res.status(500).json({ error: "Error updating quiz question: " + error });
  } finally {
    await disconnect();
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
    await connect();
    const deleted = await QuestionModel.findByIdAndDelete(id);
    if (!deleted) {
      res
        .status(404)
        .json({ error: "Cannot delete quiz question. Not found." });
      return;
    }
    res
      .status(200)
      .json({ message: "Quiz question deleted successfully.", deleted });
  } catch (error) {
    res.status(500).json({ error: "Error deleting question: " + error });
  } finally {
    await disconnect();
  }
}
