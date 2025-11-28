const blogRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const Blog = require("../model/blog");
const User = require("../model/user");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post("/", async (request, response) => {
  const body = request.body;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(400).json({ error: "token invalid" });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return response.status(400).json({ error: "userId missing or not valid" });
  }

  const blog = new Blog({ ...body, user: user._id });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  const decodedToken = jwt.verify(request.token, process.env.SECRET);
  if (!decodedToken.id) {
    return response.status(400).json({ error: "token invalid" });
  }

  const blog = await Blog.findById(id);
  if (!blog) {
    return response.status(400).json({ error: "blog not found" });
  }

  if (blog.user.toString() !== decodedToken.id.toString()) {
    return response.status(403).json({
      error: "only the creator can delete this blog",
    });
  }
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
