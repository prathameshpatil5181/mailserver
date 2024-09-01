import prismaClient from "./prismaSetup";
import { logger } from "..";
const pageitems:number = 3;


interface IgetEmails {
  msg_id: string;
  chain_id: string;
  user_ids: string[];
  to: string | null;
  from: string;
  cc: string | null;
  subject: string | null;
  received_date: Date;
  message_id: string;
};

    // msg_id: string;
    // chain_id: string;
    // user_ids: string[];
    // to: string | null;
    // from: string;
    // cc: string | null;
    // subject: string | null;
    // received_date: Date;
    // message_id: string;

 const getEmails =  async(userId:string,page:number):Promise<IgetEmails[] |string>=>{

    try {

      const currenttime = new Date().getTime();
      const response = await prismaClient.ai_mails_info.findMany({
        skip: page * pageitems,
        take:pageitems,
        select: {
          cc: true,
          msg_id: true,
          chain_id: true,
          user_ids: true,
          to: true,
          from: true,
          subject: true,
          received_date: true,
          message_id: true,
        },
        where: {
          user_ids: {
            has: userId,
          },
        },
        orderBy: {
          received_date: "desc",
        },
      });
      const exectime: number = new Date().getTime() - currenttime;

      logger.info({
        type:"dbquerry",
        exectime
      })

      return response;

    } catch (error) {
      logger.error({
        function: "getEmails",
        description:"error while getting the emails",
        error:error
      });
      console.log(error);
      return "error";
    }

}

export default getEmails;