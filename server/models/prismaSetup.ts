import { PrismaClient} from "@prisma/client";
import { logger } from "..";
const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
  ]
});


prismaClient.$on("query", (e) => {
  console.log("Query: " + e.query);
  logger.info({
    type: "dbQuerry",
    querry: e.query
  });
});

export default prismaClient;