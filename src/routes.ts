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

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - App Routes
 *     summary: Health check
 *     description: Basic route to check if the API is up and running.
 *     responses:
 *       200:
 *         description: Server up and running.
 */
router.get("/", (req: Request, res: Response) => {
  res.status(200).send("Welcome to my awesome MENTS API!");
});

/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Register a new user
 *     description: Takes user data in the body and registers a new user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/User"
 *     responses:
 *       200:
 *         description: Registration successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 data:
 *                   type: string
 */
router.post("/user/register", registerUser);

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Log in an existing user
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                     token:
 *                       type: string
 */
router.post("/user/login", loginUser);

/**
 * @swagger
 * /creatures:
 *   post:
 *     tags:
 *       - Creature Routes
 *     summary: Add a new creature
 *     description: Creates a creature in the database.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Creature"
 *     responses:
 *       201:
 *         description: Creation successful.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Creature"
 */
router.post("/creatures", verifyToken, createCreature);

/**
 * @swagger
 * /creatures:
 *   get:
 *     tags:
 *       - Creature Routes
 *     summary: Get all creatures
 *     description: Retrieves the list of all creatures in the database.
 *     responses:
 *       200:
 *         description: A list of creatures.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Creature"
 */
router.get("/creatures", getAllCreatures);

/**
 * @swagger
 * /creatures/{id}:
 *   get:
 *     tags:
 *       - Creature Routes
 *     summary: Get a creature by ID
 *     description: Retrieves a single creature by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The creature ID.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Creature found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Creature"
 */
router.get("/creatures/:id", getCreatureById);

/**
 * @swagger
 * /creatures/{id}:
 *   put:
 *     tags:
 *       - Creature Routes
 *     summary: Update a creature
 *     description: Updates an existing creature by its ID.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the creature to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Creature"
 *     responses:
 *       200:
 *         description: Creature updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Creature"
 */
router.put("/creatures/:id", verifyToken, updateCreatureById);

/**
 * @swagger
 * /creatures/{id}:
 *   delete:
 *     tags:
 *       - Creature Routes
 *     summary: Delete a creature
 *     description: Deletes a specific creature by its ID.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the creature to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Creature deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedCreature:
 *                   $ref: "#/components/schemas/Creature"
 */
router.delete("/creatures/:id", verifyToken, deleteCreatureById);

/**
 * @swagger
 * /upload:
 *   post:
 *     tags:
 *       - Upload Routes
 *     summary: Upload an image
 *     description: Uploads an image file and returns its URL.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: File upload successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 */
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

      const baseUrl =
        process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
      const fileUrl = `${baseUrl}/uploads/${image.name}`;
      res.json({ message: "Upload successful", imageUrl: fileUrl });
    } catch (err) {
      console.error(err);
      next(err);
    }
  }
);

export default router;
