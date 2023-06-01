const http = require("http");
const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const { ppid } = require("process");
const cors = require("cors");
require("dotenv").config();

const Phonebook = require("./models/phonebook.js");

const app = express();

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
app.use(express.static("build"));

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", async (request, response) => {
  if (request.query.search) {
    const searchedValue = await Phonebook.find({
      name: { $regex: request.query.search },
    });
    response.json(searchedValue);
  } else {
    const list = await Phonebook.find().then((list) => {
      response.json(list);
    });
    return list;
  }
});

app.get("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  const data = await Phonebook.find((i) => i.id === id);
  if (!data) {
    return response.status(404).json("content not found");
  } else {
    response.json(data);
  }
});

app.get("/info", async (request, response) => {
  response.send(
    `Phonebook has info for ${await Phonebook.countDocuments()} person \n\n ${Date()}`
  );
});

app.delete("/api/persons/:id", async (request, response) => {
  const data = await Phonebook.findOne({ _id: request.params.id });
  await Phonebook.deleteOne({ _id: request.params.id });
  response.json(data).end();
});
app.put("/api/persons/:id", async (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  const data = await Phonebook.findOne({ _id: body.id });

  if (!data) {
    return response.status(400).json({
      error: "record does not exist!",
    });
  }
  const updated = await Phonebook.findOneAndUpdate(body);
  updated.save();

  response.json(updated).end();
});

app.post("/api/persons", async (request, response) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name or number missing",
    });
  }
  const data = await Phonebook.findOne({ name: body.name });

  if (data) {
    return response.status(400).json({
      error: "name must be unique!",
    });
  }

  const newRecord = new Phonebook({
    name: body.name,
    number: body.number || "",
  });

  await newRecord.save();

  response.json({
    name: body.name,
    number: body.number || "",
  });
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

app.listen(process.env.PORT || 3001);
console.log(`Server running on port ${process.env.PORT}`);
