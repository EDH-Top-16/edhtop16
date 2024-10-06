/*
  Warnings:

  - A unique constraint covering the columns `[topdeckProfile]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_topdeckProfile_key" ON "Player"("topdeckProfile");
