const logger = require("./logger");

const requestLogger = (request, response, next) => {
  logger.info("method ", request.method);
  logger.info("path ", request.path);
  logger.info("body ", request.body);
  logger.info("-------");
  next();
};

const unknownEndpoint = (error, request, response, next) => {
  logger.error(error.message);
};

module.exports = {
  requestLogger,
  unknownEndpoint,
};
