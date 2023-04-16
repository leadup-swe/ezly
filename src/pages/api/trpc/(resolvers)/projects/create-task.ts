import { z } from "zod";
import { enrolledUserProcedure } from "../../(core)/middleware/enrolled-user-procedure";
import {
  TRPCError,
  inferProcedureInput,
  inferProcedureOutput,
} from "@trpc/server";
import { brotliCompressSync } from "zlib";

export const createTask = enrolledUserProcedure
  .input(
    z.object({
      columnId: z.string(),
      title: z.string(),
      description: z.string().optional(),
    })
  )
  .mutation(
    async ({
      ctx: { prisma, user },
      input: { columnId, title, description },
    }) => {
      const column = await prisma.projectColumn.findUnique({
        where: { id: columnId },
        include: {
          project: { include: { collaborators: { select: { userId: true } } } },
        },
      });

      if (!column)
        throw new TRPCError({ code: "NOT_FOUND", message: "Column not found" });
      if (
        !column.project.collaborators.some(
          (collaborator) => collaborator.userId === user.id
        )
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this project",
        });
      }

      const prevOrder = JSON.parse(column.tasksOrder || "[]");

      const compactedDescription = description
        ? brotliCompressSync(description).toString("base64")
        : null;

      let taskId = "";
      await prisma.$transaction(async (tx) => {
        const task = await tx.task.create({
          data: { title, columnId, description: compactedDescription },
        });
        await tx.projectColumn.update({
          where: { id: columnId },
          data: { tasksOrder: JSON.stringify([ ...prevOrder, task.id ]) },
        });
        taskId = task.id;
      });

      return { taskId, columnId };
    }
  );

export type CreateTaskInput = inferProcedureInput<typeof createTask>;
export type CreateTaskOutput = inferProcedureOutput<typeof createTask>;
