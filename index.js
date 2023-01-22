const http = require("http");
const express = require("express");
const app = express();
let person = require("./person.js");
const morgan = require("morgan");
const { ppid } = require("process");
const cors = require("cors");
require('dotenv').config()

const requestLogger = (req, res, next) => {
  console.log("method:", req.method);
  console.log("path:", req.path);
  console.log("body:", req.body);
  next();
};
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
  if (request.query) {
    const searchedValue = person.filter((i) =>
      new RegExp(request.query.search, "i").test(i.name)
    );
    response.json(searchedValue);
  }
  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const note = person.find((i) => i.id === id);
  if (!note) {
    return response.status(404).json("content not found");
  }
  response.json(note);
});

app.get("/info", (request, response) => {
  response.send(
    `Phonebook has info for ${person.length} person \n\n ${Date()}`
  );
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  person = person.filter((i) => i.id !== id);

  response.json(person).end();
});

const generateId = () => {
  const maxId = person.length > 0 ? Math.max(...person.map((n) => n.id)) : 0;
  return maxId + 1;
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  const p = person.find((i) => i.name === body.name);
  if (p) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const one = {
    name: body.name,
    number: body.number || "",
    id: generateId(),
  };

  person = person.concat(one);
  response.json(one);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(process.env.PORT || 3001);
console.log(`Server running on port ${process.env.PORT}`);
