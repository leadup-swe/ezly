import { z } from "zod";
import { enrolledUserProcedure } from "../../(core)/middleware/enrolled-user-procedure";
import { TRPCError } from "@trpc/server";

export const unassignTask = enrolledUserProcedure
  .input(
    z.object({
      taskId: z.string(),
      userId: z.string(),
    })
  )
  .mutation(async ({ ctx: { prisma, user }, input: { taskId, userId } }) => {
    const task = await prisma.task.findFirst({
      where: { id: taskId },
      select: {
        assignees: { select: { userId: true } },
        column: {
          select: {
            project: {
              select: {
                organizationId: true,
                collaborators: { select: { userId: true } },
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
    }

    if (!task.column.project.collaborators.some((c) => c.userId === user.id)) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a member of this project",
      });
    }

    if (!task.assignees.some((a) => a.userId === userId)) return true;

    await prisma.taskAssignee.deleteMany({
      where: { taskId, userId },
    });

    return true;
  });
