const express = require("express");
const mongoose = require("mongoose");
const config = require("./utils/config");
const blogRouter = require("./controller/blogs");
const middleware = require("./utils/middleware");
const userRouter = require("./controller/users");

const app = express();

mongoose.connect(config.MONGODB_URI, { family: 4 }).then(() => {
  console.log("Database connected...");
});

app.use(express.json());
app.use("/api/blogs", blogRouter);
app.use("/api/users", userRouter);
app.use(middleware.errorHandler);

module.exports = app;
