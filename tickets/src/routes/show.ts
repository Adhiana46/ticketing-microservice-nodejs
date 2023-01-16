import express, { Request, Response } from "express";
import { NotFoundError } from "@adhiana-ticketing/common";
import { Ticket } from "../model";

const router = express.Router();

router.get(
  "/api/tickets/:id",

  async (req: Request, res: Response) => {
    let ticket = null;

    try {
      ticket = await Ticket.findById(req.params.id);
    } catch (err) {
      throw new NotFoundError();
    }

    if (!ticket) {
      throw new NotFoundError();
    }

    res.send(ticket);
  }
);

export default router;
