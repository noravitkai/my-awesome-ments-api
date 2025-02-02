import { Router, Request, Response } from "express";

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
  // connect
  res.status(200).send("Welcome to my awesome MENTS API.");
  // disconnect
});

export default router;
