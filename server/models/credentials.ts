import { weightSrvRecords } from "ioredis/built/cluster/util";
import prismaClient from "./prismaSetup";
import redis from "./RedisConnection";
import { logger } from "..";
const credentials = async (
  userName: string
): Promise<{ userId: string; password: string } | false> => {
  try {
    const password = await redis.hget("creds", userName);
    if (password !== null) {
      return {
        userId: userName,
        password: password,
      };
    } else {
      try {
        const result = await prismaClient.credentials.findUnique({
          select: {
            authId: true,
            password: true,
          },
          where: {
            authId: userName,
          },
        });

        if (result === null) {
          return false;
        }
        await redis.hset("creds", result.authId, result.password);
        return {
          userId: result.authId,
          password: result.password,
        };
      } catch (error) {
        console.log("Error in db queery");
        logger.error({
          function: "credentials",
          error: error,
        });
        return false;
      }
    }
  } catch (error) {
    console.log("error in authenticating");
    logger.error({
      function: "credentials",
      error: error,
    });
    return false;
  }
};

export default credentials;
