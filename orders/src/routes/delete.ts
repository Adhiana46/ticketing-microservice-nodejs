import express, { Request, Response } from "express";
const router = express.Router();

router.delete("/api/orders/:id", async (req: Request, res: Response) => {
  res.send({ msg: "DELETE /api/orders/:id" });
});

export default router;
