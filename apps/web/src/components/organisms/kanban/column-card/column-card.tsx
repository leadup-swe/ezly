import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Box } from '@mui/material';
import { ColumnHeader } from './column-header';
import { useProject } from 'src/hooks/projects/use-project';
import { TaskCard } from '../task-card';
import { TaskModal } from '../../task-modal';
import { useDisclosure } from 'src/hooks/use-disclosure';
import { useContext, useEffect, useState } from 'react';
import { LoadingScreen } from 'src/components/templates/loading-screen';
import { TasksCtx } from 'src/contexts/tasks';
import { TaskAdd } from '../task-add';
import { api } from 'src/api';
import { ProjectGetQuery } from 'src/api/gql-gen';

interface Props {
  projectId: string
  columnId: string
  arrangement: `kanban` | `list`
  onClear?: () => void
  onDelete?: () => void
  onRename?: (name: string) => void
}

export const ColumnCard = ({ projectId, columnId, arrangement, onClear, onDelete, onRename, ...other }: Props) => {
  const { columns, tasks } = useProject({ projectId });
  const { selectedUsers } = useContext(TasksCtx);
  const { open, onOpen, onClose } = useDisclosure();
  const [ loading, setLoading ] = useState(false);
  const [ selectedTaskId, setSelectedTaskId ] = useState('');
  const { data: { taskGet: task } = {}, isFetching } = api.projects.taskGet.useQuery(
    { input: { taskId: selectedTaskId } },
    { enabled: !!selectedTaskId, staleTime: Infinity },
  );

  const apiCtx = api.useClient();
  const { mutate: createTask, isLoading } = api.projects.taskCreate.useMutation({
    onSuccess: ({ taskCreate: { columnId, taskId } }) => {
      handleTaskOpen(taskId);
      const key = api.projects.projectGet.getKey({ input: { projectId } });
      const projectData: ProjectGetQuery | undefined = apiCtx.getQueryData(key);
      if (!projectData) return;
      const project = projectData.projectGet;

      console.log(projectData);
      const newTask = { id: taskId, title: `new task`, subTaskCount: 0, assigneesIds: [] };

      const newData: ProjectGetQuery = {
        projectGet: {
          ...project,
          columns: [
            ...project.columns.map((column) => {
              if (column.id === columnId) {
                return {
                  ...column,
                  taskOrder: [ ...column.taskOrder, taskId ],
                };
              }
              return column;
            }),
          ],
          tasks: [ ...project.tasks, newTask ],
        },
      };

      apiCtx.setQueryData(key, newData);
    },
  });

  useEffect(() => {
    if (isFetching || isLoading) setLoading(true);
    if (!isFetching && !isLoading)
      setTimeout(() => {
        setLoading(false);
      }, 200);
  }, [ isFetching, isLoading ]);

  const handleTaskAdd = () => {
    createTask({ input: { columnId } });
  };

  const handleTaskOpen = (taskId: string) => {
    setSelectedTaskId(taskId);
    onOpen();
  };

  const handleTaskClose = () => {
    setSelectedTaskId('');
    onClose();
  };

  const column = columns.find((column) => column.id === columnId);
  if (!column || !columns || !tasks) return null;
  const tasksCount = column.taskOrder.length;
  const kanban = arrangement === `kanban`;
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        maxHeight: '100%',
        overflowX: 'hidden',
        overflowY: 'hidden',
        width: kanban ? { xs: 300, sm: 340 } : `100%`,
      }}
      {...other}
    >
      <ColumnHeader name={column.name} onClear={onClear} onDelete={onDelete} onRename={onRename} tasksCount={tasksCount} arrangement={arrangement} />
      <Box
        sx={{
          backgroundColor: kanban ? 'neutral.100' : 'neutral',
          borderRadius: 2.5,
        }}
      >
        <Droppable droppableId={columnId} type='task'>
          {(droppableProvider): JSX.Element => (
            <Box
              ref={droppableProvider.innerRef}
              sx={{
                flexGrow: 1,
                minHeight: kanban ? 80 : 0,
                overflowY: 'auto',
                px: kanban ? 1.5 : 0,
                pt: kanban ? 0.5 : 0,
              }}
            >
              {column.taskOrder.map((id, index) => {
                const task = tasks.find((task) => task.id === id);
                if (selectedUsers.length > 0 && !task?.assigneesIds.some((assigneeId) => selectedUsers.includes(assigneeId))) return null;
                return (
                  <Draggable key={id} draggableId={id} index={index}>
                    {(draggableProvided, snapshot): JSX.Element => (
                      <Box
                        ref={draggableProvided.innerRef}
                        style={{ ...draggableProvided.draggableProps.style }}
                        sx={{ outline: 'none', py: kanban ? 1 : 0 }}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                      >
                        <TaskCard dragging={snapshot.isDragging} task={task} onClick={() => handleTaskOpen(id)} arrangement={arrangement} />
                      </Box>
                    )}
                  </Draggable>
                );
              })}
              {droppableProvider.placeholder}
              <Box sx={{ pt: kanban ? 1 : 0, pb: kanban ? 1.5 : 0 }}>
                <TaskAdd onClick={handleTaskAdd} arrangement={arrangement} />
              </Box>
            </Box>
          )}
        </Droppable>
      </Box>
      {loading && <LoadingScreen />}
      {task && <TaskModal open={open} onClose={handleTaskClose} task={task as any} />}
    </Box>
  );
};
