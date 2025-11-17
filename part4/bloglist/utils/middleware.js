const errorHandler = (error, request, response, next, ...other) => {
  console.log(error.name);

  if (error.name === "ValidationError") {
    response.status(400).send({ error: error.message });
  } else if (error.name === "CastError") {
    response.status(400).json({ error: error.message });
  }
};

module.exports = { errorHandler };
