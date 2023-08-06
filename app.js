const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { unknownEndpoint, requestLogger } = require("./utils/middleware");
const personRouter = require("./controller/phonebook");
const infoRouter = require("./controller/info");
const mongoose = require("mongoose");

const app = express();

require("dotenv").config();

const config = require("./utils/config");
const logger = require("./utils/logger");

mongoose.set("strictQuery", false);

const url = config.MONGODB_URI;

connect().catch((err) => console.log(err));
async function connect() {
  await mongoose
    .connect(url)
    .then(async (result) => {
      logger.info("1 connected to MongoDB");
    })
    .catch((error) => {
      logger.info("error connecting to MongoDB:", error.message);
    });
}

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(requestLogger);
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(express.static("build"));

app.use("/api/persons", personRouter.personRouter);

app.use("/api", infoRouter.infoRouter);

app.use(unknownEndpoint);

module.exports = app;
