import e, { Request, Response } from "express";
import { v4 } from "uuid";
import { ConnectionIdSet, ConnectionSet } from "../utils/utilityVariables";
import { logger } from "..";
import { Console } from "winston/lib/winston/transports";
const connectionController = async (req: Request, res: Response) => {
  const user = req.cookies.auth;

  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };

  res.writeHead(200, headers);

  const uuId = v4();

  const ids = ConnectionIdSet.get(user);
  if (ids === undefined) {
    ConnectionIdSet.set(user, [uuId]);
    ConnectionSet.set(uuId, res);
    console.log(`connection added ${uuId}`);
    logger.info({
      function: "connectionController",
      message: `connection added ${uuId}`,
    });
    console.log("connectionidset");
    console.log(ConnectionIdSet);
  } else {
    ids.push(uuId);
    ConnectionSet.set(uuId, res);
    console.log(`${user} alerady exits ${uuId}`);
    logger.info({
      function: "connectionController",
      message: `${user} alerady exits ${uuId}`,
    });
    console.log("connectionidset");
    console.log(ConnectionIdSet);
  }
  res.write(`data: hii \n\n`);

  req.on("close", () => {
    const ids = ConnectionIdSet.get(user);
    if (ids !== undefined) {
      const newArray = ids.filter((client) => client !== uuId);
      if (newArray?.length === 0) {
        ConnectionIdSet.delete(user);
      } else {
        ConnectionIdSet.set(user, newArray);
      }

      ConnectionSet.delete(uuId);
      console.log("disconnected" + ids);
      console.log(`${uuId} Connection closed`);
      logger.info({
        function: "connectionController",
        message: `Connection closed ${uuId}`,
      });
    } else {
      logger.error({
        function: "connectionController",
        message: `ids is undefined`,
      });
    }
  });

  // req.on("close", () => {
  //   console.log("connection closed");
  // });
  // req.on("end", () => {
  //   console.log("connection ended");
  // });

  // res.on("close", () => {
  //   console.log("response connection closed");
  // });
  // res.on("end", () => {
  //   console.log("response connection ended");
  // });

  // res.destroy();
};

export default connectionController;
