import request from "supertest";
import { app } from "../../app";

const endpoint = "/api/users/signout";
const endpointSignup = "/api/users/signup";

it("clear the cookie after signout", async () => {
  await request(app)
    .post(endpointSignup)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app).post(endpoint).send({}).expect(200);

  expect(response.get("Set-Cookie")[0]).toEqual(
    "session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly"
  );
});
