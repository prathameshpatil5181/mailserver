import { SMTPServerSession } from "smtp-server";
import { simpleParser, ParsedMail } from "mailparser";
import { attachmenthandler } from "./attachmenthandler";

import { logger } from "..";

export class emailclass {
  public session: SMTPServerSession;
  public parsedEmailData?: ParsedMail;

  constructor(session: SMTPServerSession) {
    this.session = session;
    this.parsedEmailData = undefined;
  }

  public async parseEmail(stream: string) {
    // parsing email
    try {
      this.parsedEmailData = await simpleParser(stream);
  
      //handle attachments
      if (
        this.parsedEmailData.attachments !== undefined &&
        this.parsedEmailData.attachments.length > 0
      ) {
        const attach = new attachmenthandler();
        attach.storeToS3(this.parsedEmailData?.attachments);
      } else {
        console.log("no attachements");
      }

      //logging logs
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
    } catch (error) {
      logger.error({
        function: "parseEmailData",
        messge: "error occured while parsing",
        error,
      });
      console.log("error occured while parsing");
    }

    // headers – a Map object with lowercase header keys
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
    // attachments is an array of attachmentss

    return this.parsedEmailData;
  }

  public onConnect() {}
}
