import { z } from 'zod';
import { enrolledUserProcedure } from '../../core/middleware/enrolled-user-procedure';
import { TRPCError, inferProcedureOutput } from '@trpc/server';
import { mapUser } from '../../utils/map-user';

export const assignTask = enrolledUserProcedure
  .input(
    z.object({
      taskId: z.string(),
      userId: z.string(),
    }),
  )
  .mutation(async ({ ctx: { prisma, user }, input: { taskId, userId } }) => {
    const task = await prisma.task.findFirst({
      where: { id: taskId },
      select: {
        assignees: { select: { userId: true } },
        column: {
          select: {
            project: {
              select: {
                id: true,
                organizationId: true,
                collaborators: { select: { userId: true } },
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' });
    }

    if (!task.column.project.collaborators.some((c) => c.userId === user.id)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not a member of this project',
      });
    }

    const assignee = (await mapUser(task.column.project.organizationId, [ userId ]))[0];

    if (task.assignees.some((a) => a.userId === userId))
      return {
        ...assignee,
        taskId,
      };

    await prisma.task.update({
      where: { id: taskId },
      data: { assignees: { create: { userId, projectId: task.column.project.id } } },
    });

    return {
      ...assignee,
      taskId,
    };
  });

  export type AssignTaskOuput = inferProcedureOutput<typeof assignTask>;