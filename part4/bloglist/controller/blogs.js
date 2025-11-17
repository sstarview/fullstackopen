const blogRouter = require("express").Router();
const Blog = require("../model/blog");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const blog = new Blog(request.body);

  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

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
