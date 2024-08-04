import { Attachment } from "mailparser";
import fs from "fs";
import { globalpath } from "..";
import path from "path";
import { logger } from "..";
require("dotenv").config();
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

//s3 credentials

const s3client = new S3Client({
  region: "ap-south-1",
  credentials: {
    accessKeyId: `${process.env.AWS_ACCESSKEY}`,
    secretAccessKey: `${process.env.AWS_SECRET_ACCESSKEY}`,
  },
});

export class attachmenthandler {
  constructor() {}

  async parseAttachments(attchments: Attachment[]) {
    Promise.all(
      attchments.map(async (attachment) => {
        new Promise((resolve, reject) => {
          try {
            fs.writeFile(
              path.join(
                globalpath,
                "attachments",
                attachment.filename || "gandhi.jpg"
              ),
              attachment.content,
              () => {
                console.log("done writing");
                resolve("success");
              }
            );
          } catch (error) {
            console.log("Error occured while wrting the file");
            console.log(error);
            logger.error({
              function: "parseAttachments",
              messge: `error occured while parsing attachment`,
              detail: attachment,
              error,
            });
            reject("failed");
          }
        });
      })
    )
      .then(() => {
        logger.info({
          type: "success in storing attachment",
        });
      })
      .catch((error) => {
        logger.error({
          function: "parseEmail",
          messge: "error occured while parsing attachments",
          error,
        });
      });
  }

  storeToS3(attchments: Attachment[]) {
    console.log("yet to store in s3");

    Promise.all(
      attchments.map((attachment) => {
        new Promise(async (resolve, reject) => {
          const command = new PutObjectCommand({
            Bucket: "prathamesh-ai-mail",
            Key: `username/${attachment.filename}`,
            Body: attachment.content,
          });
          try {
            s3client
              .send(command)
              .then(async () => {
                const getcommand = new GetObjectCommand({
                  Bucket: "prathamesh-ai-mail",
                  Key: `username/${attachment.filename}`,
                });

                const url = await getSignedUrl(s3client, getcommand);
                console.log("done uploading");
                console.log(url);
                resolve("success");
              })
              .catch((reason) => {
                console.log(reason);
                logger.error({
                  function: "storeToS3",
                  messge: `error occured while uploading attachment`,
                  detail: attachment,
                  error: reason,
                });
              });
          } catch (error) {
            console.log("Error occured while wrting the file");
            console.log(error);
            logger.error({
              function: "storeToS3",
              messge: `error occured while uploading attachment`,
              detail: attachment,
              error,
            });
            reject("failed");
          }
        });
      })
    )
      .then(() => {
        logger.info({
          type: "success in storing attachment",
        });
      })
      .catch((error) => {
        logger.error({
          function: "parseEmail",
          messge: "error occured while storing attachments",
          error,
        });
      });
  }
}
