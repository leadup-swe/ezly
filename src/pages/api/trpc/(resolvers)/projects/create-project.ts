import { enrolledUserProcedure } from '@api/core/middleware/enrolled-user-procedure';
import { Visibility } from '@prisma/client';
import { inferProcedureInput } from '@trpc/server';
import { z } from 'zod';

export const createProject = enrolledUserProcedure
  .input(
    z.object({
      title: z.string(),
      organizationId: z.string(),
      description: z.string().optional(),
      visibility: z.enum([ Visibility.PUBLIC, Visibility.PRIVATE ]).optional(),
    }),
  )
  .mutation(async ({ ctx: { prisma, user }, input: { title, description, organizationId, visibility } }) => {
    return prisma.project.create({ data: { title, description: description, organizationId, visibility, collaborators: { create: { userId: user.id } } } });
  });

export type CreateProjectInput = inferProcedureInput<typeof createProject>;
