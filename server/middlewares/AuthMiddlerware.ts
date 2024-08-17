import { NextFunction, Request, Response } from "express";

const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const user = req.cookies as {auth:string}
  console.log(user.auth);
  next();
};

export default AuthMiddleware;
