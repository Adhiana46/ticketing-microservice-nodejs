import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";
declare global {
  var getCookie: (id?: string) => Promise<string[]>;
}

jest.mock("../nats-wrapper");

let mongo: MongoMemoryServer;

beforeAll(async () => {
  process.env.JWT_KEY = "secret";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  mongoose.set("strictQuery", false); // prepare for mongoose v7
  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.getCookie = async (id?: string) => {
  // Build a JWT payload. { id, email }
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test@test.com",
  };

  // Create a JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build a session object, {jwt: eydsakdljaiorer }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return a string that contain a cookie
  return [`session=${base64}`];
};
