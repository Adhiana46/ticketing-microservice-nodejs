import express, { Request, Response } from "express";
import { Order } from "../models";
import {
  NotAuthorizeError,
  NotFoundError,
  requireAuth,
} from "@adhiana-ticketing/common";
const router = express.Router();

router.get(
  "/api/orders/:id",
  requireAuth,
  async (req: Request, res: Response) => {
    let order = await Order.findById(req.params.id).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId != req.currentUser!.id) {
      throw new NotAuthorizeError();
    }

    res.send(order);
  }
);

export default router;
