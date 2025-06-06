import { Router, Request, Response, NextFunction } from "express";
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
import cloudinary from "./config/cloudinaryConfig";
import { startCron } from "./controllers/devToolsController";
import {
  createQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
} from "./controllers/quizController";

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
  res.status(200).send("Welcome to a Hungarian Mythical Creatures API!");
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
 *     description: Uploads an image file to Cloudinary and returns its URL.
 *     security:
 *       - ApiKeyAuth: []
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
  verifyToken,
  (req: Request, res: Response, next: NextFunction): void => {
    if (!req.files || !req.files.image) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }
    const image = req.files.image as UploadedFile;

    const streamUpload = (): Promise<string> => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "mythical_creatures" },
          (error, uploadResult) => {
            if (error) {
              return reject(error);
            }
            if (uploadResult && uploadResult.secure_url) {
              return resolve(uploadResult.secure_url);
            }
            reject(new Error("Upload failed without error"));
          }
        );
        stream.end(image.data);
      });
    };

    streamUpload()
      .then((secure_url) => {
        res.json({ message: "File upload successful", imageUrl: secure_url });
      })
      .catch((err) => {
        console.error("Cloudinary Upload Error:", err);
        res.status(500).json({ error: "File upload failed" });
      });
  }
);

/**
 * @swagger
 * /questions:
 *   post:
 *     tags:
 *       - Quiz Routes
 *     summary: Add a new question
 *     description: Adds a new quiz question with options.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Question"
 *     responses:
 *       201:
 *         description: Question created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Question"
 */
router.post("/questions", verifyToken, createQuestion);

/**
 * @swagger
 * /questions:
 *   get:
 *     tags:
 *       - Quiz Routes
 *     summary: Get all quiz questions
 *     description: Retrieves all quiz questions with their options.
 *     responses:
 *       200:
 *         description: A list of quiz questions.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Question"
 */
router.get("/questions", getAllQuestions);

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     tags:
 *       - Quiz Routes
 *     summary: Get a question by ID
 *     description: Retrieves a single quiz question by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the question.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Question found.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Question"
 */
router.get("/questions/:id", getQuestionById);

/**
 * @swagger
 * /questions/{id}:
 *   put:
 *     tags:
 *       - Quiz Routes
 *     summary: Update a quiz question
 *     description: Updates an existing question by its ID.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the question.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/Question"
 *     responses:
 *       200:
 *         description: Question updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Question"
 */
router.put("/questions/:id", verifyToken, updateQuestionById);

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     tags:
 *       - Quiz Routes
 *     summary: Delete a question
 *     description: Deletes a specific quiz question by its ID.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the question.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz question deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 deletedQuestion:
 *                   $ref: "#/components/schemas/Question"
 */
router.delete("/questions/:id", verifyToken, deleteQuestionById);

/**
 * @swagger
 * /start-cron:
 *   get:
 *     tags:
 *       - Dev Tools
 *     summary: Start a cron job to keep Render alive
 *     description: Pings the server every 5 minutes for 2 hours to prevent sleeping.
 *     responses:
 *       200:
 *         description: Cron job started successfully.
 */
router.get("/start-cron", startCron);

export default router;
