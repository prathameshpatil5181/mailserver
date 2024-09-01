import { NextFunction, Request, Response } from "express";
import { logger } from "..";
import { users } from "../EmailProcesssors/FromHandlers";

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.cookies.auth as string | undefined;

  if (user !== undefined && users.find((x) => x.email === user)) {
    //we have to connect to the spring server here will do once the devlopement is done
    return next();
  } else {
    console.log("error in auth");
    logger.error({
      function: "AuthMiddleware",
      error: "unauthorized",
    });
    res.status(401).json({
      status: "unauthorized",
    });
    return;
  }
};

export default AuthMiddleware;
