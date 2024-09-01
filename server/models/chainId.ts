import { logger } from "..";
import prismaClient from "./prismaSetup";
import redis from "./RedisConnection";

const chainId = async (inReply: string): Promise<string> => {
  try {
    const result = await prismaClient.ai_mails_info.findFirst({
      select: {
        chain_id: true,
      },
      where: {
        message_id: inReply,
      },
    });
    if (result === null) {
      throw new Error("result is null");
    } else {
      return result?.chain_id;
    }
  } catch (error) {
    logger.error({
      function: "chainId",
      error: error,
    });
    return "failed";
  }
};

export default chainId;
