import prismaClient from "./prismaSetup";
import { Iinsertdatabase } from "../utils/intefacses";
import { AddressObject, EmailAddress } from "mailparser";
import { v4, v3, v5, v1 } from "uuid";
import { logger } from "..";

interface IformatData {
  user_ids: string[];
  to: string[]; //
  from: string;
  cc: string[]; //
  bcc: string[]; //
  subject: string | null;
  received_date: Date;
  in_reply_to: string;
  refrences?: string[];
  isbody: boolean;
  htmlBody: string;
  textBody: string;
  textAsHtml: string;
  isattachement: boolean;
  message_id: string;
  attachmentUrl: string[];
}

export const formatData = (insertdatabase: Iinsertdatabase): IformatData => {
  //   model Ai_mails_info{
  //   msg_id String @unique @id
  //   chain_id String
  // user_ids String[]
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
        return '';
      });
      return convertedString;
    } else {
      convertedString = [];
      return convertedString;
    }
  };
  // cc bcc and to converter function ends

  // format from function type checker
  function isEmailAddress(object: any): object is EmailAddress[] {
    return true;
  }
  const fromformatter = (fromEmail: EmailAddress[] | undefined): string => {
    //console.log(from.email);
    console.log("from part");
    console.log(fromEmail);

    if (isEmailAddress(fromEmail) && fromEmail !== undefined) {
      return fromEmail.map((emailObject) => {
        return JSON.stringify(emailObject);
      })[0];
    } else {
      console.log("undefinded");
      return '';
    }
  };

  //referances handler
  const handleReferances = (
    refrances: string[] | string | undefined
  ): string[] => {
    if (refrances === undefined) {
      return [];
    }
    if (typeof refrances === "string") {
      return [refrances];
    } else {
      return refrances;
    }
  };

  /// call for all to, cc and bcc

  return {
    user_ids: ["test1"], //lets put email ids here
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
        : '',
    refrences: handleReferances(insertdatabase.refrences), //
    isbody: insertdatabase.htmlBody === false ? false : true,
    htmlBody: insertdatabase.htmlBody === false ? "" : insertdatabase.htmlBody,
    textBody:
      insertdatabase.textBody === undefined ? "" : insertdatabase.textBody,
    textAsHtml:
      insertdatabase.textAsHtml === undefined ? "" : insertdatabase.textAsHtml,
    isattachement: insertdatabase.attachmentUrl !== null ? true : false,
    message_id: insertdatabase.messageId || "",
    attachmentUrl: insertdatabase.attachmentUrl || [],
  };
};

export const storeMessages = async (insertdatabase: Iinsertdatabase):Promise<string> => {
  //generate the unique id for message
  const msg_id = v4() + "@prathamesh-de.com";

  //generate the unique id for mailchain
  const chain_id = v1() + "chain_id";

  const formattedData: IformatData = formatData(insertdatabase);

  if (insertdatabase.in_reply_to !== undefined) {
    //find the chain id and then store the data

    const result = prismaClient.ai_mails_info.findFirst({
      select:{chain_id:true},
      where:{
        in_reply_to:formattedData.in_reply_to
      } 
    })
    const chainId = result.toString();
    console.log(chainId);

     try {
       const result = await prismaClient.ai_mails_info.create({
         data: {
           msg_id: msg_id,
           chain_id: chainId,
           user_ids: formattedData.user_ids,
           to: formattedData.to,
           cc: formattedData.cc,
           bcc: formattedData.bcc,
           subject: formattedData.subject || "",
           in_reply_to: formattedData.in_reply_to || "",
           received_date: formattedData.received_date,
           message_id: formattedData.message_id,
           from: formattedData.from,
         },
       });
       logger.info({
         function: "storeMessages in Ai_mail_info table",
         data: result,
       });
     } catch (error) {
       logger.error({
         function: "storeMessages error in storing Ai_mail_info table",
         error,
       });
       return "failed to store the data";
     }

     //storing in the mail_body

     try {
       const result = await prismaClient.mail_body.create({
         data: {
           msg_id: msg_id,
           chain_id: chainId,
           in_reply_to: formattedData.in_reply_to || "",
           refrences: formattedData.refrences,
           htmlBody: formattedData.htmlBody,
           textBody: formattedData.textBody,
           textAsHtml: formattedData.textAsHtml,
           attachments: formattedData.attachmentUrl,
         },
       });
       logger.info({
         function: "storeMessages in mail_body table",
         data: result,
       });
     } catch (error) {
       logger.error({
         function: "storeMessages error in storing mail_body table",
         error,
       });
       return "failed to store the data";
     }




    return 'finding the chain id';
  }

//-----------------------------------------------------------------------


  //storing in the Ai_mails_info
  try {
    const result = await prismaClient.ai_mails_info.create({
      data: {
        msg_id: msg_id,
        chain_id: chain_id,
        user_ids: formattedData.user_ids,
        to: formattedData.to,
        cc: formattedData.cc,
        bcc: formattedData.bcc,
        subject: formattedData.subject || "",
        in_reply_to: formattedData.in_reply_to || "",
        received_date: formattedData.received_date,
        message_id: formattedData.message_id,
        from: formattedData.from,
      },
    });
    logger.info({
      function: "storeMessages in Ai_mail_info table",
      data: result,
    });
  } catch (error) {
    logger.error({
      function: "storeMessages error in storing Ai_mail_info table",
      error,
    });
     return "failed to store the data";
  }

  //storing in the mail_body

  try {
    const result = await prismaClient.mail_body.create({
      data: {
        msg_id: msg_id,
        chain_id: chain_id,
        in_reply_to: formattedData.in_reply_to || "",
        refrences: formattedData.refrences,
        htmlBody: formattedData.htmlBody,
        textBody: formattedData.textBody,
        textAsHtml: formattedData.textAsHtml,
        attachments: formattedData.attachmentUrl,
      },
    });
    logger.info({
      function: "storeMessages in mail_body table",
      data: result,
    });
  } catch (error) {
    logger.error({
      function: "storeMessages error in storing mail_body table",
      error,
    });
    return 'failed to store the data'
  }

  return 'data persisted in db';

};
