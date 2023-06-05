import request from "supertest";
import { app } from "../../app";

const endpoint = "/api/users/currentuser";

it("respond detail of current user", async () => {
  const cookie = await getCookie();

  const response = await request(app)
    .get(endpoint)
    .set("Cookie", cookie)
    .send({})
    .expect(400);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("response null if not authenticated", async () => {
  const response = await request(app).get(endpoint).send({}).expect(200);

  expect(response.body.currentUser).toBeNull();
});
