import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { TGqlCtx, Service } from 'src/types';
import { ProjectCreateInput } from './project-create.input';
import { ProjectCreateOutput } from './project-create.output';
import { GraphQLError } from 'graphql';

@Injectable()
export class ProjectCreateService implements Service<Promise<ProjectCreateOutput>, [ctx: TGqlCtx, input: ProjectCreateInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(ctx: TGqlCtx, input: ProjectCreateInput) {
    const result = await this.prisma.project.create({
      data: {
        title: input.title,
        description: input.description,
        organizationId: ctx.orgId,
        visibility: input.visibility,
        collaborators: { create: { userId: ctx.userId } },
      },
    });

    if (!result) {
      throw new GraphQLError('Failed to create project');
    }

    const dto = new ProjectCreateOutput();
    dto.projectId = result.id;

    return dto;
  }
}
