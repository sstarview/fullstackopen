const blogRouter = require("express").Router();
const Blog = require("../model/blog");
const User = require("../model/user");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const user = await User.findOne({});
  const blog = new Blog({ ...request.body, user: user._id });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
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
