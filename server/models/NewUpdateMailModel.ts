import prismaClient from "./prismaSetup";
import { Iinsertdatabase } from "../utils/intefacses";
import { AddressObject, EmailAddress } from "mailparser";
import { v4, v1 } from "uuid";
import { logger } from "..";

interface IformatData {
  user_ids: string[];
  to: string; //
  from: string;
  cc: string; //
  bcc: string; //
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
  //   created_on DateTime @defau`lt(now())
  //   @@index(fields:[msg_id,message_id])
  // }

  // cc bcc and to converter to string function
  const converToString = (
    convert: AddressObject | AddressObject[] | undefined
  ): string => {
    if (convert === undefined) {
      return "";
    } else {
      return JSON.stringify(convert);
    }
  };
  // cc bcc and to converter to string function ends

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
      return "";
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

  //useid  handelers

  function isAddressArray(to: any): to is AddressObject {
    return true;
  }

  function handleAddressObject(to: AddressObject): string[] {
    let ids = to.value.filter(
      (address) => address.address?.split("@")[1] === "prathamesh-de.me"
    );
    console.log("ids are");
    console.log(ids);
    if (ids === undefined) {
      return [""];
    } else {
      return ids.map((x) => x.address || "");
    }
  }

  const handleuserIds = (
    to: AddressObject | AddressObject[] | undefined
  ): string[] => {
    let userIds: string[] = [];

    if (to === undefined) {
      return [""];
    } else if (isAddressArray(to) === false) {
      const addressarray = to.map((x) => handleAddressObject(x));

      for (let i = 0; i < addressarray.length; i++) {
        for (let j = 0; j < addressarray[0].length; j++) {
          userIds.push(addressarray[i][i]);
        }
      }
    } else {
      userIds = handleAddressObject(to);
    }

    return userIds;
  };

  return {
    user_ids: handleuserIds(insertdatabase.to), //lets put email ids here
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
        : "",
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

//main function *******************************
//*********************************************

export const storeMessages = async (
  insertdatabase: Iinsertdatabase
): Promise<string> => {
  //generate the unique id for message
  const msg_id = v4() + "@prathamesh-de.me";

  //generate the unique id for mailchain
  const chain_id = v1() + "@_chain_id";

  const formattedData: IformatData = formatData(insertdatabase);

  console.log(formattedData);

  if (insertdatabase.in_reply_to !== undefined) {
    //find the chain id and then store the data
    const result = await prismaClient.ai_mails_info.findFirst({
      select: { chain_id: true },
      where: {
        message_id: formattedData.in_reply_to,
      },
    });
    const chainId = result?.chain_id;
    console.log(chainId);

    try {
      const result = await prismaClient.mail_body.create({
        data: {
          msg_id: msg_id,
          chain_id: chainId || chain_id,
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

    try {
      const result = await prismaClient.ai_mails_info.create({
        data: {
          msg_id: msg_id,
          chain_id: chainId || chain_id,
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

    return "finding the chain id";
  }

  console.log("making querry 2");
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
    return "failed to store the data";
  }

  console.log("making querry 1");
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
    console.log(error);
    logger.error({
      function: "storeMessages error in storing Ai_mail_info table",
      error,
    });
    return "failed to store the data";
  }

  //storing in the mail_body

  return "data persisted in db";
};
