-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "authId" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUpdated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "credentials_id_key" ON "credentials"("id");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_authId_key" ON "credentials"("authId");

-- CreateIndex
CREATE INDEX "credentials_authId_idx" ON "credentials"("authId" DESC);
