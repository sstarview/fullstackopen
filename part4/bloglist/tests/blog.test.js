const { describe, test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../model/blog");
const helper = require("./test_helper");
const User = require("../model/user");

const api = supertest(app);
let token = null;
let testUserId = null;

describe("When there is initially some blog saved", async () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await User.deleteMany({});
    await api.post("/api/users").send(helper.initialTestUser[0]);

    const userInDb = await User.findOne({
      username: helper.initialTestUser[0].username,
    });
    testUserId = userInDb._id;

    const loginResponse = await api.post("/api/login").send({
      username: helper.initialTestUser[0].username,
      password: helper.initialTestUser[0].password,
    });
    token = loginResponse.body.token;

    const initialBlogsWithUser = helper.initialTestBlog.map((blog) => ({
      ...blog,
      user: testUserId,
    }));
    const savedBlogs = await Blog.insertMany(initialBlogsWithUser);
    userInDb.blogs = savedBlogs.map((b) => b._id);
    await userInDb.save();
  });

  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialTestBlog.length);
  });

  test("identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    assert("id" in response.body[0]);
  });

  describe("addition of a blog", async () => {
    test("created a new blog", async () => {
      const newBlog = {
        title: "She was there",
        author: "Kaka Molim",
        url: "https://kalamolim.com",
        likes: 88,
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await helper.blogsInDB();
      assert.strictEqual(response.length, helper.initialTestBlog.length + 1);
      const title = response.map((b) => b.title);
      assert(title.includes("She was there"));
    });

    test("likes field default to 0", async () => {
      const newBlog = {
        title: "She was there",
        author: "Kaka Molim",
        url: "https://kalamolim.com",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await helper.blogsInDB();
      const addedBlog = response.find((b) => b.title === newBlog.title);
      assert.strictEqual(addedBlog.likes, 0);
    });

    test("missing fields responds with 400", async () => {
      const newBlog = {
        author: "Kaka Molim",
      };

      await api
        .post("/api/blogs")
        .set("Authorization", `Bearer ${token}`)
        .send(newBlog)
        .expect(400);
    });

    test("401 status if token not provided", async () => {
      const newBlog = {
        title: "Hello there",
        author: "Rivaldo",
        url: "https://rovaldo.com",
        likes: 45,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(401)
        .expect("Content-Type", /application\/json/);
    });
  });

  describe("deleting a blog", async () => {
    test("successfully deleted blog", async () => {
      const blogAtStart = await helper.blogsInDB();
      const blogToDelete = blogAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set("Authorization", `Bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDB();

      const title = blogsAtEnd.map((b) => b.title);
      assert(!title.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, helper.initialTestBlog.length - 1);
    });
  });

  describe("Updating a blog", async () => {
    test("successfully updated a blog", async () => {
      const blogAtStart = await helper.blogsInDB();
      const blogToUpdate = blogAtStart[0];
      const newBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 90,
      };

      await api.put(`/api/blogs/${blogToUpdate.id}`).send(newBlog).expect(200);

      const blogWhenUpdated = await helper.blogsInDB();
      const updatedBlog = blogWhenUpdated.find((b) => b.id === blogToUpdate.id);

      assert.strictEqual(updatedBlog.likes, newBlog.likes);
    });
  });
});

after(async () => {
  await mongoose.connection.close();
});
