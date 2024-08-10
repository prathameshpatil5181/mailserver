import prismaClient from "./prismaSetup";
import { Iinsertdatabase } from "../utils/intefacses";
import { AddressObject, EmailAddress } from "mailparser";
import { v4, v3, v5, v1 } from "uuid";
import { logger } from "..";

interface IformatData {
  to: string[]; //
  from: string | null;
  cc: string[]; //
  bcc: string[]; //
  subject: string | null;
  received_date: Date;
  in_reply_to: string | null;
  refrences?: string[];
  isbody: boolean;
  htmlBody: string;
  textBody: string;
  textAsHtml: string;
  isattachement: boolean;
  attachmentUrl: string[] | null;
}

export const formatData = (insertdatabase: Iinsertdatabase): IformatData => {
  //   model Ai_mails_info{
  //   msg_id String @unique @id
  //   chain_id String
  //   to String[]
  //   from String
  //   cc String[]
  //   bcc String[]
  //   subject String
  //   in_reply_to String
  //   received_date DateTime
  //   message_id String
  //   created_on DateTime @default(now())
  //   @@index(fields:[msg_id,message_id])
  // }

  // cc bcc and to converter function
  const converToString = (
    convert: AddressObject | AddressObject[] | undefined
  ): string[] => {
    console.log(Array.isArray(convert));

    let convertedString: string[];

    //this might nevet get invoked beacause convert is never AddressObject[]
    if (Array.isArray(convert) && convert != undefined) {
      // converting to value to array of strings containing vlues and names;

      convertedString = convert.map((x) => {
        return JSON.stringify(x.value);
      });

      return convertedString;
    }
    //not a array

    if (convert !== undefined) {
      convertedString = convert.value.map<string>((x): string => {
        if (x !== undefined) {
          return JSON.stringify(x);
        }
        return '{"address":"","name":""}';
      });
      return convertedString;
    } else {
      convertedString = ['{"address":"","name":""}'];
      return convertedString;
    }
  };
  // cc bcc and to converter function ends

  // format fro function

  function isEmailAddress(object: any): object is EmailAddress[] {
    return true;
  }

  const fromformatter = (
    fromEmail: EmailAddress[] | undefined
  ): string | null => {

    //console.log(from.email);
    console.log('from part');
    console.log(fromEmail);


    if (isEmailAddress(fromEmail) && fromEmail!==undefined) {
      return fromEmail.map((emailObject) => {
        return JSON.stringify(emailObject);
      })[0];
    } else {
      console.log("undefinded");
      return '{"address":"","name":""}';
    }

    return null;
  };

  /// call for all to, cc and bcc

  return {
    to: converToString(insertdatabase.to), //
    from: fromformatter(insertdatabase.from),
    cc: converToString(insertdatabase.cc), //
    bcc: converToString(insertdatabase.cc), //
    subject:
      insertdatabase.subject !== undefined ? insertdatabase.subject : null,
    received_date:
      insertdatabase.received_date !== undefined
        ? insertdatabase.received_date
        : new Date(),
    in_reply_to:
      insertdatabase.in_reply_to !== undefined
        ? insertdatabase.in_reply_to
        : null,
    refrences: ["", ""], //
    isbody: insertdatabase.htmlBody === false ? false : true,
    htmlBody: insertdatabase.htmlBody === false ? "" : insertdatabase.htmlBody,
    textBody:
      insertdatabase.textBody === undefined ? "" : insertdatabase.textBody,
    textAsHtml:
      insertdatabase.textAsHtml === undefined ? "" : insertdatabase.textAsHtml,
    isattachement: insertdatabase.attachmentUrl !== null ? true : false,
    attachmentUrl: insertdatabase.attachmentUrl,
  };
};

export const storeMessages = async (insertdatabase: Iinsertdatabase) => {
  //generate the unique id for message
  const msg_id = v4() + "@prathamesh-de.com";

  //generate the unique id for mailchain
  const chain_id = v1() + "chain_id";

  console.log(formatData(insertdatabase));

  if (insertdatabase.in_reply_to !== undefined) {
    //find the chain id and then store the data
    return;
  }

  try {
    console.log("to");
  } catch (error) {}
};
