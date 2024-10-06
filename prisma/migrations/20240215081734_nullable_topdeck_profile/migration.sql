-- DropIndex
DROP INDEX "Player_topdeckProfile_key";

-- AlterTable
ALTER TABLE "Player" ALTER COLUMN "topdeckProfile" DROP NOT NULL;
