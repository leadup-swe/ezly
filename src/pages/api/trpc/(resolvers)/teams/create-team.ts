import { enrolledUserProcedure } from '@api/core/middleware/enrolled-user-procedure';
import { z } from 'zod';

export const createTeam = enrolledUserProcedure
  .input(
    z.object({
      name: z.string(),
      organizationId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input: { name, organizationId } }) => {
    return ctx.prisma.team.create({
      data: {
        name,
        organizationId,
      },
    });
  });
