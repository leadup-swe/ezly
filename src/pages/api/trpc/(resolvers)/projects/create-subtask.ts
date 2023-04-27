import { z } from 'zod';
import { enrolledUserProcedure } from '../../(core)/middleware/enrolled-user-procedure';
import { TRPCError } from '@trpc/server';

export const createSubTask = enrolledUserProcedure
  .input(
    z.object({
      taskId: z.string(),
      name: z.string(),
    }),
  )
  .mutation(async ({ ctx: { prisma, user }, input: { taskId, name } }) => {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: {
        column: { include: { project: { include: { collaborators: { select: { userId: true } } } } } },
      },
    });

    if (!task) throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
    if (!task.column.project.collaborators.some((collaborator) => collaborator.userId === user.id)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not a member of this project',
      });
    }
  });
