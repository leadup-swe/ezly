import { prisma } from './prisma';
import { CreateNextContextOptions } from '@trpc/server/dist/adapters/next';
import { inferAsyncReturnType } from '@trpc/server';
import { getUser } from '../utils/get-user';

const createInnerTRPCCtx = async ({ req, res }: CreateNextContextOptions) => {
  const { user, organizations } = await getUser(req);

  return {
    req,
    res,
    prisma,
    boostedPrisma: prisma,
    user,
    organizations,
  };
};

export const createTRPCCtx = (ctx: CreateNextContextOptions) => {
  return createInnerTRPCCtx(ctx);
};

export type TCtx = inferAsyncReturnType<typeof createTRPCCtx>;
