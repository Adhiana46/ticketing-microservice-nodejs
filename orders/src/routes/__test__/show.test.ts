import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models";

const buildTicket = async () => {
  const ticket = Ticket.build({
    title: "Konser BlackPink",
    price: 30,
  });
  await ticket.save();

  return ticket;
};

it("return 401 unauthorized if user access orders that do not belong to user", async () => {
  const ticket1 = await buildTicket();
  const user1 = await getCookie();
  const user2 = await getCookie();

  // Create one order as User #1
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);

  await request(app)
    .get("/api/orders/" + order.id)
    .set("Cookie", user2)
    .send({})
    .expect(401);
});

it("fetches the order", async () => {
  const ticket1 = await buildTicket();
  const user1 = await getCookie();

  // Create one order as User #1
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user1)
    .send({
      ticketId: ticket1.id,
    })
    .expect(201);

  await request(app)
    .get("/api/orders/" + order.id)
    .set("Cookie", user1)
    .send({})
    .expect(200);
});
