/*
  Warnings:

  - You are about to drop the column `revisionDate` on the `Summoner` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Summoner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "summonerLevel" INTEGER NOT NULL,
    "profileIconId" INTEGER NOT NULL,
    "accountId" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Summoner_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Summoner" ("accountId", "id", "name", "profileIconId", "puuid", "summonerLevel", "userId") SELECT "accountId", "id", "name", "profileIconId", "puuid", "summonerLevel", "userId" FROM "Summoner";
DROP TABLE "Summoner";
ALTER TABLE "new_Summoner" RENAME TO "Summoner";
CREATE UNIQUE INDEX "Summoner_userId_key" ON "Summoner"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
