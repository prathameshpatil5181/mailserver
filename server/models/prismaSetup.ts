import { Prisma, PrismaClient } from "@prisma/client";
import { logger } from "..";
import { query } from "express";
const prismaClient = new PrismaClient({
  log: ["query"],
});

// prismaClient.$on("query", (e:Prisma.QueryEvent) => {
//   console.log("Query: " + e.query);
//   logger.info({
//     type: "dbQuerry",
//     querry: e.query,
//   });
// });

export default prismaClient;
