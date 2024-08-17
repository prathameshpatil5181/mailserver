-- DropIndex
DROP INDEX "Ai_mails_info_msg_id_message_id_idx";

-- DropIndex
DROP INDEX "mail_body_msg_id_chain_id_idx";

-- CreateIndex
CREATE INDEX "Ai_mails_info_received_date_message_id_idx" ON "Ai_mails_info"("received_date" DESC, "message_id");

-- CreateIndex
CREATE INDEX "mail_body_created_on_chain_id_idx" ON "mail_body"("created_on" DESC, "chain_id");
