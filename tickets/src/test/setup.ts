import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      getCookieJWT(): string;
    }
  }
}

let mongo: any;

beforeAll(async function () {
  jest.setTimeout(30000);
  process.env.JWT_SECRET_KEY = 'assss';

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

global.getCookieJWT = () => {
  // Build JWT Payload {id}
  const payload = {
    id: new mongoose.mongo.ObjectId(),
  };
  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);

  // Create a siugned cookie, https only and secure true type cookie (need to find how to implement this)

  // parse the cookie (need to find how to implement this)

  // Since the above two step at the end gives a token. We directly sent a token
  return `jwt=${token}`;
};
