import express, { Request, Response } from "express";
import { Order } from "../models";
import {
  NotAuthorizeError,
  NotFoundError,
  OrderStatus,
} from "@adhiana-ticketing/common";
const router = express.Router();

router.delete("/api/orders/:id", async (req: Request, res: Response) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    throw new NotFoundError();
  }

  if (order.userId != req.currentUser!.id) {
    throw new NotAuthorizeError();
  }

  order.status = OrderStatus.CancelledUser;
  order.save();

  res.send(order);
});

export default router;
