import { NextFunction, Request, Response } from "express";

import { users } from "../EmailProcesssors/FromHandlers";

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.cookies as { auth: string };
  console.log(user.auth);
  if (users.find((x) => x.email === user.auth)) {
    next();
  } else {
    res.status(400).json({
      status: "unauthorized",
    });
  }
};

export default AuthMiddleware;
