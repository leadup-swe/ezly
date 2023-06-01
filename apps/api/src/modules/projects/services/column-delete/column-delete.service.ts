import { Injectable } from '@nestjs/common';
import { Service, TGqlCtx } from 'src/types';
import { ColumnDeleteInput } from './column-delete.input';
import { ClerkService } from 'src/core/clerk/clerk.service';
import { PrismaService } from 'src/core/database/prisma.service';
import { GraphQLError } from 'graphql';

@Injectable()
export class ColumnDeleteService implements Service<Promise<boolean>, [ctx: TGqlCtx, input: ColumnDeleteInput]> {
  constructor(private prisma: PrismaService, private readonly clerk: ClerkService) {}

  async handle({ userId }: TGqlCtx, { columnId }: ColumnDeleteInput) {
    const column = await this.prisma.projectColumn.findUnique({
      where: { id: columnId },
      select: { project: { select: { id: true, columnsOrder: true, collaborators: { select: { userId: true } } } } },
    });

    if (!column) throw new GraphQLError('Column not found');
    if (!column.project.collaborators.some((c) => c.userId === userId)) throw new GraphQLError('You are not a member of this organization');

    const newColumnOrder = JSON.parse(column.project.columnsOrder || '[]').filter((id: string) => id !== columnId);

    await this.prisma.$transaction([
      this.prisma.projectColumn.update({ where: { id: columnId }, data: { status: 'DELETED' } }),
      this.prisma.project.update({ where: { id: column.project.id }, data: { columnsOrder: newColumnOrder.length ? JSON.stringify(newColumnOrder) : null } }),
      this.prisma.task.updateMany({ where: { columnId }, data: { status: 'DELETED' } }),
    ]);

    return true;
  }
}
