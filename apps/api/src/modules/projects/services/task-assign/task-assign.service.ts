import { Injectable } from '@nestjs/common';
import { Service, TGqlCtx } from 'src/types';
import { TaskAssignOutput } from './task-assign.output';
import { TaskAssignInput } from './task-assign.input';
import { PrismaService } from 'src/core/database/prisma.service';
import { GraphQLError } from 'graphql';

@Injectable()
export class TaskAssignService implements Service<Promise<TaskAssignOutput>, [ctx: TGqlCtx, input: TaskAssignInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(ctx: TGqlCtx, { taskId, userId }: TaskAssignInput) {
    const task = await this.prisma.task.findFirst({
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

    if (!task) throw new GraphQLError(`Task not found`);
    if (!task.column.project.collaborators.some((c) => c.userId === ctx.userId)) throw new GraphQLError(`You are not a member of this project`);
    if (task.assignees.some((a) => a.userId === userId)) throw new GraphQLError(`User is already assigned to this task`);

    await this.prisma.task.update({
      where: { id: taskId },
      data: { assignees: { create: { userId, projectId: task.column.project.id } } },
    });

    const dto: TaskAssignOutput = { taskId, userId };
    return dto;
  }
}
