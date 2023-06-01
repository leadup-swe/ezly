import { createNextApiHandler } from '@trpc/server/adapters/next';
import { createTRPCCtx } from 'src/server/core/ctx';
import { trpcRouter } from 'src/server/routers';

export default createNextApiHandler({
  router: trpcRouter,
  createContext: createTRPCCtx,
  onError:
    process.env.NODE_ENV === 'development'
      ? ({ path, error }) => {
          console.error(`❌ tRPC failed on ${path ?? '<no-path>'}: ${error.message}`);
        }
      : undefined,
});
