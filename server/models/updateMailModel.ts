import prismaClient from "./prismaSetup";
import { Iinsertdatabase } from "../utils/intefacses";
import { AddressObject, EmailAddress } from "mailparser";
import { v4, v3, v5, v1 } from "uuid";
import { logger } from "..";
import { add } from "winston";

interface IformatData {
  user_ids: string[];
  to: string[]; //
  from: string ;
  cc: string[]; //
  bcc: string[]; //
  subject: string | null;
  received_date: Date;
  in_reply_to: string | null;
  refrences?: string[];
  isbody: boolean;
  htmlBody: string;
  textBody: string;
  textAsHtml: string;
  isattachement: boolean;
  message_id:string;
  attachmentUrl: string[] | null;
}

export const formatData = (insertdatabase: Iinsertdatabase): IformatData => {
  //   model Ai_mails_info{
  //   msg_id String @unique @id
  //   chain_id String
  // user_ids String[]
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

  // cc bcc and to converter function
  const converToString = (
    convert: AddressObject | AddressObject[] | undefined
  ): string[] => {
    console.log(Array.isArray(convert));

    let convertedString: string[];

    //this might nevet get invoked beacause convert is never AddressObject[]
    if (Array.isArray(convert) && convert != undefined) {
      // converting to value to array of strings containing vlues and names;

      convertedString = convert.map((x) => {
        return JSON.stringify(x.value);
      });

      return convertedString;
    }
    //not a array

    if (convert !== undefined) {
      convertedString = convert.value.map<string>((x): string => {
        if (x !== undefined) {
          return JSON.stringify(x);
        }
        return '{"address":"","name":""}';
      });
      return convertedString;
    } else {
      convertedString = ['{"address":"","name":""}'];
      return convertedString;
    }
  };
  // cc bcc and to converter function ends

  // format from function

  function isEmailAddress(object: any): object is EmailAddress[] {
    return true;
  }

  const fromformatter = (
    fromEmail: EmailAddress[] | undefined
  ): string  => {
    //console.log(from.email);
    console.log("from part");
    console.log(fromEmail);

    if (isEmailAddress(fromEmail) && fromEmail !== undefined) {
      return fromEmail.map((emailObject) => {
        return JSON.stringify(emailObject);
      })[0];
    } else {
      console.log("undefinded");
      return '{"address":"","name":""}';
    }
  };

  //useid  handelers

  function isAddressArray(to:any):to is  AddressObject[]{
    return true
  }

  function handleAddressObject(to:AddressObject):string[]{
    let ids = to.value.filter(address=>address.address?.split('@')[1]==='prathamesh-de.com');
    return ids.map(x=>x.address) && [''];
  }

  const handleuserIds = (to: AddressObject | AddressObject[] | undefined):string[] => {

    let userIds:string[] = [];

    if(to===undefined){
      return [''];
    }
    else if(isAddressArray(to)){
      const addressarray = to.map(x=>handleAddressObject(x));

      for(let i=0;i<addressarray.length;i++){
        for(let j=0;j<addressarray[0].length;j++){
          userIds.push(addressarray[i][i]);
        }
      }

    }
    else{
      userIds = handleAddressObject(to);
    }
    
      return userIds;

  };


  return {
    user_ids: handleuserIds(insertdatabase.to), //lets put email ids here
    to: converToString(insertdatabase.to), //
    from: fromformatter(insertdatabase.from),
    cc: converToString(insertdatabase.cc), //
    bcc: converToString(insertdatabase.cc), //
    subject:
      insertdatabase.subject !== undefined ? insertdatabase.subject : null,
    received_date:
      insertdatabase.received_date !== undefined
        ? insertdatabase.received_date
        : new Date(),
    in_reply_to:
      insertdatabase.in_reply_to !== undefined
        ? insertdatabase.in_reply_to
        : null,
    refrences: ["", ""], //
    isbody: insertdatabase.htmlBody === false ? false : true,
    htmlBody: insertdatabase.htmlBody === false ? "" : insertdatabase.htmlBody,
    textBody:
      insertdatabase.textBody === undefined ? "" : insertdatabase.textBody,
    textAsHtml:
      insertdatabase.textAsHtml === undefined ? "" : insertdatabase.textAsHtml,
    isattachement: insertdatabase.attachmentUrl !== null ? true : false,
    message_id:insertdatabase.messageId ||'',
    attachmentUrl: insertdatabase.attachmentUrl,
  };
};

export const storeMessages = async (insertdatabase: Iinsertdatabase) => {
  //generate the unique id for message
  const msg_id = v4() + "@prathamesh-de.com";

  //generate the unique id for mailchain
  const chain_id = v1() + "chain_id";

  const formattedData: IformatData = formatData(insertdatabase);

  if (insertdatabase.in_reply_to !== undefined) {
    //find the chain id and then store the data

    

    return;
  }

  try {
    const result = await prismaClient.ai_mails_info.create({
      data:{
        msg_id:msg_id,
        chain_id:chain_id,
        user_ids:formattedData.user_ids,
        to:formattedData.to,
        cc:formattedData.cc,
        bcc:formattedData.bcc,
        subject :formattedData.subject || '',
        in_reply_to: formattedData.in_reply_to || '',
        received_date:formattedData.received_date,
        message_id:formattedData.message_id,
        from:formattedData.from
      }
    })
    console.log(result);
  } catch (error) {
    logger.info({
      function: "storeMessages",
      error
    });
  }
};
