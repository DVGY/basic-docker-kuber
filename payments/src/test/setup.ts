import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  namespace NodeJS {
    interface Global {
      getCookieJWT(userId?: string): string;
    }
  }
}

let mongo: any;

jest.mock('../NATSWrapper');
process.env.STRIPE_SECRET_KEY =
  'sk_test_51IhbXISG1qmm1Y3dSZRTjLWplXjfxB1rzDZmxdjWY0HJtAvMNw7dQ487veTmdLnvNLfnqmV11xdhUBxZfINybtUz00yJXWXBCK';
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
  jest.clearAllMocks();
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

global.getCookieJWT = (userId) => {
  // Build JWT Payload {id}
  const payload = {
    id: userId || new mongoose.mongo.ObjectId(),
  };
  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!);

  // Create a siugned cookie, https only and secure true type cookie (need to find how to implement this)

  // parse the cookie (need to find how to implement this)

  // Since the above two step at the end gives a token. We directly sent a token
  return `jwt=${token}`;
};
