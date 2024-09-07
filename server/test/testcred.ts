import { Request, Response } from "express";
import credentials from "../models/credentials";

const testcred = async (req: Request, res: Response) => {
  try {
    const userName = req.body?.userName as string;
    console.log(userName);
    if (!userName) {
      return res.status(400).json({
        error: true,
        message: "Missing required parameter: userName",
      });
    }

    // Call the authenticateUser function
    const authResult = await credentials(userName);

    // Handle different outcomes
    if (authResult === false) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    } else {
      return res.status(200).json({
        error: false,
        data: {
          userId: authResult.userId,
          password: authResult.password,
        },
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "An unexpected error occurred during authentication",
    });
  }
};

export default testcred;
