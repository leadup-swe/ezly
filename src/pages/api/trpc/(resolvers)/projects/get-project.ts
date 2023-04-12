import { z } from "zod";
import { enrolledUserProcedure } from "../../(core)/middleware/enrolled-user-procedure";
import { TRPCError } from "@trpc/server";
import { ProjectColumn, SubTask, Task } from "@prisma/client";

export const getProject = enrolledUserProcedure
  .input(
    z.object({
      projectId: z.string(),
    })
  )
  .query(async ({ ctx: { prisma, user }, input: { projectId } }) => {
    const project = await prisma.project.findFirst({
      where: { id: projectId },
      include: {
        collaborators: { select: { userId: true } },
        columns: {
          select: {
            id: true,
            name: true,
            tasksOrder: true,
            tasks: { include: { _count: { select: { subTasks: true } } } },
          },
        },
      },
    });

    if (!project)
      throw new TRPCError({ code: `NOT_FOUND`, message: `Project not found` });

    if (
      !project.collaborators.some(
        (collaborator) => collaborator.userId === user.id
      )
    ) {
      throw new TRPCError({ code: `NOT_FOUND`, message: `Project not found` });
    }

    const dto: GetProjectOutput = {
      title: project.title,
      columnsOrder: JSON.parse(project.columnsOrder || "[]"),
      columns: {},
      tasks: {},
    };

    project.columns.forEach((column) => {
      dto.columns[column.id] = {
        name: column.name,
        taskOrder: JSON.parse(column.tasksOrder || "[]"),
      };

      column.tasks.forEach((task) => {
        dto.tasks[task.id] = {
          title: task.title,
          subtasksCount: task._count.subTasks,
        };
      });
    });

    return dto;
  });

export type Column = ProjectColumn & {
  tasks: (Task & {
    subTasks: SubTask[];
  })[];
};

export type GetProjectOutput = {
  title: string;
  columnsOrder: string[];
  columns: {
    [id: string]: { name: string; taskOrder: string[] };
  };
  tasks: {
    [id: string]: { title: string; subtasksCount: number };
  };
};
