-- CreateTable
CREATE TABLE "Tournament" (
    "uuid" UUID NOT NULL,
    "TID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tournamentDate" TIMESTAMP(3) NOT NULL,
    "size" INTEGER NOT NULL,
    "swissRounds" INTEGER NOT NULL,
    "topCut" INTEGER NOT NULL,

    CONSTRAINT "Tournament_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Player" (
    "uuid" UUID NOT NULL,
    "topdeckProfile" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Commander" (
    "uuid" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "colorId" TEXT NOT NULL,

    CONSTRAINT "Commander_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Entry" (
    "uuid" UUID NOT NULL,
    "tournamentId" UUID NOT NULL,
    "playerId" UUID NOT NULL,
    "commanderId" UUID NOT NULL,
    "standing" INTEGER NOT NULL,
    "decklist" TEXT NOT NULL,
    "winsSwiss" INTEGER NOT NULL,
    "winsBracket" INTEGER NOT NULL,
    "draws" INTEGER NOT NULL,
    "lossesSwiss" INTEGER NOT NULL,
    "lossesBracket" INTEGER NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("uuid")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_TID_key" ON "Tournament"("TID");

-- CreateIndex
CREATE UNIQUE INDEX "Player_topdeckProfile_key" ON "Player"("topdeckProfile");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_commanderId_fkey" FOREIGN KEY ("commanderId") REFERENCES "Commander"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;
