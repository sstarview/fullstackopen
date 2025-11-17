const { describe, test, beforeEach, after } = require("node:test");
const assert = require("node:assert");
const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../model/blog");
const helper = require("./test_helper");

const api = supertest(app);

describe("When there is initially some blog saved", async () => {
  beforeEach(async () => {
    await Blog.deleteMany({});
    await Blog.insertMany(helper.initialTestBlog);
  });

  test.only("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test.only("all blogs are returned", async () => {
    const response = await api.get("/api/blogs");
    assert.strictEqual(response.body.length, helper.initialTestBlog.length);
  });

  test.only("identifier property of the blog posts is named id", async () => {
    const response = await api.get("/api/blogs");
    assert("id" in response.body[0]);
  });

  describe("addition of a blog", async () => {
    test.only("created a new blog", async () => {
      const newBlog = {
        title: "She was there",
        author: "Kaka Molim",
        url: "https://kalamolim.com",
        likes: 88,
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await helper.blogsInDB();
      assert.strictEqual(response.length, helper.initialTestBlog.length + 1);
      const title = response.map((b) => b.title);
      assert(title.includes("She was there"));
    });

    test.only("likes field default to 0", async () => {
      const newBlog = {
        title: "She was there",
        author: "Kaka Molim",
        url: "https://kalamolim.com",
      };

      await api
        .post("/api/blogs")
        .send(newBlog)
        .expect(201)
        .expect("Content-Type", /application\/json/);

      const response = await helper.blogsInDB();
      const addedBlog = response.find((b) => b.title === newBlog.title);
      assert.strictEqual(addedBlog.likes, 0);
    });

    test.only("missing fields responds with 400", async () => {
      const newBlog = {
        author: "Kaka Molim",
      };

      await api.post("/api/blogs").send(newBlog).expect(400);
    });
  });

  describe("deleting a blog", async () => {
    test.only("successfully deleted blog", async () => {
      const blogAtStart = await helper.blogsInDB();
      const blogToDelete = blogAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const blogsAtEnd = await helper.blogsInDB();

      const title = blogsAtEnd.map((b) => b.title);
      assert(!title.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, helper.initialTestBlog.length - 1);
    });
  });

  describe("Updating a blog", async () => {
    test.only("successfully updated a blog", async () => {
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
