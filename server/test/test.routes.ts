import { Router } from "express";
import {
  testjsobdbinsert,
  handlejsonobject,
  convertToJsonTest,
  dummyres,
  sendMessage
} from "./testjsobdbinsert";
import { insertotRedis } from "./rediscontrollers";
import AuthMiddleware from "../middlewares/AuthMiddlerware";
const testRouter = Router();

testRouter.get("/jsondbtest", testjsobdbinsert);
testRouter.get("/getjson", handlejsonobject);
testRouter.post("/getTo", convertToJsonTest);
testRouter.get("/redisinsert", insertotRedis);
testRouter.get("/testmiddle",AuthMiddleware,dummyres);
testRouter.get("/testmsg", sendMessage);
export default testRouter;
