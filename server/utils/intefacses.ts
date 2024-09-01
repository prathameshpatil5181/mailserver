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
  messageId: string | undefined;
  attachmentUrl: string[] | null;
}

export interface IparsedEmail {
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
  messageId: string | undefined;
  attachmentUrl: string[] | null;
}

export interface IreturnEmails {
  from: string;
  to: string;
  cc: string;
  subject: string;
  msg_id: string;
  chain_id: string;
}

export interface IformattedEmail {
  msg_id: string;
  user_ids: string[];
  to: string | null;
  from: string;
  cc: string | null;
  bcc: string | null;
  subject: string | null;
  in_reply_to: string | null;
  received_date: Date;
  refrences: string[];
  isbody: boolean;
  htmlBody: string;
  textBody: string;
  textAsHtml: string;
  attachments: string[];
  isattachement: boolean;
  messageId: string;
}

// Interface for Ai_mails_info schema
export interface IAiMailsInfo {
  msg_id: string;
  chain_id: string;
  user_ids: string[];
  to?: string | null;
  from: string;
  cc?: string | null;
  bcc?: string | null;
  subject: string;
  in_reply_to: string;
  received_date: Date;
  message_id: string;
  created_on: Date;
}

// Interface for mail_body schema
export interface IMailBody {
  msg_id: string;
  chain_id: string;
  in_reply_to: string;
  refrences: string[];
  htmlBody: string;
  textBody: string;
  textAsHtml: string;
  attachments: string[];
  created_on: Date;
}

// Interface for test_table schema
export interface ITestTable {
  id: string;
  jsonobject: object; // or specific type for the JSON structure
}
