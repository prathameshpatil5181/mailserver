import { AddressObject, EmailAddress } from "mailparser";

export interface Iinsertdatabase {
  to: AddressObject | AddressObject[] | undefined;
  from: EmailAddress[] | undefined;
  cc: AddressObject | AddressObject[] | undefined;
  bcc: AddressObject | AddressObject[] | undefined;
  subject: string | undefined;
  received_date: Date | undefined;
  in_reply_to: string | undefined;
  refrences?: string[] | string | undefined;
  htmlBody: string | false;
  textBody: string | undefined;
  textAsHtml: string | undefined;
  attachmentUrl:string[]|null;
}
