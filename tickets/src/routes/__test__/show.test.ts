import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

const endpoint = "/api/tickets/:id";
const endpointSave = "/api/tickets";

it("returns a 404 if the ticket is not found", async () => {
  const cookie = await getCookie();
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .get(endpoint.replace(":id", id))
    .set("Cookie", cookie)
    .send()
    .expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const cookie = await getCookie();
  const title = "Tiket Konser Blackping + Dicium LISA";
  const price = 20;

  const response = await request(app)
    .post(endpointSave)
    .set("Cookie", cookie)
    .send({
      title: title,
      price: price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(endpoint.replace(":id", response.body.id))
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
