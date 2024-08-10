
export interface EmailAddress {
  /**
   * The email address.
   */
  address?: string | undefined;
  /**
   * The name part of the email/group.
   */
  name: string;
  /**
   * An array of grouped addresses.
   */
  group?: EmailAddress[] | undefined;
}

/**
 * Address object.
 */
export interface AddressObject {
  /**
   * An array with address details.
   */
  value: EmailAddress[];
  /**
   * A formatted address string for HTML context.
   */
  html: string;
  /**
   * A formatted address string for plaintext context.
   */
  text: string;
}


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
  attachmentUrl: string[] | null;
}


