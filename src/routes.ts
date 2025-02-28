import { Router, Request, Response } from "express";
import {
  createCreature,
  getAllCreatures,
  getCreatureById,
  updateCreatureById,
  deleteCreatureById,
} from "./controllers/creatureController";
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
} from "./controllers/categoryController";
import {
  registerUser,
  loginUser,
  verifyToken,
} from "./controllers/authController";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to my awesome MENTS API!");
});

// Auth routes for user registration and login
router.post("/user/register", registerUser);
router.post("/user/login", loginUser);

// CRUD routes for creatures
router.post("/creatures", verifyToken, createCreature);
router.get("/creatures", getAllCreatures);
router.get("/creatures/:id", getCreatureById);
router.put("/creatures/:id", verifyToken, updateCreatureById);
router.delete("/creatures/:id", verifyToken, deleteCreatureById);

// CRUD routes for categories
router.post("/categories", verifyToken, createCategory);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.put("/categories/:id", verifyToken, updateCategoryById);
router.delete("/categories/:id", verifyToken, deleteCategoryById);

export default router;
