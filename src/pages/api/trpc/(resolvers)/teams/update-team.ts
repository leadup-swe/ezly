import { enrolledUserProcedure } from '@api/core/middleware/enrolled-user-procedure';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const updateTeam = enrolledUserProcedure
  .input(
    z.object({
      id: z.string(),
      name: z.string(),
    }),
  )
  .mutation(async ({ ctx, input: { name, id } }) => {
    const team = await ctx.prisma.team.findFirst({ where: { id }, select: { organizationId: true } });
    if (!team) throw new TRPCError({ code: `NOT_FOUND`, message: `Team not found` });

    if (!ctx.organizations?.some((org) => org.id === team.organizationId)) {
      throw new TRPCError({ code: `FORBIDDEN`, message: `You are not a member of this organization` });
    }

    return ctx.prisma.team.update({ where: { id }, data: { name } });
  });
