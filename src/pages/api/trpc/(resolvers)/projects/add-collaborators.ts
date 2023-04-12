import { enrolledUserProcedure } from '@api/core/middleware/enrolled-user-procedure';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const addCollaborators = enrolledUserProcedure
  .input(
    z.object({
      projectId: z.string(),
      collaboratorsIds: z.array(z.string()),
    }),
  )
  .mutation(async ({ ctx, input: { collaboratorsIds, projectId } }) => {
    const project = await ctx.prisma.project.findUnique({ where: { id: projectId }, select: { organizationId: true } });
    if (!project) throw new TRPCError({ code: `NOT_FOUND`, message: `Project not found` });

    if (!ctx.organizations.some((org) => org.id === project.organizationId)) {
      throw new TRPCError({ code: `FORBIDDEN`, message: `You are not a member of this organization` });
    }

    return ctx.prisma.projectCollaborator.createMany({
      data: [
        ...collaboratorsIds.map((collaboratorId) => ({
          projectId,
          userId: collaboratorId,
        })),
      ],
      skipDuplicates: true,
    });
  });
