const { test, describe, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const User = require("../model/user");
const helper = require("./test_helper");

const api = supertest(app);

describe("Initialize user test", async () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await User.insertMany(helper.initialTestUser);
  });

  describe("Invalid User not created", async () => {
    test("Fails with 400 when duplicate username", async () => {
      const userAtStart = await helper.usersInDb();
      const newUser = {
        username: "AlanWalker",
        name: "Alan Walker",
        password: "123456",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const userAtEnd = await helper.usersInDb();
      assert.strictEqual(userAtEnd.length, userAtStart.length);
    });

    test("Fails with 400 when username is too short", async () => {
      const userAtStart = await helper.usersInDb();
      const newUser = {
        username: "Al",
        name: "Alan Walker",
        password: "12345566",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const userAtEnd = await helper.usersInDb();
      assert.strictEqual(userAtEnd.length, userAtStart.length);
    });

    test("Fails with 400 when password is too short", async () => {
      const userAtStart = await helper.usersInDb();
      const newUser = {
        username: "Alan",
        name: "Alan Walker",
        password: "12",
      };

      await api
        .post("/api/users")
        .send(newUser)
        .expect(400)
        .expect("Content-Type", /application\/json/);

      const userAtEnd = await helper.usersInDb();
      assert.strictEqual(userAtEnd.length, userAtStart.length);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
