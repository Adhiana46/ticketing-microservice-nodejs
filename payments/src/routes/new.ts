import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuth,
  validateRequest,
  BadRequestError,
  NotFoundError,
  NotAuthorizeError,
  OrderStatus,
} from "@adhiana-ticketing/common";
import { Order } from "../models/order";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { token, orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizeError();
    }

    const canceledStatus = [
      OrderStatus.CanceledAlreadyReserved,
      OrderStatus.CancelledExpires,
      OrderStatus.CancelledUser,
    ];
    if (canceledStatus.indexOf(order.status) !== -1) {
      throw new BadRequestError("Cannot pay for an cancelled order");
    }

    res.send({ success: true });
  }
);

export default router;
