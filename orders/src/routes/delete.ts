import express, { Request, Response } from "express";
import { Order } from "../models";
import {
  NotAuthorizeError,
  NotFoundError,
  OrderStatus,
} from "@adhiana-ticketing/common";
import { OrderCancelledUserPublisher } from "../events/publishers/order-cancelled-user-publisher";
import { natsWrapper } from "../nats-wrapper";
const router = express.Router();

router.delete("/api/orders/:id", async (req: Request, res: Response) => {
  let order = await Order.findById(req.params.id).populate("ticket");

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId != req.currentUser!.id) {
    throw new NotAuthorizeError();
  }

  order.status = OrderStatus.CancelledUser;
  order.save();

  // publish an event saying that order was cancelled by user
  await new OrderCancelledUserPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: {
      id: order.ticket.id,
    },
  });

  res.send(order);
});

export default router;
