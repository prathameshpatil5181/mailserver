import { SMTPServer } from "smtp-server";
import "dotenv/config";
import emailServerClass from "./emailserver";
require("dotenv").config();
import express from "express";
import { Request, Response } from "express";
const app = express();

//loki setup

import winston, { createLogger, transports } from "winston";
import LokiTransport from "winston-loki";
const options = {
  transports: [
    new LokiTransport({
      json: true,
      host: "http://65.0.173.100:3100",
      format: winston.format.json(),
    }),
  ],
};
export const logger = createLogger(options);

//setup http server
app.get("/", (req: Request, res: Response) => {
  logger.info("this is / route");
  res.status(200).send("<h1>Hello to everyone 3 🎉🎉🎉<h1>");
  logger.info("Response: " + "<h1>Hello to everyone 3 🎉🎉🎉<h1>");
});

app.listen(process.env.HTTP_PORT, () => {
  console.log(`server running on port ${process.env.HTTP_PORT}`);
});

//setup emailserver

const emailServer = new emailServerClass();

emailServer._server.listen(process.env.EMAIL_PORT, () => {
  console.log(`email server running on port ${process.env.EMAIL_PORT}`);
});
