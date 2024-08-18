import { Router } from "express";
import { allEmailController } from "../Controllers/allEmailController.controller";
import AuthMiddleware from "../middlewares/AuthMiddlerware";
import getRequestedEmailController from "../Controllers/getRequestedEmail.controller";


const emailRouter = Router();

emailRouter.get("/getAllEmails",AuthMiddleware, allEmailController);
emailRouter.get("/getEmail",getRequestedEmailController);

export default emailRouter;
