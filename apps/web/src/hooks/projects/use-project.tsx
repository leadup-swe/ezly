import { useOrganization } from '@clerk/nextjs';
import { cloneDeep } from 'lodash';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { api } from 'src/api';
import { ProjectGetQuery, ProjectsEnrolledQuery, TaskGetQuery } from 'src/api/gql-gen';
import { trpc } from 'src/trpc';
import { move } from 'src/utils/move';
import { v4 as uuid } from 'uuid';

interface Props {
  projectId: string
}

export const useProject = ({ projectId }: Props) => {
  const { organization } = useOrganization();

  const trpcCtx = trpc.useContext();
  const apiCtx = api.useClient();
  const projKey = api.projects.projectGet.getKey({ input: { projectId } });
  const { data: { projectGet } = {} } = api.projects.projectGet.useQuery({ input: { projectId } }, { staleTime: Infinity });

  const [ tempColId, setTempColId ] = useState<string | null>(null);
  const { mutate: columnCreate } = api.projects.columnCreate.useMutation({
    onMutate: ({ input: { name, projectId } }) => {
      const tempId = uuid();
      setTempColId(tempId);
      const projKey = api.projects.projectGet.getKey({ input: { projectId } });
      const projData: ProjectGetQuery | undefined = apiCtx.getQueryData(projKey);
      if (!projData?.projectGet) return;
      const proj = projData.projectGet;

      const newData: ProjectGetQuery = {
        projectGet: {
          ...proj,
          columns: [ ...proj.columns, { id: tempId, name, taskOrder: [] } ],
          columnsOrder: [ ...proj.columnsOrder, tempId ],
        },
      };

      apiCtx.setQueryData(projKey, newData);
    },
    onSuccess: ({ columnCreate: { columnId } }) => {
      if (!tempColId) return;
      const projData: ProjectGetQuery | undefined = apiCtx.getQueryData(projKey);
      if (!projData?.projectGet) return;
      const proj = projData.projectGet;

      const newData: ProjectGetQuery = {
        projectGet: {
          ...proj,
          columns: proj.columns.map((c) => {
            if (c.id === tempColId) {
              return { ...c, id: columnId };
            }
            return c;
          }),
          columnsOrder: proj.columnsOrder.map((c) => {
            if (c === tempColId) {
              return columnId;
            }
            return c;
          }),
        },
      };

      apiCtx.setQueryData(projKey, newData);
      setTempColId(null);
    },
    onError: () => {
      toast.error(`Failed to create column`);
    },
  });

  const { mutate: taskMove } = api.projects.taskMove.useMutation({
    onMutate: ({ input: { sourceColumnId, sourceIndex, destinationColumnId, destinationIndex } }) => {
      const projData: ProjectGetQuery | undefined = apiCtx.getQueryData(projKey);
      if (!projData?.projectGet) return;
      const proj = projData.projectGet;

      if (sourceColumnId === destinationColumnId) {
        // re-sort on the same column
        const column = proj.columns.find((c) => c.id === sourceColumnId);
        if (!column) return;

        const [ newOrder ] = move(column.taskOrder, sourceIndex, destinationIndex);
        const newData: ProjectGetQuery = {
          projectGet: {
            ...proj,
            columns: proj.columns.map((c) => {
              if (c.id === sourceColumnId) {
                return { ...c, taskOrder: newOrder };
              }
              return c;
            }),
          },
        };

        apiCtx.setQueryData(projKey, newData);
        return;
      } else {
        // re-sort on different columns
        const sourceColumn = proj.columns.find((c) => c.id === sourceColumnId);
        const destinationColumn = proj.columns.find((c) => c.id === destinationColumnId);
        if (!sourceColumn || !destinationColumn) return;

        const [ newSourceOrder, newDestinationOrder ] = move(sourceColumn.taskOrder, sourceIndex, destinationIndex, destinationColumn.taskOrder);
        const newData: ProjectGetQuery = {
          projectGet: {
            ...proj,
            columns: proj.columns.map((c) => {
              if (c.id === sourceColumnId) {
                return { ...c, taskOrder: newSourceOrder };
              }
              if (c.id === destinationColumnId) {
                return { ...c, taskOrder: newDestinationOrder };
              }
              return c;
            }),
          },
        };

        apiCtx.setQueryData(projKey, newData);
      }
    },
    onError: () => {
      toast.error(`Failed to move task`);
    },
  });

  const { mutate: taskUpdate } = api.projects.taskUpdate.useMutation({
    onMutate: ({ input: { taskId, title, description } }) => {
      const projData: ProjectGetQuery | undefined = cloneDeep(apiCtx.getQueryData(projKey));
      if (!projData?.projectGet) return;
      if (title)
        projData.projectGet.tasks = projData.projectGet.tasks.map((t) => {
          if (t.id === taskId) {
            return { ...t, title };
          }
          return t;
        });

      const taskKey = api.projects.taskGet.getKey({ input: { taskId } });
      const taskData: TaskGetQuery | undefined = cloneDeep(apiCtx.getQueryData(taskKey));
      if (!taskData?.taskGet) return;
      if (title) taskData.taskGet.title = title;
      if (description) taskData.taskGet.description = description;

      console.log(projData, taskData);
      apiCtx.setQueryData(projKey, projData);
      apiCtx.setQueryData(taskKey, taskData);
    },
    onError: () => {
      toast.error(`Failed to update task`);
    },
  });

  const { mutate: columnClear } = trpc.projects.clearColumn.useMutation({
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

  const { mutate: columnDelete } = api.projects.columnDelete.useMutation({
    onMutate: ({ input: { columnId } }) => {
      const projData: ProjectGetQuery | undefined = cloneDeep(apiCtx.getQueryData(projKey));
      if (!projData?.projectGet) return;

      projData.projectGet.columns = projData.projectGet.columns.filter((c) => c.id !== columnId);
      projData.projectGet.columnsOrder = projData.projectGet.columnsOrder.filter((id) => id !== columnId);

      apiCtx.setQueryData(projKey, projData);
    },
    onError: () => {
      toast.error(`Failed to delete column`);
    },
  });

  const { mutate: taskAssign } = api.projects.taskAssign.useMutation({
    onMutate: ({ input: { taskId, userId } }) => {
      const taskKey = api.projects.taskGet.getKey({ input: { taskId } });
      const taskData: TaskGetQuery | undefined = cloneDeep(apiCtx.getQueryData(taskKey));
      if (!taskData) return;

      taskData.taskGet.assigneesIds = [ ...taskData.taskGet.assigneesIds, userId ];

      apiCtx.setQueryData(taskKey, taskData);

      const projectData: ProjectGetQuery | undefined = apiCtx.getQueryData(projKey);
      if (!projectData?.projectGet) return;

      projectData?.projectGet.tasks.find((t) => t.id === taskId)?.assigneesIds.push(userId);
      apiCtx.setQueryData(projKey, projectData);
    },
    onError: () => {
      toast.error(`Failed to assign task`);
    },
  });

  const { mutate: taskUnassign } = api.projects.taskUnassign.useMutation({
    onMutate: ({ input: { taskId, userId } }) => {
      const taskKey = api.projects.taskGet.getKey({ input: { taskId } });
      const taskData: TaskGetQuery | undefined = apiCtx.getQueryData(taskKey);
      if (!taskData?.taskGet) return;

      taskData.taskGet.assigneesIds = taskData.taskGet.assigneesIds.filter((id) => id !== userId);
      apiCtx.setQueryData(taskKey, taskData);

      const projectData: ProjectGetQuery | undefined = apiCtx.getQueryData(projKey);
      if (!projectData?.projectGet) return;

      projectData.projectGet.tasks = projectData.projectGet.tasks.map((t) => {
        if (t.id === taskId) return { ...t, assigneesIds: t.assigneesIds.filter((id) => id !== userId) };
        return t;
      });

      apiCtx.setQueryData(projKey, projectData);
    },
    onError: () => {
      toast.error(`Failed to unassign task`);
    },
  });

  const { mutate: nameUpdate } = api.projects.projectUpdate.useMutation({
    onMutate: ({ input: { projectId, title } }) => {
      if (!organization) return;
      const enrolledProjKey = api.projects.projectsEnrolled.getKey();
      const enrolledProjects: ProjectsEnrolledQuery | undefined = apiCtx.getQueryData(enrolledProjKey);

      if (!enrolledProjects?.projectsEnrolled) return;

      const newEnrolledProjects = enrolledProjects.projectsEnrolled.map((project) => {
        if (project.id === projectId) return { ...project, title };
        return project;
      });

      apiCtx.setQueryData(enrolledProjKey, { projectsEnrolled: newEnrolledProjects });
      const projectData: ProjectGetQuery | undefined = apiCtx.getQueryData(projKey);
      if (!projectData?.projectGet) return;

      projectData.projectGet.title = title as any;
      apiCtx.setQueryData(projKey, projectData);
    },
  });

  const { mutate: collaboratorAdd } = api.projects.collaboratorAdd.useMutation({
    onMutate: async ({ input: { projectId, userId } }) => {
      const projectData: ProjectGetQuery | undefined = apiCtx.getQueryData(projKey);
      if (!projectData?.projectGet) return;

      projectData.projectGet.collaboratorsIds = [ ...projectData.projectGet.collaboratorsIds, userId ];
      apiCtx.setQueryData(projKey, projectData);
    },
  });

  const { mutate: collaboratorRemove } = api.projects.collaboratorRemove.useMutation({
    onMutate: ({ input: { userId } }) => {
      const projectData: ProjectGetQuery | undefined = cloneDeep(apiCtx.getQueryData(projKey));
      if (!projectData) return;

      projectData.projectGet.collaboratorsIds = projectData.projectGet.collaboratorsIds.filter((id) => id !== userId);

      projectData.projectGet.tasks = projectData.projectGet.tasks.map((task) => {
        const taskKey = api.projects.taskGet.getKey({ input: { taskId: task.id } });
        const taskData: TaskGetQuery | undefined = apiCtx.getQueryData(taskKey);

        if (taskData?.taskGet.assigneesIds.some((id) => id === userId)) {
          taskData.taskGet.assigneesIds = taskData.taskGet.assigneesIds.filter((id) => id !== userId);
          apiCtx.setQueryData(taskKey, taskData);
        }

        return { ...task, assigneesIds: task.assigneesIds.filter((id) => id !== userId) };
      });

      apiCtx.setQueryData(projKey, projectData);
    },
  });

  return {
    project: projectGet,

    collaboratorsIds: projectGet?.collaboratorsIds || [],
    columnCreate,
    taskMove,
    taskUpdate,
    columnClear,
    columnDelete,
    taskAssign,
    taskUnassign,
    nameUpdate,
    collaboratorAdd,
    collaboratorRemove,
    tasks: projectGet?.tasks || [],
    columns: projectGet?.columns || [],
    columnsOrder: projectGet?.columnsOrder || [],
  };
};
