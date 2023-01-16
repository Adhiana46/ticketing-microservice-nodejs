import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../model";

const endpoint = "/api/tickets";

it("has route handler for POST /api/tickets", async () => {
  const response = await request(app).post(endpoint).send({});

  expect(response.status).not.toEqual(404);
});

it("can only be accessed if user is sign in", async () => {
  await request(app).post(endpoint).send({}).expect(401);
});

it("return a status code other than 401 if user is sign in", async () => {
  const cookie = await getCookie();
  const response = await request(app)
    .post(endpoint)
    .set("Cookie", cookie)
    .send({});

  expect(response.status).not.toEqual(401);
});

it("return an error if an invalid title is provided", async () => {
  const cookie = await getCookie();
  await request(app)
    .post(endpoint)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post(endpoint)
    .set("Cookie", cookie)
    .send({
      price: 10,
    })
    .expect(400);
});

it("return an error if an invalid price is provided", async () => {
  const cookie = await getCookie();
  await request(app)
    .post(endpoint)
    .set("Cookie", cookie)
    .send({
      title: "Tiket Konser Blackping + Dicium LISA",
      price: "invalid-price-should-number",
    })
    .expect(400);

  await request(app)
    .post(endpoint)
    .set("Cookie", cookie)
    .send({
      title: "Tiket Konser Blackping + Dicium LISA",
    })
    .expect(400);
});

it("create a ticket with valid inputs", async () => {
  const cookie = await getCookie();

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);

  const title = "Tiket Konser Blackping + Dicium LISA";
  const price = 20;

  await request(app)
    .post(endpoint)
    .set("Cookie", cookie)
    .send({
      title: title,
      price: price,
    })
    .expect(201);

  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);
  expect(tickets[0].price).toEqual(price);
});
