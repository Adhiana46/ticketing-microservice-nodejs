import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  currentUser,
  requireAuth,
  validateRequest,
} from "@adhiana-ticketing/common";
import { Ticket } from "../model";
import { TicketCreatedPublisher } from "../events/publisher/ticket-created-publisher";
import { natsWrapper } from "../nats-wrapper";

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

    // publish event
    await new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(201).send(ticket);
  }
);

export default router;
