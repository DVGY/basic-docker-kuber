import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";

declare global {
  namespace NodeJS {
    interface Global {
      getCookieJWT(): Promise<string>;
    }
  }
}

let mongo: any;

beforeAll(async function () {
  jest.setTimeout(30000);
  process.env.JWT_SECRET_KEY = "assss";
  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async function () {
  const collections = await mongoose.connection.collections;
  //   console.log(db);
  for (let collection in collections) {
    await collections[collection].deleteMany({});
  }
});

afterAll(async function () {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getCookieJWT = async () => {
  const email = "test@test.com";
  const password = "password";

  const response = await request(app)
    .post("/api/users/signup")
    .send({ email, password })
    .expect(201);

  const cookie = response.get("set-cookie");

  return cookie;
};
