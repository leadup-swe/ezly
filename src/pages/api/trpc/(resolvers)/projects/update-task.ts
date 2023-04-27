import { z } from 'zod';
import { enrolledUserProcedure } from '../../(core)/middleware/enrolled-user-procedure';
import { TRPCError } from '@trpc/server';
import { brotliCompressSync } from 'zlib';

export const updateTask = enrolledUserProcedure
  .input(
    z.object({
      taskId: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
    }),
  )
  .mutation(async ({ ctx: { prisma, user }, input: { taskId, title, description } }) => {
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          select: {
            project: {
              select: { collaborators: { select: { userId: true } } },
            },
          },
        },
      },
    });

    if (!task) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
    }

    if (!task.column.project.collaborators.some((collaborator) => collaborator.userId === user.id)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not a member of this project',
      });
    }

    const compactedDescription = description ? brotliCompressSync(description).toString('base64') : null;

    return prisma.task.update({
      where: { id: taskId },
      data: { title, description: description ? compactedDescription : undefined },
    });
  });
