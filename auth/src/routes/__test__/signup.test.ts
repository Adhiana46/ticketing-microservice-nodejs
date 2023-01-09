import request from "supertest";
import { app } from "../../app";

const endpoint = "/api/users/signup";

it("return 201 ketika berhasil signup", async () => {
  return request(app)
    .post(endpoint)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("return 400 jika email invalid", async () => {
  return request(app)
    .post(endpoint)
    .send({
      email: "invalid-email",
      password: "password",
    })
    .expect(400);
});

it("return 400 jika password invalid", async () => {
  return request(app)
    .post(endpoint)
    .send({
      email: "test@test.com",
      password: "abc",
    })
    .expect(400);
});

it("return 400 jika email dan password kosong", async () => {
  await request(app)
    .post(endpoint)
    .send({ email: "test@test.com" })
    .expect(400);
  await request(app).post(endpoint).send({ password: "password" }).expect(400);
});

it("return 400 jika email sudah digunakan", async () => {
  await request(app)
    .post(endpoint)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  await request(app)
    .post(endpoint)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("set a cookie after successful signup", async () => {
  const response = await request(app)
    .post(endpoint)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});
