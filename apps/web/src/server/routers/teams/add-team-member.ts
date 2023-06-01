import { enrolledUserProcedure } from 'src/server/core/middleware/enrolled-user-procedure';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const addTeamMember = enrolledUserProcedure
  .input(
    z.object({
      teamId: z.string(),
      userId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input: { teamId, userId } }) => {
    const team = await ctx.prisma.team.findFirst({ where: { id: teamId }, select: { organizationId: true } });
    if (!team) throw new TRPCError({ code: `NOT_FOUND`, message: `Team not found` });

    if (!ctx.organizations.some((org) => org.id === team.organizationId)) {
      throw new TRPCError({ code: `FORBIDDEN`, message: `You are not a member of this organization` });
    }

    const exists = await ctx.prisma.teamMember.findFirst({ where: { AND: [ { teamId, userId } ] }, select: { id: true } });
    if (exists) throw new TRPCError({ code: `BAD_REQUEST`, message: `User is already a member of this team` });

    return ctx.prisma.teamMember.create({ data: { teamId, userId } });
  });
