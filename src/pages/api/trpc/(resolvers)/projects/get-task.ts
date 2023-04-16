import { z } from "zod";
import { enrolledUserProcedure } from "../../(core)/middleware/enrolled-user-procedure";
import { TRPCError } from "@trpc/server";
import { brotliDecompressSync } from "zlib";

export const getTask = enrolledUserProcedure
  .input(
    z.object({
      taskId: z.string(),
    })
  )
  .query(async ({ ctx, input: { taskId } }) => {
    const task = await ctx.boostedPrisma.task.findUnique({
      where: { id: taskId },
      include: {
        column: {
          select: {
            project: {
              select: { collaborators: { select: { userId: true } } },
            },
          },
        },
      },
    });

    if (!task) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
    }

    if (
      !task.column.project.collaborators.some(
        (collaborator) => collaborator.userId === ctx.user.id
      )
    ) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not a member of this project",
      });
    }

    const { column, ...taskData } = task;
    const description = taskData.description
      ? brotliDecompressSync(
          Buffer.from(taskData.description, "base64")
        ).toString("utf-8")
      : null;

    const dto = {
      ...taskData,
      description,
    };
    return dto;
  });
