-- CreateTable
CREATE TABLE "test_table" (
    "id" TEXT NOT NULL,
    "jsonobject" JSONB NOT NULL,

    CONSTRAINT "test_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_table_id_key" ON "test_table"("id");
