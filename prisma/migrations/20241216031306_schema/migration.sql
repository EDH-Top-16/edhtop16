-- CreateTable
CREATE TABLE "Tournament" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "TID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tournamentDate" DATETIME NOT NULL,
    "size" INTEGER NOT NULL,
    "swissRounds" INTEGER NOT NULL,
    "topCut" INTEGER NOT NULL,
    "bracketUrl" TEXT
);

-- CreateTable
CREATE TABLE "Player" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "topdeckProfile" TEXT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Commander" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "colorId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Entry" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "tournamentUuid" TEXT NOT NULL,
    "playerUuid" TEXT NOT NULL,
    "commanderUuid" TEXT NOT NULL,
    "standing" INTEGER NOT NULL,
    "decklist" TEXT,
    "winsSwiss" INTEGER NOT NULL,
    "winsBracket" INTEGER NOT NULL,
    "draws" INTEGER NOT NULL,
    "lossesSwiss" INTEGER NOT NULL,
    "lossesBracket" INTEGER NOT NULL,
    CONSTRAINT "Entry_tournamentUuid_fkey" FOREIGN KEY ("tournamentUuid") REFERENCES "Tournament" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entry_playerUuid_fkey" FOREIGN KEY ("playerUuid") REFERENCES "Player" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Entry_commanderUuid_fkey" FOREIGN KEY ("commanderUuid") REFERENCES "Commander" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Card" (
    "uuid" TEXT NOT NULL PRIMARY KEY,
    "oracleId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "DecklistItem" (
    "entryUuid" TEXT NOT NULL,
    "cardUuid" TEXT NOT NULL,

    PRIMARY KEY ("entryUuid", "cardUuid"),
    CONSTRAINT "DecklistItem_entryUuid_fkey" FOREIGN KEY ("entryUuid") REFERENCES "Entry" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DecklistItem_cardUuid_fkey" FOREIGN KEY ("cardUuid") REFERENCES "Card" ("uuid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Tournament_TID_key" ON "Tournament"("TID");

-- CreateIndex
CREATE INDEX "Tournament_TID_idx" ON "Tournament"("TID");

-- CreateIndex
CREATE UNIQUE INDEX "Player_topdeckProfile_key" ON "Player"("topdeckProfile");

-- CreateIndex
CREATE INDEX "Player_topdeckProfile_idx" ON "Player"("topdeckProfile");

-- CreateIndex
CREATE UNIQUE INDEX "Card_oracleId_key" ON "Card"("oracleId");
