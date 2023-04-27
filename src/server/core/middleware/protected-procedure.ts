import { TRPCError } from '@trpc/server';
import type { User } from '@clerk/nextjs/api';
import { middleware, procedure } from 'src/server/trpc';

const guard = middleware(async ({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: `UNAUTHORIZED`, message: `You are not authorized to access this resource` });
  }
  return next({ ctx: { user: ctx.user as User } });
});

export const protectedProcedure = procedure.use(guard);
