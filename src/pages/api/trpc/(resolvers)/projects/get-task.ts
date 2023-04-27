import { z } from 'zod';
import { enrolledUserProcedure } from '../../(core)/middleware/enrolled-user-procedure';
import { TRPCError, inferProcedureOutput } from '@trpc/server';
import { mapUserIdsToUserObjects } from '../../(utils)/mapUserIdsToUserObject';
import { brotliDecompressSync } from 'zlib';

export const getTask = enrolledUserProcedure
  .input(
    z.object({
      taskId: z.string(),
    }),
  )
  .query(async ({ ctx, input: { taskId } }) => {
    const task = await ctx.boostedPrisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: { select: { userId: true } },
        column: {
          select: {
            project: {
              select: {
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

    if (!task.column.project.collaborators.some((collaborator) => collaborator.userId === ctx.user.id)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not a member of this project',
      });
    }

    const assignees = await mapUserIdsToUserObjects(
      task.column.project.organizationId,
      task.assignees.map((a) => a.userId),
    );

    const { column, ...taskData } = task;
    const description = taskData.description ? brotliDecompressSync(Buffer.from(taskData.description, 'base64')).toString('utf-8') : null;

    const dto = {
      ...taskData,
      description,
      assignees,
    };

    return dto;
  });

export type GetTaskOutput = inferProcedureOutput<typeof getTask>;
