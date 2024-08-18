-- AddForeignKey
ALTER TABLE "Ai_mails_info" ADD CONSTRAINT "Ai_mails_info_msg_id_fkey" FOREIGN KEY ("msg_id") REFERENCES "mail_body"("msg_id") ON DELETE RESTRICT ON UPDATE CASCADE;
