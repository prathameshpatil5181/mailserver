import prismaClient from "./prismaSetup";
import { Iinsertdatabase } from "../utils/intefacses";
import { AddressObject } from "mailparser";
import { v4, v3, v5, v1 } from "uuid";


export const formatData = (insertdatabase: Iinsertdatabase)=>{

//   model Ai_mails_info{
//   msg_id String @unique @id 
//   chain_id String 
//   to String[]
//   from String
//   cc String[]
//   bcc String[]
//   subject String
//   in_reply_to String
//   received_date DateTime
//   message_id String
//   created_on DateTime @default(now())
//   @@index(fields:[msg_id,message_id])
// }




}


export const storeMessages = async (insertdatabase: Iinsertdatabase) => {
  //generate the unique id for message
  const msg_id = v4() + "@prathamesh-de.com";

  //generate the unique id for mailchain
  const chain_id = v1() + "chain_id";
  console.group("in storeMessages");
  if (insertdatabase.in_reply_to !== undefined) {
    //find the chain id and then store the data
    return;
  }

  try {
    console.log("to");
  } catch (error) {}
};
