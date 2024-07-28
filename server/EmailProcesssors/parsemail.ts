const simpleParser = require("mailparser").simpleParser;
import {Worker} from 'worker_threads';
import { SMTPServerDataStream, SMTPServerSession } from "smtp-server";
import { stream } from "winston";
let parser = simpleParser();
import { logger } from '..';

export class emailclass{

   public session:SMTPServerSession;
   public parsedEmailData:any;

    constructor(session:SMTPServerSession){
        this.session = session;
    }

    async parseEmailData(stream:SMTPServerDataStream){
        // create the worker thead

        try{
          this.parsedEmailData = await simpleParser(stream);
        }
        catch(error){
            logger.error({
                function:'parseEmailData',
                messge:'error occured while parsing',
                error,
            });
            throw new Error('error occured while parsing')
        }
      
       
          logger.info({
            session: this.session.id,
            type: "email data",
            data: {...this.parseEmailData},
          });


        return this.parsedEmailData;
    }

    public onConnect(){

    }

}