import express, { Request, Response } from "express";
const router = express.Router();

router.get("/api/orders/:id", async (req: Request, res: Response) => {
  res.send({ msg: "GET /api/orders/:id" });
});

export default router;
