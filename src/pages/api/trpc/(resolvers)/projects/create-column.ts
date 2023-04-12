import { z } from "zod";
import { enrolledUserProcedure } from "../../(core)/middleware/enrolled-user-procedure";
import { TRPCError, inferProcedureInput } from "@trpc/server";

export const createColumn = enrolledUserProcedure
  .input(
    z.object({
      projectId: z.string(),
      name: z.string(),
    })
  )
  .mutation(
    async ({ ctx: { prisma, organizations }, input: { projectId, name } }) => {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!project)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      if (!organizations.some((org) => org.id === project.organizationId)) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not a member of this organization",
        });
      }

      let colId = "";
      await prisma.$transaction(async (tx) => {
        const newCol = await tx.projectColumn.create({
          data: { name, projectId },
        });
        const prevOrder = JSON.parse(project.columnsOrder || "[]");
        const newOrder = project.columnsOrder
          ? [...prevOrder, newCol.id]
          : [newCol.id];

        await tx.project.update({
          where: { id: projectId },
          data: { columnsOrder: JSON.stringify(newOrder) },
        });
        colId = newCol.id;
      });

      return colId;
    }
  );

export type CreateColumnInput = inferProcedureInput<typeof createColumn>;
