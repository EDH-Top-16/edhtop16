/*
  Warnings:

  - You are about to drop the column `commanderId` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `playerId` on the `Entry` table. All the data in the column will be lost.
  - You are about to drop the column `tournamentId` on the `Entry` table. All the data in the column will be lost.
  - Added the required column `commanderUuid` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `playerUuid` to the `Entry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentUuid` to the `Entry` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_commanderId_fkey";

-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_playerId_fkey";

-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_tournamentId_fkey";

-- AlterTable
ALTER TABLE "Entry" DROP COLUMN "commanderId",
DROP COLUMN "playerId",
DROP COLUMN "tournamentId",
ADD COLUMN     "commanderUuid" UUID NOT NULL,
ADD COLUMN     "playerUuid" UUID NOT NULL,
ADD COLUMN     "tournamentUuid" UUID NOT NULL,
ALTER COLUMN "decklist" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_tournamentUuid_fkey" FOREIGN KEY ("tournamentUuid") REFERENCES "Tournament"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_playerUuid_fkey" FOREIGN KEY ("playerUuid") REFERENCES "Player"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_commanderUuid_fkey" FOREIGN KEY ("commanderUuid") REFERENCES "Commander"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
