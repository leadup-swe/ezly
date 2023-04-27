import { enrolledUserProcedure } from 'src/server/core/middleware/enrolled-user-procedure';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const addCollaborator = enrolledUserProcedure
  .input(
    z.object({
      projectId: z.string(),
      userId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input: { projectId, userId } }) => {
    const project = await ctx.prisma.project.findFirst({ where: { id: projectId }, select: { id: true } });
    if (!project) throw new TRPCError({ code: `NOT_FOUND`, message: `Project not found` });

    const exists = await ctx.prisma.projectCollaborator.findFirst({ where: { AND: [ { projectId, userId } ] }, select: { id: true } });
    if (exists) throw new TRPCError({ code: `BAD_REQUEST`, message: `User is already a collaborator` });

    return ctx.prisma.projectCollaborator.create({ data: { projectId, userId } });
  });
