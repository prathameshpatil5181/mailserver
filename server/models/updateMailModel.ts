import prismaClient from "./prismaSetup";
import { IformattedEmail } from "../utils/intefacses";
import { logger } from "..";
import { FormatEmailClass } from "../Classes/FormatEmailClass";

export const storeMessages = async (
  EmailDataObject: FormatEmailClass
): Promise<string> => {
  const chain_id = await EmailDataObject.getChainId();

  const formattedData: IformattedEmail = EmailDataObject.GetformattedEmail;

  try {
    const result = await prismaClient.ai_mails_info.create({
      data: {
        msg_id: formattedData.msg_id,
        chain_id: chain_id,
        user_ids: formattedData.user_ids,
        to: formattedData.to,
        cc: formattedData.cc,
        bcc: formattedData.bcc,
        subject: formattedData.subject,
        in_reply_to: formattedData.in_reply_to,
        received_date: formattedData.received_date,
        message_id: formattedData.messageId,
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

  try {
    const result = await prismaClient.mail_body.create({
      data: {
        msg_id: formattedData.msg_id,
        chain_id: chain_id,
        in_reply_to: formattedData.in_reply_to,
        refrences: formattedData.refrences,
        htmlBody: formattedData.htmlBody,
        textBody: formattedData.textBody,
        textAsHtml: formattedData.textAsHtml,
        attachments: formattedData.attachments,
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

  return "data persisted in db";
};
