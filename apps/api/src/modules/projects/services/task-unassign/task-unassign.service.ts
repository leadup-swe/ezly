import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { Service, TGqlCtx } from 'src/types';
import { TaskUnassignInput } from './task-unassign.input';
import { GraphQLError } from 'graphql';

@Injectable()
export class TaskUnassignService implements Service<Promise<boolean>, [ctx: TGqlCtx, input: TaskUnassignInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(ctx: TGqlCtx, { taskId, userId }: TaskUnassignInput) {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId },
      select: {
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

    if (!task) throw new GraphQLError(`Task not found`);
    if (!task.column.project.collaborators.some((c) => c.userId === ctx.userId)) throw new GraphQLError(`You are not a member of this project`);

    if (!task.assignees.some((a) => a.userId === userId)) return true;

    await this.prisma.taskAssignee.deleteMany({
      where: { taskId, userId },
    });

    return true;
  }
}
