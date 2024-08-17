import { Router } from "express";
import { allEmailController } from "../Controllers/allEmailController.controller";
import AuthMiddleware from "../middlewares/AuthMiddlerware";


const emailRouter = Router();

emailRouter.get("/getAllEmails",AuthMiddleware, allEmailController);

export default emailRouter;
