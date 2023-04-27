import { enrolledUserProcedure } from 'src/server/core/middleware/enrolled-user-procedure';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const removeTeamMember = enrolledUserProcedure
  .input(
    z.object({
      teamId: z.string(),
      userId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input: { teamId, userId } }) => {
    const target = await ctx.prisma.teamMember.findFirst({
      where: { AND: [ { teamId, userId } ] },
      select: { id: true, team: { select: { organizationId: true } } },
    });
    if (!target) throw new TRPCError({ code: `BAD_REQUEST`, message: `User is not a member of this team` });

    if (ctx.organizations.some((org) => org.id === target.team.organizationId))
      throw new TRPCError({ code: `FORBIDDEN`, message: `You are not a member of this organization` });

    return ctx.prisma.teamMember.delete({ where: { id: target.id } });
  });
