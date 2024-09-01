import { logger } from "..";
import { AddressObject, EmailAddress } from "mailparser";
import {
  IAiMailsInfo,
  IformattedEmail,
  IparsedEmail,
} from "../utils/intefacses";
import { emaildomain } from "../utils/utilityVariables";
import { v1, v4 } from "uuid";
import chainId from "../models/chainId";

export class FormatEmailClass {
  private rawEmail: IparsedEmail;
  private formattedEmail: IformattedEmail;
  private chain_id: string | null = null;
  public msg_id: string;

  constructor(data: IparsedEmail) {
    this.msg_id = v4() + emaildomain;
    this.rawEmail = data;
    this.formattedEmail = this.formatRawEmail(this.rawEmail);
    console.log(this.formattedEmail);
  }

  private formatRawEmail(rawEmailparam: IparsedEmail): IformattedEmail {
    const converToString = (
      convert: AddressObject | AddressObject[] | undefined
    ): string => {
      if (convert === undefined) {
        return JSON.stringify("");
      } else {
        return JSON.stringify(convert);
      }
    };
    // cc bcc and to converter to string function ends
    const fromformatter = (fromEmail: EmailAddress[] | undefined): string => {
      //console.log(from.email);
      console.log("from part");
      console.log(fromEmail);

      if (fromEmail !== undefined) {
        return fromEmail.map((emailObject) => {
          return JSON.stringify(emailObject);
        })[0];
      } else {
        console.log("undefinded");
        return JSON.stringify("");
      }
    };

    //referances handler
    const handleReferances = (
      refrances: string[] | string | undefined
    ): string[] => {
      if (refrances === undefined) {
        return [];
      }
      if (typeof refrances === "string") {
        return [refrances];
      } else {
        return refrances;
      }
    };

    //useid  handelers

    // userId converter

    const handleuserIds = (
      to: AddressObject | AddressObject[] | undefined
    ): string[] => {
      let userIds: string[] = [];

      // This runs if the value property in address object is array
      function handleAddressObject(to: AddressObject): string[] {
        let EmailAddressIds = to.value.filter(
          (address) => address.address?.split("@")[1] === emaildomain
        );
        // console.log("ids are");
        // console.log(ids);

        return EmailAddressIds.map((value) => value.address).filter(
          (address) => address !== undefined
        );
      }

      if (to === undefined) {
        return [""];
      } else if (Array.isArray(to) === true) {
        const addressarray = to.map((x) => handleAddressObject(x));

        for (let i = 0; i < addressarray.length; i++) {
          for (let j = 0; j < addressarray[0].length; j++) {
            userIds.push(addressarray[i][i]);
          }
        }
      } else {
        userIds = handleAddressObject(to);
      }

      return userIds;
    };

    const toStringfyMethod = <T>(convertData: T): string | null => {
      if (convertData === null || convertData === undefined) {
        return null;
      }

      return JSON.stringify(convertData);
    };

    const toStringfyMethodString = <T>(convertData: T): string => {
      if (convertData === null || convertData === undefined) {
        return JSON.stringify("");
      }

      return JSON.stringify(convertData);
    };

    return {
      msg_id: this.msg_id,
      user_ids: handleuserIds(rawEmailparam.to), //lets put email ids here
      to: converToString(rawEmailparam.to), //
      from: fromformatter(rawEmailparam.from),
      cc: converToString(rawEmailparam.cc), //
      bcc: converToString(rawEmailparam.bcc), //
      subject: toStringfyMethod(rawEmailparam.subject),
      received_date:
        rawEmailparam.received_date !== undefined
          ? rawEmailparam.received_date
          : new Date(),
      in_reply_to: toStringfyMethod(rawEmailparam.in_reply_to),
      refrences: handleReferances(rawEmailparam.refrences), //
      isbody: rawEmailparam.htmlBody === false ? false : true,
      htmlBody: toStringfyMethodString(rawEmailparam.htmlBody),
      textBody: toStringfyMethodString(rawEmailparam.textBody),
      textAsHtml: toStringfyMethodString(rawEmailparam.textAsHtml),
      isattachement: rawEmailparam.attachmentUrl !== null ? true : false,
      messageId: rawEmailparam.messageId || "",
      attachments: rawEmailparam.attachmentUrl || [],
    };
  }

  get GetformattedEmail() {
    return this.formattedEmail;
  }
  get GetRawEmail() {
    return this.rawEmail;
  }

  public async getChainId(): Promise<string> {
    if (this.chain_id === null) {
      if (this.formattedEmail.in_reply_to === null) {
        this.chain_id = v1() + "_chain_id";
      } else {
        this.chain_id = await chainId(this.formattedEmail.in_reply_to);
      }
    }
    return this.chain_id;
  }
}
