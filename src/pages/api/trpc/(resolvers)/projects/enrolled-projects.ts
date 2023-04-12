import { z } from "zod";
import { enrolledUserProcedure } from "../../(core)/middleware/enrolled-user-procedure";

export const enrolledProjects = enrolledUserProcedure
  .input(
    z.object({
      organizationId: z.string(),
    })
  )
  .query(async ({ ctx: { boostedPrisma, user }, input }) => {
    return boostedPrisma.project.findMany({
      where: {
        organizationId: input.organizationId,
        collaborators: { some: { userId: user.id } },
      },
      select: { id: true, title: true },
    });
  });
