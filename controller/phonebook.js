const { model } = require("mongoose");
const Phonebook = require("../models/phonebook");
const personRouter = require("express").Router();

// personRouter.get("/", (request, response) => {
//   response.send("<h1>Hello World!</h1>");
// });

personRouter.get("", async (request, response) => {
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

personRouter.get(":id", async (request, response) => {
  const id = request.params.id;
  const data = await Phonebook.find((i) => i.id === id);
  if (!data) {
    return response.status(404).json("content not found");
  } else {
    response.json(data);
  }
});

personRouter.delete("/:id", async (request, response) => {
  const data = await Phonebook.findOne({ _id: request.params.id });
  await Phonebook.deleteOne({ _id: request.params.id });
  response.json(data).end();
});

personRouter.put("/:id", async (request, response) => {
  try {
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
  } catch (err) {
    return response.status(500).json({
      error: err.message,
    });
  }
});

personRouter.post("", async (request, response) => {
  try {
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
  } catch (err) {
    throw response.status(500).json(err.message);
  }
});

module.exports = { personRouter };
