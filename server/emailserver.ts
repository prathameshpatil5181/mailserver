import { SMTPServer } from "smtp-server";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import fs from "fs";
const simpleParser = require("mailparser").simpleParser;
import { logger } from ".";


export default class emailServerClass {
  public server: SMTPServer;
  constructor() {
    let emaildata: any;
    this.server = new SMTPServer({
      authOptional: true,
      allowInsecureAuth: true,
      onConnect(session, callback) {
        console.log("onConnect", session.id);
        logger.info({
          message:session.id
        });
        callback(); //accept the connection
      },

      onMailFrom(address, session, callback) {
        console.log(`receiving mail from ${address}`);
        logger.info({
          message: `receiving mail from ${address}`,
        });
        callback();
      },

      onRcptTo(address, session, callback) {
        console.log(`receiving mail to ${address}`);
        logger.info({
          message: `Mail to ${address}`,
        });
        callback();
      },
      
      onData(stream, session, callback) {
        if (isMainThread) {
          stream.on("data", (data) => {
            emaildata += data;
          });
          stream.on("end", () => {
            handleEmailData(emaildata);
            console.log("email data");
            console.log(emaildata);
            logger.info({
              type:"email data",
              data: emaildata,
            });
            callback(); 
          });
        }
      },
    });
  }

  get _server() {
    return this.server;
  }
}
const handleEmailData = async (data: any) => {
  const parsed = await simpleParser(data);
  console.log(parsed);
  try {
    const emailContent = parsed.text;
    fs.writeFile("/content.txt", emailContent, (error) => {
      console.log(error);
      console.log("error occured");
    });
  } catch (error) {
    console.log(error);
  }
};
