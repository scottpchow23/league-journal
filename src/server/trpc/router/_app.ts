import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { accountRouter } from "./account";
import { gamesRouter } from "./games";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  getAccount: accountRouter,
  games: gamesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
