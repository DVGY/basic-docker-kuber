import request from "supertest";
import { app } from "../../app";

it("should send 200 for successfull SIGNOUT and set-cookie value to loggedOut, route /api/users/signin", async function () {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  const response = await request(app)
    .get("/api/users/signout")

    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
  expect(response.get("Set-Cookie")).toEqual(["jwt=loggedOut; Path=/"]);
});
