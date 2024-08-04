import { SMTPServer } from "smtp-server";

const simpleParser = require("mailparser").simpleParser;
import { logger } from ".";
import { emailclass } from "./EmailProcesssors/parsemail";
import { SMTPServerDataStream } from "smtp-server";

export default class emailServerClass {
  public server: SMTPServer;
  constructor() {
    this.server = new SMTPServer({
      authOptional: true,
      allowInsecureAuth: true,
      onConnect(session, callback) {
        console.log("onConnect", session.id);
        logger.info({
          session: session.id,
          message: `${session.id} connected`,
        });
        callback(); //accept the connection
      },

      onMailFrom(address, session, callback) {
        console.log(`receiving mail from ${address}`);
        logger.info({
          session: session.id,
          type: "receivedFrom",
          address: address,
        });
        callback();
      },

      onRcptTo(address, session, callback) {
        console.log(`receiving mail to ${address}`);
        logger.info({
          session: session.id,
          type: "mailTo",
          address: address,
        });
        callback();
      },

      onData(stream, session, callback) {
        let emaildata: string;

        stream.on("data", (data) => {
          try {
            emaildata += data.toString();
          } catch (error) {
            logger.error({
              function: "onData",
              messge: "error occured while updating emaildata",
              error,
            });
            console.log(`error occured while updating emaildata`);
          }
        });

        stream.on("end", () => {
          let parsemail: emailclass = new emailclass(session);
          parsemail.parseEmail(emaildata);
          emaildata = "";

          callback();
        });
      },
    });
  }

  get _server() {
    return this.server;
  }
}
