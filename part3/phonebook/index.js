const express = require("express");
const app = express();
const morgan = require("morgan");

let phonebook = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("body", (req, res) => JSON.stringify(req.body));

app.use(express.json());

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const generateId = () => {
  return String(Math.floor(Math.random() * 100000));
};

app.get("/info", (request, response) => {
  response.send(`<div>Phonebook has info for ${
    phonebook.length
  } people</div><br />
    <div>${new Date()}</div>`);
});

app.get("/api/persons", (request, response) => {
  response.json(phonebook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const person = phonebook.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  phonebook = phonebook.filter((person) => person.id !== id);
  response.status(204).end();
});

app.post("/api/persons/", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "content missing",
    });
  }
  const isDuplicateName = phonebook.find(
    (person) => person.name.toLowerCase() === body.name.toLowerCase()
  );

  if (isDuplicateName) {
    return response.status(409).json({
      error: "name must be unique",
    });
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };
  phonebook = phonebook.concat(person);
  response.status(201).json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
