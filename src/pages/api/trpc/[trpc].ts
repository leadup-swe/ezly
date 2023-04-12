import * as trpcNext from '@trpc/server/adapters/next';
import { createContext } from './(core)/ctx';
import { trpcServer } from './(core)/trpc-server';
import { resolvers } from './(resolvers)';

const trpcRouter = trpcServer.router(resolvers);

export type TRPCRouter = typeof trpcRouter;

export default trpcNext.createNextApiHandler({
  router: trpcRouter,
  createContext,
});
