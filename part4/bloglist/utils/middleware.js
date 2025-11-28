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
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: "token invalid" });
  } else if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }
};

const tokenExactor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }
  next();
};

module.exports = { errorHandler, tokenExactor };
