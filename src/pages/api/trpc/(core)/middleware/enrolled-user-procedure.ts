import { trpcServer } from '../trpc-server';
import { TRPCError } from '@trpc/server';
import type { Organization, User } from '@clerk/nextjs/api';
import { z } from 'zod';

const inputSchema = z.object({ organizationId: z.string().optional() });

const guard = trpcServer.middleware(async ({ ctx, rawInput, next }) => {
  if (!ctx.user) {
    throw new TRPCError({ code: `UNAUTHORIZED`, message: `You are not authorized to access this resource` });
  }
  if (!ctx.organizations) {
    throw new TRPCError({ code: `FORBIDDEN`, message: `You are not a member of any organizations` });
  }

  const input = inputSchema.safeParse(rawInput);
  if (input.success && input.data.organizationId) {
    if (!ctx.organizations.some((org) => org.organization.id === input.data.organizationId)) {
      throw new TRPCError({ code: `FORBIDDEN`, message: `You are not a member of this organization` });
    }
  }

  return next({ ctx: { user: ctx.user as User, organizations: ctx.organizations.map((org) => org.organization) as Organization[] } });
});

export const enrolledUserProcedure = trpcServer.procedure.use(guard);
