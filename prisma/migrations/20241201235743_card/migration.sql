/*
  Warnings:

  - Made the column `playerUuid` on table `Entry` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_playerUuid_fkey";

-- AlterTable
ALTER TABLE "Entry" ALTER COLUMN "playerUuid" SET NOT NULL;

-- CreateTable
CREATE TABLE "Card" (
    "uuid" UUID NOT NULL,
    "oracleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cmc" INTEGER NOT NULL,
    "colorId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "DecklistItem" (
    "entryUuid" UUID NOT NULL,
    "cardUuid" UUID NOT NULL,

    CONSTRAINT "DecklistItem_pkey" PRIMARY KEY ("entryUuid","cardUuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_oracleId_key" ON "Card"("oracleId");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_playerUuid_fkey" FOREIGN KEY ("playerUuid") REFERENCES "Player"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecklistItem" ADD CONSTRAINT "DecklistItem_entryUuid_fkey" FOREIGN KEY ("entryUuid") REFERENCES "Entry"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DecklistItem" ADD CONSTRAINT "DecklistItem_cardUuid_fkey" FOREIGN KEY ("cardUuid") REFERENCES "Card"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
