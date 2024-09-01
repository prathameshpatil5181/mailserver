import { logger } from "..";
import prismaClient from "./prismaSetup";

const getRequestedEmail = async (msgId: string, chainId: string) => {
  //get the data

  const currenttime = new Date().getTime();
  try {
    const response = await prismaClient.ai_mails_info.findMany({
      relationLoadStrategy: "join",
      include: {
        mailBody: true,
      },
      where: {
        chain_id: chainId,
      },
      orderBy: {
        received_date: "desc",
      },
    });
    const exectime: number = new Date().getTime() - currenttime;
    logger.info({
      type: "dbquerry",
      exectime,
    });
    return response;
  } catch (error) {
    logger.error({
      function: "getEmails",
      description: "error while getting the emails",
      error: error,
    });
    console.log(error);
    return "error";
  }
};

export default getRequestedEmail;
