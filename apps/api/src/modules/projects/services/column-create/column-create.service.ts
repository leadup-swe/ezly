import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/database/prisma.service';
import { TGqlCtx, Service } from 'src/types';
import { ColumnCreateInput } from './column-create.input';
import { ColumnCreateOutput } from './column-create.output';
import { GraphQLError } from 'graphql';
import { v4 as uuid } from 'uuid';

@Injectable()
export class ColumnCreateService implements Service<Promise<ColumnCreateOutput>, [ctx: TGqlCtx, input: ColumnCreateInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle({ userId }: TGqlCtx, { name, projectId }: ColumnCreateInput) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: {
        organizationId: true,
        columnsOrder: true,
        collaborators: { select: { userId: true } },
      },
    });

    if (!project) throw new GraphQLError('Project not found');

    if (!project.collaborators.some((c) => c.userId === userId)) throw new GraphQLError('You are not a member of this organization');

    const columnId = uuid();
    const prevOrder = JSON.parse(project.columnsOrder || '[]');
    const newOrder = project.columnsOrder ? [...prevOrder, columnId] : [columnId];

    await this.prisma.$transaction([
      this.prisma.projectColumn.create({ data: { id: columnId, name, projectId } }),
      this.prisma.project.update({ where: { id: projectId }, data: { columnsOrder: JSON.stringify(newOrder) } }),
    ]);

    const dto = new ColumnCreateOutput();
    dto.columnId = columnId;

    return dto;
  }
}
