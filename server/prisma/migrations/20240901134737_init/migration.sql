-- DropForeignKey
ALTER TABLE "Ai_mails_info" DROP CONSTRAINT "Ai_mails_info_msg_id_fkey";

-- AlterTable
ALTER TABLE "Ai_mails_info" ALTER COLUMN "subject" DROP NOT NULL,
ALTER COLUMN "in_reply_to" DROP NOT NULL;

-- AlterTable
ALTER TABLE "mail_body" ALTER COLUMN "in_reply_to" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "mail_body" ADD CONSTRAINT "mail_body_msg_id_fkey" FOREIGN KEY ("msg_id") REFERENCES "Ai_mails_info"("msg_id") ON DELETE RESTRICT ON UPDATE CASCADE;
