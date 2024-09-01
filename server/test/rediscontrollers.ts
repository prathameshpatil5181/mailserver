import { Request, Response } from "express";
import redis from "../models/RedisConnection";
export const insertotRedis = async (req: Request, res: Response) => {
  const msg = req.body.msg || "demomsg";

  try {
    const response = await redis.hset("1", "message", JSON.stringify(msg));
    console.log(response);
    res.json({
      status: "done",
      ouput: response,
    });
  } catch (error) {
    console.log(error);
  }
};
