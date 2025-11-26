const errorHandler = (error, request, response, next, ...other) => {
  console.log(error.name);

  if (error.name === "ValidationError") {
    response.status(400).send({ error: error.message });
  } else if (error.name === "CastError") {
    response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    response.status(400).json({ error: "expected `username` to be unique" });
  }
};

module.exports = { errorHandler };
