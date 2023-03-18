import mongoose from "mongoose";
import { Order, OrderStatus } from "../order";
import { Ticket } from "../ticket";

it("implement optimistic concurrency control", async () => {
  // Create Ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Konser Blackpink",
    price: 50,
  });
  await ticket.save();

  // create order
  const order = Order.build({
    userId: "123",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();

  // fetch order twice
  const firstInstance = await Order.findById(order.id);
  const secondInstance = await Order.findById(order.id);

  // make changes to order we fetched
  firstInstance!.set({ status: OrderStatus.AwaitingPayment });
  secondInstance!.set({ status: OrderStatus.Complete });

  // save first instance
  await firstInstance!.save();

  // save second instance, expected to throw an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("should not react this line");
});

it("increment the version number on multiple saves", async () => {
  // Create Ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Konser Blackpink",
    price: 50,
  });
  await ticket.save();

  // create order
  const order = Order.build({
    userId: "123",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket,
  });
  await order.save();

  expect(order.version).toEqual(0);

  // first saves
  order.set({ status: OrderStatus.AwaitingPayment });
  await order.save();

  expect(order.version).toEqual(1);

  // second saves
  order.set({ status: OrderStatus.Complete });
  await order.save();

  expect(order.version).toEqual(2);
});
