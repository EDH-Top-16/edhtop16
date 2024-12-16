/*
  Warnings:

  - You are about to drop the column `cmc` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `colorId` on the `Card` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Card` table. All the data in the column will be lost.
  - Added the required column `data` to the `Card` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Card" DROP COLUMN "cmc",
DROP COLUMN "colorId",
DROP COLUMN "type",
ADD COLUMN     "data" JSONB NOT NULL;
