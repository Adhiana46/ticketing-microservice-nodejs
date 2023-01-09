import request from "supertest";
import { app } from "../../app";

const endpoint = "/api/users/signin";
const endpointSignup = "/api/users/signup";

it("fails when email does not exists", async () => {
  await request(app)
    .post(endpoint)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("fails when password is incorrect", async () => {
  await request(app)
    .post(endpointSignup)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post(endpoint)
    .send({
      email: "test@test.com",
      password: "incorrect",
    })
    .expect(400);
});

it("set a cookie after successful signin", async () => {
  await request(app)
    .post(endpointSignup)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .post(endpoint)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});
