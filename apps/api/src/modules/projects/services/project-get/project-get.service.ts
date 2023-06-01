import { Injectable } from '@nestjs/common';
import { Service, TGqlCtx } from 'src/types';
import { ProjectGetOutput } from './project-get.output';
import { ProjectGetInput } from './project-get.input';
import { PrismaService } from 'src/core/database/prisma.service';
import { GraphQLError } from 'graphql';

@Injectable()
export class ProjectGetService implements Service<Promise<ProjectGetOutput>, [ctx: TGqlCtx, input: ProjectGetInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle({ userId }: TGqlCtx, { projectId }: ProjectGetInput) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, status: 'ACTIVE' },
      include: {
        collaborators: { select: { userId: true } },
        columns: {
          where: { status: `ACTIVE` },
          select: {
            id: true,
            name: true,
            tasksOrder: true,
            tasks: {
              where: { status: `ACTIVE` },
              include: { _count: { select: { subTasks: true } }, assignees: { select: { userId: true } } },
            },
          },
        },
      },
    });

    if (!project || !project.collaborators.some((c) => c.userId === userId)) throw new GraphQLError(`Project not found`);

    const dto: ProjectGetOutput = {
      title: project.title,
      columnsOrder: JSON.parse(project.columnsOrder || '[]'),
      columns: [],
      tasks: [],
      collaboratorsIds: project.collaborators.map((c) => c.userId),
    };

    project.columns.forEach((column) => {
      dto.columns.push({
        id: column.id,
        name: column.name,
        taskOrder: JSON.parse(column.tasksOrder || '[]'),
      });

      column.tasks.forEach((task) => {
        dto.tasks.push({
          id: task.id,
          title: task.title ?? `new task`,
          subTaskCount: task._count.subTasks,
          assigneesIds: task.assignees.map((assignee) => assignee.userId),
        });
      });
    });

    return dto;
  }
}
