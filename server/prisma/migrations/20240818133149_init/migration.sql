/*
  Warnings:

  - The `to` column on the `Ai_mails_info` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `cc` column on the `Ai_mails_info` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `bcc` column on the `Ai_mails_info` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `refrences` column on the `mail_body` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Ai_mails_info" DROP COLUMN "to",
ADD COLUMN     "to" JSONB,
DROP COLUMN "cc",
ADD COLUMN     "cc" JSONB,
DROP COLUMN "bcc",
ADD COLUMN     "bcc" JSONB;

-- AlterTable
ALTER TABLE "mail_body" DROP COLUMN "refrences",
ADD COLUMN     "refrences" JSONB;
