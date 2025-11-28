const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../model/blog");
const User = require("../model/user");
const middleware = require("../utils/middleware");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post("/", middleware.userExtractor, async (request, response) => {
  const body = request.body;
  const blog = new Blog({ ...body, user: request.user._id });

  const savedBlog = await blog.save();
  request.user.blogs = request.user.blogs.concat(savedBlog._id);
  await request.user.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const id = request.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
      return response.status(404).json({ error: "blog not found" });
    }

    if (blog.user.toString() !== request.user._id.toString()) {
      return response.status(403).json({
        error: "only the creator can delete this blog",
      });
    }
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  }
);

blogRouter.put("/:id", async (request, response, next) => {
  const id = request.params.id;
  const { author, title, url, likes } = request.body;

  const fetchedBlog = await Blog.findById(id);
  fetchedBlog.title = title;
  fetchedBlog.author = author;
  fetchedBlog.url = url;
  fetchedBlog.likes = likes;

  const updatedBlog = await fetchedBlog.save();
  response.json(updatedBlog);
});

module.exports = blogRouter;
