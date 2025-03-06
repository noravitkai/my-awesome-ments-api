import { Router, Request, Response, NextFunction } from "express";
import path from "path";
import fileUpload, { UploadedFile } from "express-fileupload";
import {
  createCreature,
  getAllCreatures,
  getCreatureById,
  updateCreatureById,
  deleteCreatureById,
} from "./controllers/creatureController";
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

// Upload route for images
router.post(
  "/upload",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.files || !req.files.image) {
        res.status(400).json({ error: "No file uploaded" });
        return;
      }
      const image = req.files.image as UploadedFile;
      const uploadPath = path.join(__dirname, "../uploads", image.name);

      await image.mv(uploadPath);

      const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
        image.name
      }`;
      res.json({ message: "Upload successful", imageUrl: fileUrl });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

export default router;
