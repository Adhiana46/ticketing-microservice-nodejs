import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../nats-wrapper";

const endpoint = "/api/tickets/:id";
const endpointSave = "/api/tickets";

it("returns a 404 if provided id does not exists", async () => {
  const cookie = await getCookie();
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(endpoint.replace(":id", id))
    .set("Cookie", cookie)
    .send({
      title: "Valid title",
      price: 10,
    })
    .expect(404);
});

it("returns a 401 if user not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(endpoint.replace(":id", id))
    .send({
      title: "Valid title",
      price: 10,
    })
    .expect(401);
});

it("returns a 401 if user does not own the ticket", async () => {
  const cookie = await getCookie();

  const response = await request(app)
    .post(endpointSave)
    .set("Cookie", cookie)
    .send({
      title: "Valid title create",
      price: 20,
    })
    .expect(201);

  await request(app)
    .put(endpoint.replace(":id", response.body.id))
    .set("Cookie", await getCookie()) // login as different user id
    .send({
      title: "Valid title edited",
      price: 10,
    })
    .expect(401);
});

it("returns a 400 if user provide invalid title or price", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const cookie = await getCookie();

  // invalid title
  await request(app)
    .put(endpoint.replace(":id", id))
    .set("Cookie", cookie)
    .send({
      price: 20,
    })
    .expect(400);

  // invalid price
  await request(app)
    .put(endpoint.replace(":id", id))
    .set("Cookie", cookie)
    .send({
      title: "Ini title",
    })
    .expect(400);
});

it("update the ticket if valid inputs provided", async () => {
  const cookie = await getCookie();

  const response = await request(app)
    .post(endpointSave)
    .set("Cookie", cookie)
    .send({
      title: "Valid title create",
      price: 20,
    })
    .expect(201);

  const updatedTitle = "Updated Title";
  const updatedPrice = 23232;

  await request(app)
    .put(endpoint.replace(":id", response.body.id))
    .set("Cookie", cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(endpoint.replace(":id", response.body.id))
    .set("Cookie", cookie)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(updatedTitle);
  expect(ticketResponse.body.price).toEqual(updatedPrice);
});

it("publish an event", async () => {
  const cookie = await getCookie();

  const response = await request(app)
    .post(endpointSave)
    .set("Cookie", cookie)
    .send({
      title: "Valid title create",
      price: 20,
    })
    .expect(201);

  const updatedTitle = "Updated Title";
  const updatedPrice = 23232;

  await request(app)
    .put(endpoint.replace(":id", response.body.id))
    .set("Cookie", cookie)
    .send({
      title: updatedTitle,
      price: updatedPrice,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
