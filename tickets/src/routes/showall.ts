import express, { Request, Response } from "express";
import { Ticket } from "../model";

const router = express.Router();

router.get("/api/tickets", async (req: Request, res: Response) => {
  let tickets = await Ticket.find({});

  res.send(tickets);
});

export default router;
