import { Router } from "express";
import connectionController from "../Controllers/connectionController";
import AuthMiddleware from "../middlewares/AuthMiddlerware";
const connectionRouter = Router();

connectionRouter.get("/", AuthMiddleware, connectionController);

export default connectionRouter;
