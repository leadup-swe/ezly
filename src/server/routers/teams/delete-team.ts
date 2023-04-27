import { enrolledUserProcedure } from 'src/server/core/middleware/enrolled-user-procedure';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const deleteTeam = enrolledUserProcedure
  .input(
    z.object({
      teamId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input: { teamId } }) => {
    const team = await ctx.prisma.team.findFirst({ where: { id: teamId }, select: { organizationId: true } });
    if (!team) throw new TRPCError({ code: `NOT_FOUND`, message: `Team not found` });

    if (!ctx.organizations?.some((org) => org.id === team.organizationId)) {
      throw new TRPCError({ code: `FORBIDDEN`, message: `You are not a member of this organization` });
    }

    return ctx.prisma.team.delete({ where: { id: teamId } });
  });
