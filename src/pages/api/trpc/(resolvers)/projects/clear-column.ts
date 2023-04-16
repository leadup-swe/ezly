import { z } from "zod";
import { enrolledUserProcedure } from "../../(core)/middleware/enrolled-user-procedure";
import { TRPCError } from "@trpc/server";

export const clearColumn = enrolledUserProcedure
  .input(
    z.object({
      columnId: z.string(),
    })
  )
  .mutation(async ({ ctx: { prisma, user }, input: { columnId } }) => {
    const column = await prisma.projectColumn.findUnique({
      where: { id: columnId },
      select: {
        project: { select: { collaborators: { select: { userId: true } } } },
      },
    });

    if (!column) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Column not found" });
    }

    if (
      !column.project.collaborators.some((collaborator) => {
        return collaborator.userId === user.id;
      })
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a collaborator on this project",
      });
    }

    console.log(columnId);
    await prisma.$transaction([
      prisma.projectColumn.update({
        where: { id: columnId },
        data: { tasksOrder: null },
      }),
      prisma.task.updateMany({
        where: { columnId },
        data: { status: "DELETED" },
      }),
    ]);

    return true;
  });
