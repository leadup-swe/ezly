import { enrolledUserProcedure } from '@api/core/middleware/enrolled-user-procedure';
import { inferProcedureInput } from '@trpc/server';
import { z } from 'zod';

export const newJob = enrolledUserProcedure
  .input(
    z.object({
      title: z.string().max(255),
      description: z.string().max(255),
      deadline: z.string().optional(),
      organizationId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    const { title, description, deadline, organizationId } = input;

    return ctx.prisma.job.create({
      data: {
        title,
        description,
        deadline,
        organizationId,
      },
    });
  });

export type NewJobProcedureInput = inferProcedureInput<typeof newJob>;
