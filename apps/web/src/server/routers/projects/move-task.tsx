import { z } from 'zod';
import { enrolledUserProcedure } from '../../core/middleware/enrolled-user-procedure';
import { TRPCError } from '@trpc/server';
import { move } from 'src/utils/move';

export const moveTask = enrolledUserProcedure
  .input(
    z.object({
      projectId: z.string(),
      sourceColumnId: z.string(),
      sourceIndex: z.number(),
      destinationColumnId: z.string(),
      destinationIndex: z.number(),
    }),
  )
  .mutation(async ({ ctx: { prisma, user }, input: { projectId, sourceColumnId, sourceIndex, destinationColumnId, destinationIndex } }) => {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        columns: {
          select: {
            id: true,
            tasksOrder: true,
            tasks: { select: { id: true } },
          },
        },
        collaborators: { select: { userId: true } },
      },
    });

    if (!project)
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Project not found',
      });
    if (!project.collaborators.some((collaborator) => collaborator.userId === user.id)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not a collaborator of this project',
      });
    }

    if (sourceColumnId === destinationColumnId) {
      // resort on the same column
      const column = project.columns.find((column) => column.id === sourceColumnId) as (typeof project.columns)[0];
      if (!column)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Column not found',
        });

      const prevOrder = JSON.parse(column.tasksOrder || '[]');
      const [ newOrder ] = move(prevOrder, sourceIndex, destinationIndex);
      await prisma.$transaction([
        prisma.projectColumn.update({
          where: { id: column.id },
          data: { tasksOrder: JSON.stringify(newOrder) },
        }),
        prisma.task.update({
          where: { id: column.tasks[sourceIndex].id },
          data: { columnId: destinationColumnId },
        }),
      ]);

      return;
    } else {
      // re-sort on different columns
      const sourceColumn = project.columns.find((column) => column.id === sourceColumnId);
      const sourceColumnTasksOrder = JSON.parse(sourceColumn?.tasksOrder || '[]');

      const destinationColumn = project.columns.find((column) => column.id === destinationColumnId);
      const destinationColumnTasksOrder = JSON.parse(destinationColumn?.tasksOrder || '[]');
      if (!sourceColumn || !destinationColumn)
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Column not found',
        });

      const [ newSourceOrder, newDestinationOrder ] = move(sourceColumnTasksOrder, sourceIndex, destinationIndex, destinationColumnTasksOrder);

      await prisma.$transaction([
        prisma.projectColumn.update({
          where: { id: sourceColumn.id },
          data: {
            tasksOrder: newSourceOrder.length ? JSON.stringify(newSourceOrder) : null,
          },
        }),
        prisma.projectColumn.update({
          where: { id: destinationColumn.id },
          data: {
            tasksOrder: newDestinationOrder.length ? JSON.stringify(newDestinationOrder) : null,
          },
        }),
        prisma.task.update({
          where: { id: sourceColumnTasksOrder[sourceIndex] },
          data: { columnId: destinationColumn.id },
        }),
      ]);

      return true;
    }
  });
