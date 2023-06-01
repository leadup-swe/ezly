import { TGqlCtx, Service } from 'src/types';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { TaskCreateInput } from './task-create.input';
import { GraphQLError } from 'graphql';
import { TaskCreateOutput } from './task-create.output';
import { v4 as uuid } from 'uuid';

@Injectable()
export class TaskCreateService implements Service<Promise<TaskCreateOutput>, [ctx: TGqlCtx, input: TaskCreateInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(ctx: TGqlCtx, input: TaskCreateInput) {
    const column = await this.prisma.projectColumn.findUnique({
      where: { id: input.columnId },
      include: {
        project: { include: { collaborators: { select: { userId: true } } } },
      },
    });

    if (!column) throw new GraphQLError(`Column not found`);
    if (!column.project.collaborators.some((collaborator) => collaborator.userId === ctx.userId)) {
      throw new GraphQLError('You are not a member of this project');
    }

    const prevOrder = JSON.parse(column.tasksOrder || '[]');

    const taskId = uuid();
    const newOrder = JSON.stringify([...prevOrder, taskId]);
    await this.prisma.$transaction([
      this.prisma.task.create({ data: { id: taskId, columnId: input.columnId, createdBy: ctx.userId } }),
      this.prisma.projectColumn.update({ where: { id: input.columnId }, data: { tasksOrder: newOrder } }),
    ]);

    const dto = new TaskCreateOutput();
    dto.taskId = taskId;
    dto.columnId = input.columnId;

    return dto;
  }
}
