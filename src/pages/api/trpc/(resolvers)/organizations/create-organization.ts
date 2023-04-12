import { z } from 'zod';
import { protectedProcedure } from '../../(core)/middleware/protected-procedure';
import { clerkClient } from '@clerk/nextjs/server';

export const createOrganization = protectedProcedure
  .input(
    z.object({
      name: z.string().max(30),
      description: z.string().max(100),
      website: z.string().max(100).optional(),
    }),
  )
  .mutation(async ({ ctx, input }) => {
    await clerkClient.organizations.createOrganization({
      name: input.name,
      publicMetadata: { description: input.description, website: input.website },
      createdBy: ctx.user.id,
    });
  });
