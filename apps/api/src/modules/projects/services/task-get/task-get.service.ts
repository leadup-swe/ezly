import { Injectable } from '@nestjs/common';
import { Service, TGqlCtx } from 'src/types';
import { TaskGetOutput } from './task-get.output';
import { TaskGetInput } from './task-get.input';
import { GraphQLError } from 'graphql';
import { PrismaService } from 'src/core/database/prisma.service';
import { brotliDecompressSync } from 'zlib';
import { Status } from 'src/types/graphql';

@Injectable()
export class TaskGetService implements Service<Promise<TaskGetOutput>, [ctx: TGqlCtx, input: TaskGetInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle({ userId }: TGqlCtx, { taskId }: TaskGetInput) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: {
        assignees: { select: { userId: true } },
        column: {
          select: {
            project: {
              select: { organizationId: true, collaborators: { select: { userId: true } } },
            },
          },
        },
      },
    });

    if (!task) throw new GraphQLError(`Task not found`);
    if (!task.column.project.collaborators.some((c) => c.userId === userId)) throw new GraphQLError(`You are not a member of this project`);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { column, ...taskData } = task;
    const description = taskData.description ? brotliDecompressSync(Buffer.from(taskData.description, 'base64')).toString('utf-8') : null;

    const dto: TaskGetOutput = {
      id: taskData.id,
      title: taskData.title,
      description,
      columnId: taskData.columnId,
      deadline: taskData.deadline,
      status: Status[taskData.status],
      assigneesIds: taskData.assignees.map((a) => a.userId),
      subTasksOrder: JSON.parse(taskData.subTasksOrder || '[]'),
      createdBy: taskData.createdBy,
      createdAt: taskData.createdAt,
      updatedAt: taskData.updatedAt,
    };

    return dto;
  }
}
