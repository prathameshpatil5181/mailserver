import { Request, response, Response } from "express";
import { logger } from "..";
import getEmails from "../models/getEmails";

export const allEmailController = async (req: Request, res: Response) => {
  const user = req.cookies as { auth: string };

  const page: number | null | undefined = req.body.page;
  if (page === undefined || page === null) {
    res.status(400).json({
      status: "page is undefined",
    });
    logger.error({
      function: "allEmailController",
      status: "page is undefined",
    });
  } else {
    const querryresults = await getEmails(user.auth, page);

    if (querryresults === "error" || typeof querryresults === "string") {
      res.status(500).json({
        status: "internal server error",
      });
    } else {
      const parseResult = querryresults.map((x) => {
        return {
          msg_id: x.msg_id,
          chain_id: x.chain_id,
          user_ids: x.user_ids, // assuming x.user_ids is already an array of strings
          to: x.to ? JSON.parse(x.to) : null,
          from: x.from, // assuming `x.from` exists in the querryresults and is a string
          cc: x.cc ? JSON.parse(x.cc) : null, // assuming `x.cc` is a JSON string and needs parsing, or it's null
          subject: x.subject, // assuming `x.subject` exists in the querryresults and is a string
          received_date: x.received_date, // assuming `x.received_date` is a date string
          message_id: x.message_id, // assuming `x.message_id` exists in the querryresults and is a string
        };
      });

      logger.info({
        function: "allEmailController",
        status: "success",
        results: parseResult,  
      });

      res.status(200).json({
        status: "success",
        results: parseResult,
      });
    }
  }
};
