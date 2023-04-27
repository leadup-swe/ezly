import { z } from 'zod';
import { enrolledUserProcedure } from '../../(core)/middleware/enrolled-user-procedure';
import { TRPCError } from '@trpc/server';

export const updateProjectName = enrolledUserProcedure
  .input(
    z.object({
      projectId: z.string(),
      name: z.string(),
    }),
  )
  .mutation(async ({ ctx: { prisma, user }, input: { projectId, name } }) => {
    const project = await prisma.project.findUnique({ where: { id: projectId }, select: { collaborators: { select: { userId: true } } } });

    if (!project) {
      throw new TRPCError({ code: `NOT_FOUND`, message: `Project not found` });
    }

    if (!project.collaborators.some((c) => c.userId === user.id)) {
      throw new TRPCError({ code: `FORBIDDEN`, message: `You are not a collaborator of this project` });
    }

    return prisma.project.update({ where: { id: projectId }, data: { title: name } });
  });
