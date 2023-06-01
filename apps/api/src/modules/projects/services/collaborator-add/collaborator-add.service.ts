import { Injectable } from '@nestjs/common';
import { Service, TGqlCtx } from 'src/types';
import { CollaboratorAddOutput } from './collaborator-add.output';
import { PrismaService } from 'src/core/database/prisma.service';
import { GraphQLError } from 'graphql';
import { CollaboratorAddInput } from './collaborator-add.input';

@Injectable()
export class CollaboratorAddService implements Service<Promise<CollaboratorAddOutput>, [ctx: TGqlCtx, input: CollaboratorAddInput]> {
  constructor(private readonly prisma: PrismaService) {}

  async handle(ctx: TGqlCtx, { projectId, userId }: CollaboratorAddInput) {
    const project = await this.prisma.project.findFirst({ where: { id: projectId }, select: { id: true } });

    if (!project) throw new GraphQLError(`Project not found`);

    const exists = await this.prisma.projectCollaborator.findFirst({ where: { AND: [{ projectId, userId }] }, select: { id: true } });
    if (exists) throw new GraphQLError(`User is already a collaborator`);

    const result = await this.prisma.projectCollaborator.create({ data: { projectId, userId } });

    const dto: CollaboratorAddOutput = {
      id: result.id,
      projectId: project.id,
      userId: userId,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
    };

    return dto;
  }
}
