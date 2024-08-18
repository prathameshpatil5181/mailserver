import { Request, Response } from "express";
import getRequestedEmail from "../models/getRequestedMail";
getRequestedEmail;
const getRequestedEmailController = (req: Request, res: Response) => {
  const msg_id: string = req.body.msgId;
  const chain_id = req.body.chainId;

  if (msg_id === undefined || chain_id === undefined) {
    res.send(400).json({
      status: "Insufficient data",
    });
    return;
  }
  getRequestedEmail(msg_id, chain_id).then((result) => {
    if (result === "error" || typeof result === "string" || result===null) {
      res.status(500).json({
        status: "internal server error",
      });
    } else {
      res.status(200).json({
        status: "success",
        results: result,
      });
    }
  });
  //call the database function
};

export default getRequestedEmailController;
