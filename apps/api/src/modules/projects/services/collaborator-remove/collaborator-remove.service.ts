import { Injectable } from '@nestjs/common';
import { Service, TGqlCtx } from 'src/types';
import { CollaboratorRemoveInput } from './collaborator-remove.input';
import { PrismaService } from 'src/core/database/prisma.service';
import { GraphQLError } from 'graphql';

@Injectable()
export class CollaboratorRemoveService implements Service<Promise<boolean>, [ctx: TGqlCtx, input: CollaboratorRemoveInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(ctx: TGqlCtx, { projectId, userId }: CollaboratorRemoveInput) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId },
      select: { organizationId: true, collaborators: { select: { userId: true } } },
    });
    if (!project) throw new GraphQLError(`Project not found`);
    if (!project.collaborators.some((c) => c.userId === ctx.userId)) throw new GraphQLError(`You are not a member of this project`);

    const target = await this.prisma.projectCollaborator.findFirst({ where: { AND: [{ projectId, userId }] }, select: { id: true } });
    if (!target) throw new GraphQLError(`User is not a collaborator`);

    await this.prisma.$transaction([
      this.prisma.projectCollaborator.delete({ where: { id: target.id } }),
      this.prisma.taskAssignee.deleteMany({ where: { AND: [{ projectId }, { userId }] } }),
    ]);

    return true;
  }
}
