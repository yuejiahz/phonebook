const infoRouter = require("express").Router();
const Phonebook = require("../models/phonebook");

infoRouter.get("/info", async (request, response) => {
  response.send(
    `Phonebook has info for ${await Phonebook.countDocuments()} person \n\n ${Date()}`
  );
});

module.exports = { infoRouter };
