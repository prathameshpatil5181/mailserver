import { SMTPServer } from "smtp-server";
import "dotenv/config";
import emailServerClass from "./emailserver";
require("dotenv").config();

const emailServer = new emailServerClass();

emailServer._server.listen(process.env.EMAIL_PORT, () => {
  console.log(`server running on port ${process.env.EMAIL_PORT}`);
});
