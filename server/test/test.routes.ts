import { Router } from "express";
import {testjsobdbinsert,handlejsonobject, convertToJsonTest} from "./testjsobdbinsert";
const testRouter = Router();


testRouter.get('/jsondbtest',testjsobdbinsert);
testRouter.get('/getjson',handlejsonobject);
testRouter.post('/getTo',convertToJsonTest);
export default testRouter;