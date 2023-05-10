import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@adhiana-ticketing/common";
import { Ticket } from "../../../models";
import { natsWrapper } from "../../../nats-wrapper";
import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Konser Blackpink",
    price: 5,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent["data"] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: "Konser Blackpink LISA",
    price: 10,
    userId: "abcdefu",
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { listener, ticket, data, msg };
};

it("finds, updates, and saves a ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with data + message
  await listener.onMessage(data, msg);

  // write assertions to make sure ticket was created
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with data + message
  await listener.onMessage(data, msg);

  // write assertions to make sure ticket was created
  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket?.title).toEqual(data.title);
  expect(updatedTicket?.price).toEqual(data.price);
  expect(updatedTicket?.version).toEqual(data.version);

  // expect msg.ack() to have been called
  expect(msg.ack).toHaveBeenCalled();
});

it("does not acks the message if event is out-of-order (version)", async () => {
  const { listener, ticket, data, msg } = await setup();

  // increment the version to simulate out-of-order
  data.version += 1;

  // call the onMessage function with data + message
  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
