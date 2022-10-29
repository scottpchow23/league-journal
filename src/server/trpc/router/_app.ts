import { router } from "../trpc";
import { authRouter } from "./auth";
import { exampleRouter } from "./example";
import { accountRouter } from "./getAccount";

export const appRouter = router({
  example: exampleRouter,
  auth: authRouter,
  getAccount: accountRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
