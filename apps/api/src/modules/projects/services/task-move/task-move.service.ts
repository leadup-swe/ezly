import { Injectable } from '@nestjs/common';
import { Service, TGqlCtx } from 'src/types';
import { TaskMoveInput } from './task-move.input';
import { PrismaService } from 'src/core/database/prisma.service';
import { GraphQLError } from 'graphql';
import { move } from './move.helper';

@Injectable()
export class TaskMoveService implements Service<Promise<boolean>, [ctx: TGqlCtx, input: TaskMoveInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(ctx: TGqlCtx, { projectId, sourceColumnId: sourceColumnId, sourceIndex, destinationColumnId, destinationIndex }: TaskMoveInput) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        columns: { select: { id: true, tasksOrder: true, tasks: { select: { id: true } } } },
        collaborators: { select: { userId: true } },
      },
    });

    if (!project) throw new GraphQLError('Project not found');
    if (!project.collaborators.some((c) => c.userId === ctx.userId)) throw new GraphQLError('You are not a member of this project');

    if (sourceColumnId === destinationColumnId) {
      // resort on the same column
      const column = project.columns.find((column) => column.id === sourceColumnId) as (typeof project.columns)[0];
      if (!column) throw new GraphQLError('Column not found');

      const prevOrder = JSON.parse(column.tasksOrder || '[]');
      const [newOrder] = move(prevOrder, sourceIndex, destinationIndex);
      await this.prisma.$transaction([
        this.prisma.projectColumn.update({ where: { id: column.id }, data: { tasksOrder: JSON.stringify(newOrder) } }),
        this.prisma.task.update({ where: { id: column.tasks[sourceIndex].id }, data: { columnId: destinationColumnId } }),
      ]);

      return true;
    } else {
      // re-sort on different columns
      const sourceColumn = project.columns.find((column) => column.id === sourceColumnId);
      const sourceColumnTasksOrder = JSON.parse(sourceColumn?.tasksOrder || '[]');

      const destinationColumn = project.columns.find((column) => column.id === destinationColumnId);
      const destinationColumnTasksOrder = JSON.parse(destinationColumn?.tasksOrder || '[]');
      if (!sourceColumn || !destinationColumn) throw new GraphQLError('Column not found');

      const [newSourceOrder, newDestinationOrder] = move(sourceColumnTasksOrder, sourceIndex, destinationIndex, destinationColumnTasksOrder);

      await this.prisma.$transaction([
        this.prisma.projectColumn.update({
          where: { id: sourceColumn.id },
          data: { tasksOrder: newSourceOrder.length ? JSON.stringify(newSourceOrder) : null },
        }),
        this.prisma.projectColumn.update({
          where: { id: destinationColumn.id },
          data: { tasksOrder: newDestinationOrder.length ? JSON.stringify(newDestinationOrder) : null },
        }),
        this.prisma.task.update({ where: { id: sourceColumnTasksOrder[sourceIndex] }, data: { columnId: destinationColumn.id } }),
      ]);

      return true;
    }
  }
}
