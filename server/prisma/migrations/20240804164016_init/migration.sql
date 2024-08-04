-- CreateTable
CREATE TABLE "USER" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email_id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "USER_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ai_mails_info" (
    "msg_id" TEXT NOT NULL,
    "chain_id" TEXT NOT NULL,
    "to" TEXT[],
    "from" TEXT NOT NULL,
    "cc" TEXT[],
    "bcc" TEXT[],
    "subject" TEXT NOT NULL,
    "in_reply_to" TEXT NOT NULL,
    "received_date" TIMESTAMP(3) NOT NULL,
    "message_id" TEXT NOT NULL,
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ai_mails_info_pkey" PRIMARY KEY ("msg_id")
);

-- CreateTable
CREATE TABLE "mail_body" (
    "msg_id" TEXT NOT NULL,
    "chain_id" TEXT NOT NULL,
    "in_reply_to" TEXT NOT NULL,
    "refrences" TEXT[],
    "htmlBody" TEXT NOT NULL,
    "textBody" TEXT NOT NULL,
    "textAsHtml" TEXT NOT NULL,
    "attachments" TEXT[],
    "created_on" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mail_body_pkey" PRIMARY KEY ("msg_id")
);

-- CreateIndex
CREATE INDEX "USER_email_id_idx" ON "USER"("email_id" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Ai_mails_info_msg_id_key" ON "Ai_mails_info"("msg_id");

-- CreateIndex
CREATE INDEX "Ai_mails_info_msg_id_message_id_idx" ON "Ai_mails_info"("msg_id", "message_id");

-- CreateIndex
CREATE UNIQUE INDEX "mail_body_msg_id_key" ON "mail_body"("msg_id");

-- CreateIndex
CREATE INDEX "mail_body_msg_id_chain_id_idx" ON "mail_body"("msg_id" DESC, "chain_id");
