import { randomBytes } from "crypto";
import nats, { Message, Stan } from "node-nats-streaming";
import { TicketCreatedListener } from "./events/ticket-created-listener";
import { TicketUpdatedListener } from "./events/ticket-updated-listener";

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
  });

  const ticketCreatedListener = new TicketCreatedListener(stan);
  ticketCreatedListener.listen();

  const ticketUpdatedListener = new TicketUpdatedListener(stan);
  ticketUpdatedListener.listen();

  console.log("On connect done!");
});

process.on("SIGINT", () => stan.close());
process.on("SIGTERM", () => stan.close());
