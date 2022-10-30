/*
  Warnings:

  - A unique constraint covering the columns `[matchId,puuid]` on the table `Participant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Participant_matchId_puuid_key" ON "Participant"("matchId", "puuid");
