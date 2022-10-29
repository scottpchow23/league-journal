import { router, protectedProcedure } from "../trpc";

export const accountRouter = router({
  getAccount: protectedProcedure.query(() => {
    return "this should be the response from riot api";
  }),
});
