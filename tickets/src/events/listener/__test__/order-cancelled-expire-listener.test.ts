import mongoose from "mongoose";
import { Ticket } from "../../../model";
import { natsWrapper } from "../../../nats-wrapper";
import { OrderCancelledExpireListener } from "../order-cancelled-expire-listener";
import { OrderCancelledExpireEvent } from "@adhiana-ticketing/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create instance of the listener
  const listener = new OrderCancelledExpireListener(natsWrapper.client);

  const orderId = new mongoose.Types.ObjectId().toHexString();

  // create and save a ticket
  const ticket = Ticket.build({
    title: "Konser LISA Blackpink",
    price: 25,
    userId: "random-id",
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledExpireEvent["data"] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, orderId, data, msg };
};

it("sets the orderId to null", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  // expect msg.ack() to have been called
  expect(msg.ack).toHaveBeenCalled();
});

it("publishes a ticket updated event", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(ticketUpdatedData.orderId).not.toBeDefined();
});
