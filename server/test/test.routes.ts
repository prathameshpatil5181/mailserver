import { Router } from "express";
import {testjsobdbinsert,handlejsonobject} from "./testjsobdbinsert";
const testRouter = Router();


testRouter.get('/jsondbtest',testjsobdbinsert);
testRouter.get('/getjson',handlejsonobject);
export default testRouter;