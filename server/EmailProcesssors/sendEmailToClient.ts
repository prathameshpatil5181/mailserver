import { ConnectionIdSet, ConnectionSet } from "../utils/utilityVariables";

// import { formatData } from "../models/updateMailModel";
import chainId from "../models/chainId";
import { FormatEmailClass } from "../Classes/FormatEmailClass";

const toStringfyMethod = <T>(convertData: string | null): string | null => {
  if (convertData === null || convertData === undefined) {
    return null;
  }

  return JSON.parse(convertData);
};

const toStringfyMethodString = <T>(convertData: T): string => {
  if (convertData === null || convertData === undefined) {
    return JSON.stringify("");
  }

  return JSON.stringify(convertData);
};

const sendEmailToClient = async (
  emailDetails: FormatEmailClass
): Promise<boolean> => {
  // map over the ids
  const formattedEmaildata = emailDetails.GetformattedEmail;
  const rawEmail = emailDetails.GetRawEmail;
  const ids = formattedEmaildata.user_ids;

  try {
    const sendEmail = {
      msg_id: formattedEmaildata.msg_id,
      chain_id: await emailDetails.getChainId(),
      user_ids: formattedEmaildata.user_ids,
      to: toStringfyMethod(formattedEmaildata.to),
      from:
        formattedEmaildata.from !== null
          ? JSON.parse(formattedEmaildata.from)
          : null,
      cc:
        formattedEmaildata.cc !== null
          ? JSON.parse(formattedEmaildata.cc)
          : null,
      subject: toStringfyMethod(formattedEmaildata.subject),
      received_date: formattedEmaildata.received_date,
      message_id: formattedEmaildata.messageId,
      htmlBody: JSON.parse,
      textBody:
        formattedEmaildata.textBody !== undefined
          ? JSON.parse(formattedEmaildata.textBody)
          : null,
      textAsHtml:
        formattedEmaildata.textAsHtml === undefined
          ? JSON.parse(formattedEmaildata.textAsHtml)
          : formattedEmaildata.textAsHtml,
      isattachement: formattedEmaildata.attachments !== null ? true : false,
      messageId: formattedEmaildata.messageId || JSON.stringify(""),
      attachments: formattedEmaildata.attachments || [],
    };

    for (let i = 0; i < ids.length; i++) {
      const idArray = ConnectionIdSet.get(ids[i]);

      if (idArray === undefined) {
        //handle undefined
        continue;
      }

      for (let j = 0; j < idArray.length; j++) {
        const res = ConnectionSet.get(idArray[j]);

        if (res !== undefined) {
          res.write(`data: ${JSON.stringify(sendEmail)}\n\n`);
        } else {
          continue;
        }
      }
    }
  } catch (error) {
    console.log("error in sendemail");
    console.log(error);
  }

  return true;
};

export default sendEmailToClient;
