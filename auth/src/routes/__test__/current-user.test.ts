import request from "supertest";
import { app } from "../../app";

const endpoint = "/api/users/currentuser";
const endpointSignup = "/api/users/signup";

it("respond detail of current user", async () => {
  const signupResponse = await request(app)
    .post(endpointSignup)
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
  const cookie = signupResponse.get("Set-Cookie");

  const response = await request(app)
    .get(endpoint)
    .set("Cookie", cookie)
    .send({})
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});
