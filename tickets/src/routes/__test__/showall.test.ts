import request from "supertest";
import { app } from "../../app";
import crypto from "crypto";

const endpoint = "/api/tickets";

const createRandomTicket = (cookie: string[]) => {
  return request(app)
    .post(endpoint)
    .set("Cookie", cookie)
    .send({
      title: crypto.randomBytes(28).toString("hex"),
      price: Math.round(Math.random() * 100),
    });
};

it("can fetch a list of tickets", async () => {
  const cookie = await getCookie();
  const n = 10;

  // create 10 random tickets
  for (let i = 0; i < n; i++) {
    await createRandomTicket(cookie);
  }

  const response = await request(app).get(endpoint).send({}).expect(200);
  expect(response.body.length).toEqual(n);
});
