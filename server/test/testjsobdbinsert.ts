import prismaClient from "../models/prismaSetup";
import { json, Request, Response } from "express";
export const testjsobdbinsert = async (req: Request, res: Response) => {
  const testobj = [
    { address: "recipient1@prathamesh-de.com", name: "" },
    { address: "recipient2@prathamesh-de.com", name: "" },
  ];

  try {
    const response = await prismaClient.test_table.create({
      data: {
        jsonobject: testobj,
      },
    });
    console.log(response);
    res.status(200).json({
      result: response,
    });
  } catch (error) {
    res.status(500).send("server error");

    throw new Error("lets be forward");
  }
};

export const handlejsonobject = async (req: Request, res: Response) => {
  const json = { address: "recipient1@prathamesh-de.com", name: "" };
  try {
    //   const response = await prismaClient.test_table.findUnique({
    //     where: {
    //       jsonobject: {
    //         path:['$[*].address'],
    //         array_contains: "recipient1@prathamesh-de.com",
    //       },
    //     },
    //   });

    const currenttime = new Date().getTime();
    const response = await prismaClient.ai_mails_info.findMany({
      select: {
        cc: true,
        msg_id: true,
        chain_id: true,
        user_ids: true,
        to: true,
        from: true,
        subject: true,
        in_reply_to: true,
        received_date: true,
        message_id: true,
      },
      where: {
        user_ids: {
          has: "prathamesh@prathamesh-de.me",
        },
      },
      orderBy: {
        received_date: "desc",
      },
    });
    const exectime: number = new Date().getTime() - currenttime;
    console.log("exectime");
    console.log(exectime);
    res.status(200).json({
      result: response,
      exectime,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");

    throw new Error("lets be forward");
  }
};

export const convertToJsonTest = async (req: Request, res: Response) => {
  const find: string = req.body.find;

  try {
    const currenttime = new Date().getTime();
    const response = await prismaClient.ai_mails_info.findFirst({
      select: {
        cc: true,
        msg_id: true,
        chain_id: true,
        user_ids: true,
        to: true,
        from: true,
        subject: true,
        in_reply_to: true,
        received_date: true,
        message_id: true,
      },
      where: {
        to: {
          contains: `%${find}%`,
        },
      },
      orderBy: {
        received_date: "desc",
      },
    });
    const exectime: number = new Date().getTime() - currenttime;
    console.log("exectime");
    console.log(exectime);
    if (response !== null) {
      res.status(200).json({
        result: response,
        exectime,
        to: JSON.parse(response.to !== null ? response.to : "{}"),
      });
    } else {
      res.status(200).json({
        result: response,
        exectime,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");

    throw new Error("lets be forward");
  }
};
