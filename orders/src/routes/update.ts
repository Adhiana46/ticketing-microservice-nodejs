import express, { Request, Response } from "express";
const router = express.Router();

router.put("/api/orders/:id", async (req: Request, res: Response) => {
  res.send({ msg: "PUT /api/orders/:id" });
});

export default router;
