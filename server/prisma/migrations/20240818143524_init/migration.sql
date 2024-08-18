/*
  Warnings:

  - The `refrences` column on the `mail_body` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Ai_mails_info" ALTER COLUMN "to" SET DATA TYPE TEXT,
ALTER COLUMN "cc" SET DATA TYPE TEXT,
ALTER COLUMN "bcc" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "mail_body" DROP COLUMN "refrences",
ADD COLUMN     "refrences" TEXT[];
