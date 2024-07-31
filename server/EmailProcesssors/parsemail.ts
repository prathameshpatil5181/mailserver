import { Worker } from "worker_threads";
import { SMTPServerDataStream, SMTPServerSession } from "smtp-server";
import { stream } from "winston";
import { simpleParser, ParsedMail } from "mailparser";

import { logger } from "..";

export class emailclass {
  public session: SMTPServerSession;
  public parsedEmailData?: ParsedMail;

  constructor(session: SMTPServerSession) {
    this.session = session;
    this.parsedEmailData = undefined;
  }

  public async parseEmailData(stream: string) {
    // create the worker thead

    try {
      //   if (stream === null || stream === undefined) {
      //     console.log("Input cannot be null or undefined.");
      //   } else {
      this.parsedEmailData = await simpleParser(stream);
      console.log(this.parsedEmailData);
      console.log("in parsed data");
      if (this.parsedEmailData !== undefined) {
        logger.info({
          session: this.session.id,
          type: "email data",
          data: this.parsedEmailData,
        });
      } else {
        logger.error({
          function: "parseEmailData",
          messge: "error occured while updating parseEmailData",
          error: "parseEmailData is undefined",
        });
      }
      //   }
    } catch (error) {
      logger.error({
        function: "parseEmailData",
        messge: "error occured while parsing",
        error,
      });
      console.log("error occured while parsing");
    }

    //     headers – a Map object with lowercase header keys
    // subject is the subject line (also available from the header mail.headers.get(‘subject’))
    // from is an address object for the From: header
    // to is an address object for the To: header
    // cc is an address object for the Cc: header
    // bcc is an address object for the Bcc: header (usually not present)
    // date is a Date object for the Date: header
    // messageId is the Message-ID value string
    // inReplyTo is the In-Reply-To value string
    // reply-to is an address object for the Cc: header
    // references is an array of referenced Message-ID values
    // html is the HTML body of the message. If the message included embedded images as cid: urls then these are all replaced with base64 formatted data: URIs
    // text is the plaintext body of the message
    // textAsHtml is the plaintext body of the message formatted as HTML
    // attachments is an array of attachments

    return this.parsedEmailData;
  }

  public onConnect() {}
}
