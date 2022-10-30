import { z } from "zod";
import { router, protectedProcedure } from "../trpc";

type AccountByNameResponse = {
  id?: string;
  accountId: string;
  puuid: string;
  name: string;
  profileIconId: number;
  revisionDate?: number;
  summonerLevel: number;
};

export const accountRouter = router({
  getAccount: protectedProcedure.query(async (req) => {
    const summoner = req.ctx.prisma.summoner.findFirst({
      where: {
        user: {
          id: req.ctx.session.user.id,
        },
      },
    });

    return summoner;
  }),
  upsertSummonerByName: protectedProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async (req) => {
      const res = await fetch(
        `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${req.input.name}?api_key=${process.env.RIOT_API_KEY}`
      );
      const body = (await res.json()) as AccountByNameResponse;
      delete body.id;
      delete body.revisionDate;

      return req.ctx.prisma.summoner.upsert({
        where: {
          userId: req.ctx.session.user.id,
        },
        update: {
          ...body,
          id: undefined,
        },
        create: {
          ...body,
          id: undefined,
          user: {
            connect: {
              id: req.ctx.session.user.id,
            },
          },
        },
      });
    }),
});
