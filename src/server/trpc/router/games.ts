import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import type { Match as RiotMatch } from "./types/matches";

type MatchesResponse = string[];

const matchBaseUrl = `https://americas.api.riotgames.com/lol/match/v5/matches`;

export const gamesRouter = router({
  loadGames: protectedProcedure.query(async (req) => {
    const summoner = await req.ctx.prisma.summoner.findFirst({
      where: {
        user: {
          id: req.ctx.session.user.id,
        },
      },
    });
    if (!summoner) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }
    const matchesResponse = await fetch(
      matchBaseUrl +
        `/by-puuid/${summoner.puuid}/ids?api_key=${process.env.RIOT_API_KEY}&start=0&count=2`
    );
    if (matchesResponse.status !== 200) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
    const matchIds = (await matchesResponse.json()) as MatchesResponse;
    const existingMatches = await req.ctx.prisma.match.findMany({
      where: {
        id: {
          in: matchIds,
        },
      },
      include: {
        participants: true,
      },
    });
    const newMatchIds = matchIds.filter((id) =>
      existingMatches.every((match) => match.id !== id)
    );
    const newRiotMatches = await Promise.all(
      newMatchIds.map(async (matchId) => {
        const res = await fetch(
          matchBaseUrl + `/${matchId}?api_key=${process.env.RIOT_API_KEY}`
        );
        if (res.status !== 200) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
        return (await res.json()) as RiotMatch;
      })
    );
    const newMatches = await Promise.all(
      newRiotMatches.map(async (riotMatch) => {
        const matchId = riotMatch.metadata.matchId;
        const matchData = {
          id: matchId,
          dataVersion: riotMatch.metadata.dataVersion,
          ...riotMatch.info,
          participants: undefined,
          teams: undefined,
        };
        const participantsData = (riotMatch.info.participants || []).map(
          (participant) => ({
            ...participant,
            matchId,
            participantId: undefined,
            perks: undefined,
            challenges: undefined,
          })
        );
        await req.ctx.prisma.match.upsert({
          where: {
            id: matchId,
          },
          update: {},
          create: matchData,
        });
        await Promise.all(
          participantsData.map(
            async (participantDatum) =>
              await req.ctx.prisma.participant.upsert({
                where: {
                  matchId_puuid: {
                    matchId,
                    puuid: participantDatum.puuid,
                  },
                },
                update: {},
                create: participantDatum,
              })
          )
        );

        const match = await req.ctx.prisma.match.findUnique({
          where: {
            id: matchId,
          },
          include: {
            participants: true,
          },
        });

        return match;
      })
    );

    return [...newMatches, ...existingMatches];
  }),
});
