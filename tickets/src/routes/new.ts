import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  currentUser,
  requireAuth,
  validateRequest,
} from "@adhiana-ticketing/common";
import { Ticket } from "../model";

const router = express.Router();

router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").trim().notEmpty().withMessage("Title must provided"),
    body("price")
      .trim()
      .isFloat({ gt: 0 })
      .notEmpty()
      .withMessage("Price must be greater than 0"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;

    // store to db
    const ticket = Ticket.build({
      title: title,
      price: price,
      userId: req.currentUser!.id,
    });
    await ticket.save();

    res.status(201).send(ticket);
  }
);

export default router;
