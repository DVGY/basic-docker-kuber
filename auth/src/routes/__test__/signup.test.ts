import request from "supertest";
import { app } from "../../app";

it("should send 201, route /api/users/signup", async function () {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);
});

it("should send 201 with cookie and token included, route /api/users/signup", async function () {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  // expect(response.get("SET-COOKIE")).toBeDefined();
  expect(response.get("set-cookie")).toBeDefined();
});

it("should send 400 on duplicate email, route /api/users/signup", async function () {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(201);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "password",
    })
    .expect(400);
});

it("should send 400 invalid input, route /api/users/signup", async function () {
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "password",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
    })
    .expect(400);

  await request(app).post("/api/users/signup").send({}).expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
      password: "password",
    })
    .expect(400);

  return request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "passwor",
    })
    .expect(400);
});
