import { enrolledUserProcedure } from '@api/core/middleware/enrolled-user-procedure';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const removeCollaborator = enrolledUserProcedure
  .input(
    z.object({
      projectId: z.string(),
      userId: z.string(),
    }),
  )
  .mutation(async ({ ctx, input: { projectId, userId } }) => {
    const project = await ctx.prisma.project.findFirst({ where: { id: projectId }, select: { organizationId: true } });
    if (!project) throw new TRPCError({ code: `NOT_FOUND`, message: `Project not found` });

    if (!ctx.organizations.some((org) => org.id === project.organizationId)) {
      throw new TRPCError({ code: `FORBIDDEN`, message: `You are not a member of this organization` });
    }

    const target = await ctx.prisma.projectCollaborator.findFirst({ where: { AND: [ { projectId, userId } ] }, select: { id: true } });
    if (!target) throw new TRPCError({ code: `BAD_REQUEST`, message: `User is not a collaborator` });

    return ctx.prisma.projectCollaborator.delete({ where: { id: target.id } });
  });
