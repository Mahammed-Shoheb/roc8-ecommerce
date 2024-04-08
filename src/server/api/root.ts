import { userRouter } from "~/server/api/routers/user";
import {
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
} from "~/server/api/trpc";
import { categoriesRouter } from "./routers/categories";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  categories: categoriesRouter,
});

export const createCaller = createCallerFactory(appRouter);

export const createAsyncCaller = async () => {
  const context = await createTRPCContext();
  return createCaller(context);
};

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.user.all();
 *       ^? user[]
 */
