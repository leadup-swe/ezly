import { enrolledUserProcedure } from '@api/core/middleware/enrolled-user-procedure';
import { ProjectStatus, Visibility } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

export const updateProject = enrolledUserProcedure
  .input(
    z.object({
      id: z.string(),
      title: z.string(),
      description: z.string(),
      visibility: z.enum([ Visibility.PUBLIC, Visibility.PRIVATE ]).optional(),
      status: z.enum([ ProjectStatus.ACTIVE, ProjectStatus.ARCHIVED, ProjectStatus.DELETED ]).optional(),
    }),
  )
  .mutation(async ({ ctx, input: { id, title, description, visibility, status } }) => {
    const project = await ctx.prisma.project.findFirst({ where: { id }, select: { organizationId: true } });
    if (!project) throw new TRPCError({ code: `NOT_FOUND`, message: `Project not found` });

    if (!ctx.organizations.some((org) => org.id === project.organizationId)) {
      throw new TRPCError({ code: `FORBIDDEN`, message: `You are not a member of this organization` });
    }

    return ctx.prisma.project.update({ where: {}, data: { title, description, visibility, status } });
  });
