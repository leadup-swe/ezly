import { useOrganization } from '@clerk/nextjs';
import { cloneDeep } from 'lodash';
import { useContext, useState } from 'react';
import { toast } from 'react-hot-toast';
import { OrganizationCtx } from 'src/contexts/organization';
import { trpc } from 'src/trpc';

import { move } from 'src/utils/move';
import { v4 as uuid } from 'uuid';

interface Props {
  projectId: string
}

export const useProject = ({ projectId }: Props) => {
  const { organization } = useOrganization();
  const { members } = useContext(OrganizationCtx);

  const trpcCtx = trpc.useContext();
  const project = trpc.projects.getProject.useQuery({ projectId }, { staleTime: Infinity });

  const [ tempColId, setTempColId ] = useState<string | null>(null);
  const { mutate: createColumn } = trpc.projects.createColumn.useMutation({
    onMutate: ({ name }) => {
      const tempId = uuid();
      setTempColId(tempId);
      const projectData = cloneDeep(trpcCtx.projects.getProject.getData({ projectId }));
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
      const projectData = cloneDeep(trpcCtx.projects.getProject.getData({ projectId }));
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
    },
    onError: () => {
      toast.error(`Failed to create column`);
      trpcCtx.projects.getProject.invalidate({ projectId });
    },
  });

  const { mutate: createTask } = trpc.projects.createTask.useMutation({
    onSuccess: ({ columnId, taskId }) => {
      const projectData = trpcCtx.projects.getProject.getData({ projectId });
      if (!projectData) return;

      const newTask = { title: `new task`, subtasksCount: 0, assigneesIds: [] };
      const newData = {
        ...projectData,
        columns: {
          ...projectData.columns,
          [columnId]: {
            ...projectData.columns[columnId],
            taskOrder: [ ...projectData.columns[columnId].taskOrder, taskId ],
          },
        },
        tasks: { ...projectData.tasks, [taskId]: newTask },
      };
      trpcCtx.projects.getProject.setData({ projectId }, newData);
    },
    onError: () => {
      trpcCtx.projects.getProject.invalidate({ projectId });
      toast.error(`Failed to create task`);
    },
  });

  const { mutate: moveTask } = trpc.projects.moveTask.useMutation({
    onMutate: ({ sourceColumnId, sourceIndex, destinationColumnId, destinationIndex }) => {
      const projectData = cloneDeep(trpcCtx.projects.getProject.getData({ projectId }));
      if (!projectData) return;

      if (sourceColumnId === destinationColumnId) {
        // re-sort on the same column
        const column = projectData.columns[sourceColumnId];

        const [ newOrder ] = move(column.taskOrder, sourceIndex, destinationIndex);
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

        const [ newSourceOrder, newDestinationOrder ] = move(sourceColumn.taskOrder, sourceIndex, destinationIndex, destinationColumn.taskOrder);
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
    onError: () => {
      trpcCtx.projects.getProject.invalidate({ projectId });
      toast.error(`Failed to move task`);
    },
  });

  const { mutate: updateTask } = trpc.projects.updateTask.useMutation({
    onMutate: ({ taskId, title, description }) => {
      const projectData = cloneDeep(trpcCtx.projects.getProject.getData({ projectId }));
      if (!projectData) return;
      if (title) projectData.tasks[taskId].title = title;

      const taskData = cloneDeep(trpcCtx.projects.getTask.getData({ taskId }));
      if (!taskData) return;
      if (title) taskData.title = title;
      if (description) taskData.description = description;

      trpcCtx.projects.getProject.setData({ projectId }, projectData);
      trpcCtx.projects.getTask.setData({ taskId }, taskData);
    },
    onError: () => {
      trpcCtx.projects.getProject.invalidate({ projectId });
      trpcCtx.projects.getTask.invalidate();
      toast.error(`Failed to update task`);
    },
  });

  const { mutate: clearColumn } = trpc.projects.clearColumn.useMutation({
    onMutate: ({ columnId }) => {
      const newData = cloneDeep(trpcCtx.projects.getProject.getData({ projectId }));
      if (!newData) return;

      newData.columns[columnId].taskOrder = [];

      trpcCtx.projects.getProject.setData({ projectId }, newData);
    },
    onError: () => {
      trpcCtx.projects.getProject.invalidate({ projectId });
      toast.error(`Failed to clear column`);
    },
  });

  const { mutate: deleteColumn } = trpc.projects.deleteColumn.useMutation({
    onMutate: ({ columnId }) => {
      const newData = cloneDeep(trpcCtx.projects.getProject.getData({ projectId }));
      if (!newData) return;

      const newColumns = { ...newData.columns };
      delete newColumns[columnId];

      const newColumnsOrder = newData.columnsOrder.filter((id) => id !== columnId);

      newData.columns = newColumns;
      newData.columnsOrder = newColumnsOrder;

      trpcCtx.projects.getProject.setData({ projectId }, newData);
    },
    onError: () => {
      trpcCtx.projects.getProject.invalidate({ projectId });
      toast.error(`Failed to delete column`);
    },
  });

  const { mutate: assignTask } = trpc.projects.assignTask.useMutation({
    onMutate: ({ taskId, userId }) => {
      const taskData = trpcCtx.projects.getTask.getData({ taskId });
      if (!taskData) return;
      const user = members?.find((member) => member.publicUserData?.userId === userId)?.publicUserData;

      taskData.assignees = [
        ...taskData.assignees,
        { id: userId, avatar: user?.profileImageUrl, email: user?.identifier, firstname: user?.firstName, lastname: user?.lastName },
      ];

      trpcCtx.projects.getTask.setData({ taskId }, taskData);

      const projectData = trpcCtx.projects.getProject.getData({ projectId });
      projectData?.tasks[taskId].assigneesIds.push(userId);
      trpcCtx.projects.getProject.setData({ projectId }, projectData);
    },
    onSuccess: ({ taskId, id, avatar, firstname, lastname, email }) => {
      const newData = trpcCtx.projects.getTask.getData({ taskId });
      if (!newData) return;

      newData.assignees = newData.assignees.map((assignee) => {
        if (assignee.id === id) {
          return { id, avatar, firstname, lastname, email };
        }
        return assignee;
      });

      trpcCtx.projects.getTask.setData({ taskId }, newData);
    },
    onError: () => {
      trpcCtx.projects.getTask.invalidate();
      toast.error(`Failed to assign task`);
    },
  });

  const { mutate: unassignTask } = trpc.projects.unassignTask.useMutation({
    onMutate: ({ taskId, userId }) => {
      const newData = trpcCtx.projects.getTask.getData({ taskId });
      if (!newData) return;

      newData.assignees = newData.assignees.filter((assignee) => assignee.id !== userId);

      trpcCtx.projects.getTask.setData({ taskId }, newData);

      const projectData = trpcCtx.projects.getProject.getData({ projectId });
      if (!projectData) return;
      projectData.tasks[taskId].assigneesIds = projectData?.tasks[taskId].assigneesIds.filter((id) => id !== userId);

      trpcCtx.projects.getProject.setData({ projectId }, projectData);
    },
    onError: () => {
      trpcCtx.projects.getTask.invalidate();
      toast.error(`Failed to unassign task`);
    },
  });

  const { mutate: updateName } = trpc.projects.updateProjectName.useMutation({
    onMutate: ({ name, projectId }) => {
      if (!organization) return;
      const enrolledProject = trpcCtx.projects.enrolledProjects.getData({ organizationId: organization.id });
      const projectData = trpcCtx.projects.getProject.getData({ projectId });

      if (!enrolledProject || !projectData) return;

      const newEnrolledProject = enrolledProject.map((project) => {
        if (project.id === projectId) return { ...project, title: name };
        return project;
      });

      projectData.title = name;

      trpcCtx.projects.enrolledProjects.setData({ organizationId: organization.id }, newEnrolledProject);
      trpcCtx.projects.getProject.setData({ projectId }, projectData);
    },
  });

  const { mutate: addCollaborator } = trpc.projects.addCollaborator.useMutation({
    onMutate: async ({ projectId, userId }) => {
      const projectData = trpcCtx.projects.getProject.getData({ projectId });
      if (!projectData) return;

      if (members) {
        const user = members.find((member) => member.publicUserData?.userId === userId);
        projectData.collaborators = [
          ...projectData.collaborators,
          {
            id: userId,
            avatar: user?.publicUserData?.profileImageUrl,
            email: user?.publicUserData?.identifier,
            firstname: user?.publicUserData?.firstName,
            lastname: user?.publicUserData?.lastName,
          },
        ];

        trpcCtx.projects.getProject.setData({ projectId }, projectData);
      }
    },
  });

  const { mutate: removeCollaborator } = trpc.projects.removeCollaborator.useMutation({
    onMutate: ({ projectId, userId }) => {
      const projectData = cloneDeep(trpcCtx.projects.getProject.getData({ projectId }));
      if (!projectData) return;

      projectData.collaborators = projectData.collaborators.filter((collaborator) => collaborator.id !== userId);

      Object.keys(projectData.tasks).forEach((taskId) => {
        projectData.tasks[taskId] = {
          ...projectData.tasks[taskId],
          assigneesIds: projectData.tasks[taskId].assigneesIds.filter((id) => id !== userId),
        };
        const taskData = trpcCtx.projects.getTask.getData({ taskId });
        if (!taskData) return;
        if (taskData.assignees.some((assignee) => assignee.id === userId)) {
          taskData.assignees = taskData.assignees.filter((assignee) => assignee.id !== userId);
          trpcCtx.projects.getTask.setData({ taskId }, taskData);
        }
      });

      trpcCtx.projects.getProject.setData({ projectId }, projectData);
    },
  });

  return {
    project,
    organizationMembers: members || [],
    collaborators: project.data?.collaborators || [],
    createColumn,
    createTask,
    moveTask,
    updateTask,
    clearColumn,
    deleteColumn,
    assignTask,
    unassignTask,
    updateName,
    addCollaborator,
    removeCollaborator,
    tasks: project.data?.tasks || {},
    columns: project.data?.columns || {},
    columnsOrder: project.data?.columnsOrder || [],
  };
};
