
import { Worker } from "worker_threads";
import { SMTPServerDataStream, SMTPServerSession } from "smtp-server";
import { stream } from "winston";
import { simpleParser } from "mailparser";
import { logger } from "..";

export class emailclass {
  public session: SMTPServerSession;
  public parsedEmailData: any;

  constructor(session: SMTPServerSession) {
    this.session = session;
  }

  async parseEmailData(stream: string) {
    // create the worker thead

    try {
    //   if (stream === null || stream === undefined) {
    //     console.log("Input cannot be null or undefined.");
    //   } else {
        this.parsedEmailData = await simpleParser(stream);
        console.log("in parsed data");
    //   }
    } catch (error) {
      logger.error({
        function: "parseEmailData",
        messge: "error occured while parsing",
        error,
      });
      console.log("error occured while parsing");
    }

    logger.info({
      session: this.session.id,
      type: "email data",
      data: { ...this.parseEmailData },
    });

    return this.parsedEmailData;
  }

  public onConnect() {}
}
