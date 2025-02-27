import { Router, Request, Response } from "express";
import {
  createCreature,
  getAllCreatures,
  getCreatureById,
  updateCreatureById,
  deleteCreatureById,
} from "./controllers/creatureController";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to my awesome MENTS API!");
});

// CRUD routes for creatures
router.post("/creatures", createCreature);
router.get("/creatures", getAllCreatures);
router.get("/creatures/:id", getCreatureById);
router.put("/creatures/:id", updateCreatureById);
router.delete("/creatures/:id", deleteCreatureById);

export default router;
