import { Injectable } from '@nestjs/common';
import { Service, TGqlCtx } from 'src/types';
import { TaskUpdateOutput } from './task-update.output';
import { TaskUpdateInput } from './task-update.input';
import { PrismaService } from 'src/core/database/prisma.service';
import { GraphQLError } from 'graphql';
import { brotliCompressSync } from 'zlib';
import { Status } from 'src/types/graphql';

@Injectable()
export class TaskUpdateService implements Service<Promise<TaskUpdateOutput>, [ctx: TGqlCtx, input: TaskUpdateInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle({ userId }: TGqlCtx, { taskId, description, title }: TaskUpdateInput) {
    const task = await this.prisma.task.findUnique({
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

    if (!task) throw new GraphQLError('Task not found');
    if (!task.column.project.collaborators.some((c) => c.userId === userId)) {
      throw new GraphQLError('You are not a member of this project');
    }

    const compactedDescription = description ? brotliCompressSync(description).toString('base64') : undefined;

    const result = await this.prisma.task.update({
      where: { id: taskId },
      data: { title, description: description ? compactedDescription : undefined },
    });

    const dto: TaskUpdateOutput = {
      taskId,
      title: result.title,
      description: result.description ? result.description : undefined,
      columnId: result.columnId,
      deadline: result.deadline,
      status: Status[result.status],
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      createdBy: result.createdBy,
      subTasksOrder: JSON.parse(result.subTasksOrder ?? '[]'),
    };

    return dto;
  }
}
