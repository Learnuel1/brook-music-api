/* eslint-disable no-undef */
const { createLogger, format, transports } = require("winston");
require("winston-mongodb");
const { combine, timestamp, errors, json , metadata} = format;

// eslint-disable-next-line no-unused-vars
exports.proLogger = (req) => {
  return createLogger({
    format: combine(
      json(),
      timestamp(), 
      errors({ stack: true }),
      metadata()),
    // defaultMeta: { service: "user-service" },
    transports: [
      new transports.MongoDB({
        level: "error",
        collection: "brook_error_log",
        db: process.env.ERROR_LOG_URL,
        options: { useUnifiedTopology: true },
      }),
      new transports.MongoDB({
        level: "info",
        collection: "brook_infor_log",
        db: process.env.ERROR_LOG_URL,
        options: { useUnifiedTopology: true },
      }),
      new transports.MongoDB({
        level: "debug",
        collection: "brook_exception_log",
        db: process.env.ERROR_LOG_URL,
        options: { useUnifiedTopology: true },
      }),
    ],
  });
};
