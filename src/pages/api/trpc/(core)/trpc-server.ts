import { initTRPC } from '@trpc/server';
import { TCtx } from './ctx';

export const trpcServer = initTRPC.context<TCtx>().create();
