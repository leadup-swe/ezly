import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { enrolledUserProcedure } from '../../core/middleware/enrolled-user-procedure';

export const deleteColumn = enrolledUserProcedure
  .input(
    z.object({
      columnId: z.string(),
    }),
  )
  .mutation(async ({ ctx: { prisma, user }, input: { columnId } }) => {
    const column = await prisma.projectColumn.findUnique({
      where: { id: columnId },
      select: {
        project: {
          select: {
            id: true,
            columnsOrder: true,
            collaborators: { select: { userId: true } },
          },
        },
      },
    });

    if (!column) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Column not found' });
    }

    if (
      !column.project.collaborators.some((collaborator) => {
        return collaborator.userId === user.id;
      })
    ) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: 'You are not a collaborator on this project',
      });
    }

    const newColumnOrder = JSON.parse(column.project.columnsOrder || '[]').filter((id: string) => id !== columnId);

    await prisma.$transaction([
      prisma.projectColumn.update({
        where: { id: columnId },
        data: { status: 'DELETED' },
      }),
      prisma.project.update({
        where: { id: column.project.id },
        data: {
          columnsOrder: newColumnOrder.length ? JSON.stringify(newColumnOrder) : null,
        },
      }),
      prisma.task.updateMany({
        where: { columnId },
        data: { status: 'DELETED' },
      }),
    ]);

    return true;
  });
