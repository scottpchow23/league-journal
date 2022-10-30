import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../trpc";
import type { Match } from "./types/matches";

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
    const matches = await Promise.all(
      matchIds.map(async (matchId) => {
        const res = await fetch(
          matchBaseUrl + `/${matchId}?api_key=${process.env.RIOT_API_KEY}`
        );
        if (res.status !== 200) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }
        return (await res.json()) as Match;
      })
    );
    return matches;
  }),
});
