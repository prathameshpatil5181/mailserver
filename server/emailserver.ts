import { SMTPServer } from "smtp-server";
import { Worker, isMainThread, parentPort, workerData } from "worker_threads";
import fs from "fs";
const simpleParser = require("mailparser").simpleParser;
export default class emailServerClass {
  public server: SMTPServer;
  constructor() {
    let emaildata: any;
    this.server = new SMTPServer({
      authOptional: true,
      allowInsecureAuth: true,
      onConnect(session, callback) {
        console.log("onConnect", session.id);
        callback(); //accept the connection
      },

      onMailFrom(address, session, callback) {
        console.log(`receiving mail from ${address}`);
        callback();
      },

      onRcptTo(address, session, callback) {
        console.log(`receiving mail to ${address}`);
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

  fs.writeFile("/content.txt", parsed.toString(), (error) => {
    console.log("error occured");
  });
};
