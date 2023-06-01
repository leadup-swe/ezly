import { Injectable } from '@nestjs/common';
import { Service, TGqlCtx } from 'src/types';
import { ProjectUpdateOutput } from './project-update.output';
import { ProjectUpdateInput } from './project-update.input';
import { PrismaService } from 'src/core/database/prisma.service';
import { GraphQLError } from 'graphql';
import { Status, Visibility } from 'src/types/graphql';

@Injectable()
export class ProjectUpdateService implements Service<Promise<ProjectUpdateOutput>, [ctx: TGqlCtx, input: ProjectUpdateInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(ctx: TGqlCtx, input: ProjectUpdateInput) {
    const project = await this.prisma.project.findFirst({
      where: { id: input.projectId },
      select: { organizationId: true, collaborators: { select: { userId: true } } },
    });

    if (!project) throw new GraphQLError('Project not found');
    if (!project.collaborators.some((c) => c.userId === ctx.userId)) throw new GraphQLError('You are not a member of this project');

    const result = await this.prisma.project.update({
      where: { id: input.projectId },
      data: { title: input.title, description: input.description, visibility: input.visibility, status: input.status },
    });

    const dto: ProjectUpdateOutput = {
      id: result.id,
      title: result.title,
      description: result.description,
      visibility: Visibility[result.visibility],
      status: Status[result.status],
      columnsOrder: JSON.parse(result.columnsOrder || '[]'),
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    return dto;
  }
}
