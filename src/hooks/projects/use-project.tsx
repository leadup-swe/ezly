import { cloneDeep } from "lodash";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { trpc } from "src/trpc";

import { move } from "src/utils/move";
import { v4 as uuid } from "uuid";

interface Props {
  projectId: string
}

let moveTaskTimer: NodeJS.Timer;

export const useProject = ({ projectId }: Props) => {
  const trpcCtx = trpc.useContext();
  const project = trpc.projects.getProject.useQuery(
    { projectId },
    { staleTime: Infinity }
  );

  const [ tempColId, setTempColId ] = useState<string | null>(null);
  const { mutate: createColumn } = trpc.projects.createColumn.useMutation({
    onMutate: ({ name }) => {
      const tempId = uuid();
      setTempColId(tempId);
      const projectData = cloneDeep(
        trpcCtx.projects.getProject.getData({ projectId })
      );
      if (!projectData) return;

      const newData = {
        ...projectData,
        columns: { ...projectData?.columns, [tempId]: { name, taskOrder: [] } },
        columnsOrder: [ ...projectData.columnsOrder, tempId ],
      };
      trpcCtx.projects.getProject.setData({ projectId }, newData);
    },
    onSuccess: (newId) => {
      if (!tempColId) return;
      const projectData = cloneDeep(
        trpcCtx.projects.getProject.getData({ projectId })
      );
      if (!projectData) return;

      const newData = {
        ...projectData,
        columns: {
          ...projectData?.columns,
          [newId]: { ...projectData?.columns[tempColId] },
        },
        columnsOrder: [ ...projectData.columnsOrder, newId ],
      };
      delete newData.columns[tempColId];

      trpcCtx.projects.getProject.setData({ projectId }, newData);
      setTempColId(null);
      toast.success(`Column created!`);
    },
    onError: () => {
      toast.error(`Failed to create column`);
      trpcCtx.projects.getProject.invalidate({ projectId });
    },
  });

  const { mutate: createTask } = trpc.projects.createTask.useMutation({
    onMutate: ({ columnId, title }) => {
      const tempId = uuid();

      const projectData = cloneDeep(
        trpcCtx.projects.getProject.getData({ projectId })
      );
      if (!projectData) return;
      const newTask = { title, subtasksCount: 0 };
      const newData = {
        ...projectData,
        columns: {
          ...projectData.columns,
          [columnId]: {
            ...projectData.columns[columnId],
            taskOrder: [ ...projectData.columns[columnId].taskOrder, tempId ],
          },
        },
        tasks: { ...projectData.tasks, [tempId]: newTask },
      };
      trpcCtx.projects.getProject.setData({ projectId }, newData);
    },
    onSuccess: () => {
      trpcCtx.projects.getProject.invalidate({ projectId });
      toast.success(`Task created!`);
    },
    onError: () => {
      trpcCtx.projects.getProject.invalidate({ projectId });
      toast.error(`Failed to create task`);
    },
  });

  const { mutate: moveTask } = trpc.projects.moveTask.useMutation({
    onMutate: ({
      sourceColumnId,
      sourceIndex,
      destinationColumnId,
      destinationIndex,
    }) => {
      const projectData = cloneDeep(
        trpcCtx.projects.getProject.getData({ projectId })
      );
      if (!projectData) return;

      if (sourceColumnId === destinationColumnId) {
        // resort on the same column
        const column = projectData.columns[sourceColumnId];

        const [ newOrder ] = move(
          column.taskOrder,
          sourceIndex,
          destinationIndex
        );
        const newData = {
          ...projectData,
          columns: {
            ...projectData.columns,
            [sourceColumnId]: { ...column, taskOrder: newOrder },
          },
        };
        trpcCtx.projects.getProject.setData({ projectId }, newData);

        return;
      } else {
        // re-sort on different columns
        const sourceColumn = projectData.columns[sourceColumnId];
        const destinationColumn = projectData.columns[destinationColumnId];

        const [ newSourceOrder, newDestinationOrder ] = move(
          sourceColumn.taskOrder,
          sourceIndex,
          destinationIndex,
          destinationColumn.taskOrder
        );
        const newData = {
          ...projectData,
          columns: {
            ...projectData.columns,
            [sourceColumnId]: { ...sourceColumn, taskOrder: newSourceOrder },
            [destinationColumnId]: {
              ...destinationColumn,
              taskOrder: newDestinationOrder,
            },
          },
        };
        trpcCtx.projects.getProject.setData({ projectId }, newData);
      }
    },
    onSuccess: () => {
      toast.success(`Task moved!`);
    },
    onError: () => {
      trpcCtx.projects.getProject.invalidate({ projectId });
      toast.error(`Failed to move task`);
    },
  });

  const { mutate: updateTask } = trpc.projects.updateTask.useMutation({
    onMutate: ({ taskId, title, description }) => {
      const projectData = cloneDeep(
        trpcCtx.projects.getProject.getData({ projectId })
      );
      if (!projectData) return;

      const newData = {
        ...projectData,
        tasks: {
          ...projectData.tasks,
          [taskId]: {
            ...projectData.tasks[taskId],
            title,
            description,
          },
        },
      };

      const newTaskData = cloneDeep(
        trpcCtx.projects.getTask.getData({ taskId })
      );
      if (newTaskData) {
        newTaskData.title = title;
        newTaskData.description = description as string;
      }

      trpcCtx.projects.getProject.setData({ projectId }, newData);
      trpcCtx.projects.getTask.setData({ taskId }, newTaskData);
    },
    onSuccess: () => {
      toast.success(`Task updated!`);
    },
    onError: () => {
      trpcCtx.projects.getProject.invalidate({ projectId });
      trpcCtx.projects.getTask.invalidate();
      toast.error(`Failed to update task`);
    },
  });

  const { mutate: clearColumn } = trpc.projects.clearColumn.useMutation({
    onMutate: ({ columnId }) => {
      const newData = cloneDeep(
        trpcCtx.projects.getProject.getData({ projectId })
      );
      if (!newData) return;

      newData.columns[columnId].taskOrder = [];

      trpcCtx.projects.getProject.setData({ projectId }, newData);
    },
    onSuccess: () => {
      toast.success(`Column cleared!`);
    },
    onError: () => {
      trpcCtx.projects.getProject.invalidate({ projectId });
      toast.error(`Failed to clear column`);
    },
  });

  const { mutate: deleteColumn } = trpc.projects.deleteColumn.useMutation({
    onMutate: ({ columnId }) => {
      const newData = cloneDeep(
        trpcCtx.projects.getProject.getData({ projectId })
      );
      if (!newData) return;

      const newColumns = { ...newData.columns };
      delete newColumns[columnId];

      const newColumnsOrder = newData.columnsOrder.filter(
        (id) => id !== columnId
      );

      newData.columns = newColumns;
      newData.columnsOrder = newColumnsOrder;

      trpcCtx.projects.getProject.setData({ projectId }, newData);
    },
    onSuccess: () => {
      toast.success(`Column deleted!`);
    },
    onError: () => {
      trpcCtx.projects.getProject.invalidate({ projectId });
      toast.error(`Failed to delete column`);
    },
  });

  const { mutate: assignTask } = trpc.projects.assignTask.useMutation();

  return {
    project,
    collaborators: project.data?.collaborators || [],
    createColumn,
    createTask,
    moveTask,
    updateTask,
    clearColumn,
    deleteColumn,
    assignTask,
    tasks: project.data?.tasks || {},
    columns: project.data?.columns || {},
    columnsOrder: project.data?.columnsOrder || [],
  };
};
