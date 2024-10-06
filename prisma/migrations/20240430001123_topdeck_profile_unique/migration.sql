/*
  Warnings:

  - You are about to drop the column `size000EntryCount` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size000Top04ConversionRate` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size000Top04Count` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size000Top16ConversionRate` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size000Top16Count` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size064EntryCount` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size064Top04ConversionRate` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size064Top04Count` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size064Top16ConversionRate` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size064Top16Count` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size128EntryCount` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size128Top04ConversionRate` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size128Top04Count` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size128Top16ConversionRate` on the `Commander` table. All the data in the column will be lost.
  - You are about to drop the column `size128Top16Count` on the `Commander` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Entry" DROP CONSTRAINT "Entry_playerUuid_fkey";

-- AlterTable
ALTER TABLE "Commander" DROP COLUMN "size000EntryCount",
DROP COLUMN "size000Top04ConversionRate",
DROP COLUMN "size000Top04Count",
DROP COLUMN "size000Top16ConversionRate",
DROP COLUMN "size000Top16Count",
DROP COLUMN "size064EntryCount",
DROP COLUMN "size064Top04ConversionRate",
DROP COLUMN "size064Top04Count",
DROP COLUMN "size064Top16ConversionRate",
DROP COLUMN "size064Top16Count",
DROP COLUMN "size128EntryCount",
DROP COLUMN "size128Top04ConversionRate",
DROP COLUMN "size128Top04Count",
DROP COLUMN "size128Top16ConversionRate",
DROP COLUMN "size128Top16Count";

-- AlterTable
ALTER TABLE "Entry" ALTER COLUMN "playerUuid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_playerUuid_fkey" FOREIGN KEY ("playerUuid") REFERENCES "Player"("uuid") ON DELETE SET NULL ON UPDATE CASCADE;
