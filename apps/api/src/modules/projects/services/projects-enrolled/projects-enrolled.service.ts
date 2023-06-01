import { Injectable } from '@nestjs/common';
import { Service, TGqlCtx } from 'src/types';
import { ProjectsEnrolledOutput } from './projects-enrolled.output';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class ProjectsEnrolledService implements Service<Promise<ProjectsEnrolledOutput[]>, [ctx: TGqlCtx]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle({ orgId, userId }: TGqlCtx) {
    const projects = await this.prisma.project.findMany({
      where: { organizationId: orgId, collaborators: { some: { userId } } },
      select: { id: true, title: true },
    });

    const dto: ProjectsEnrolledOutput[] = projects;

    return dto;
  }
}
