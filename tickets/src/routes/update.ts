import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  NotAuthorizeError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@adhiana-ticketing/common";
import { Ticket } from "../model";
import { TicketUpdatedPublisher } from "../events/publisher/ticket-updated-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
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

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId != req.currentUser!.id) {
      throw new NotAuthorizeError();
    }

    // update
    ticket.title = title;
    ticket.price = price;
    await ticket.save();

    // publish event
    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    res.status(200).send(ticket);
  }
);

export default router;
