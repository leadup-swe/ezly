import { Draggable, Droppable } from 'react-beautiful-dnd';
import { Box } from '@mui/material';
import { ColumnHeader } from './column-header';
import { useProject } from 'src/hooks/projects/use-project';
import { TaskCard } from '../task-card';
import { TaskModal } from '../../task-modal';
import { useDisclosure } from 'src/hooks/use-disclosure';
import { useContext, useEffect, useState } from 'react';
import { trpc } from 'src/trpc';
import { LoadingScreen } from 'src/components/templates/loading-screen';
import { TasksCtx } from 'src/contexts/tasks';
import { TaskAdd } from '../task-add';

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
  const { data: task, isFetching } = trpc.projects.getTask.useQuery({ taskId: selectedTaskId }, { enabled: !!selectedTaskId, staleTime: Infinity });
  const { mutate: createTask, isLoading } = trpc.projects.createTask.useMutation({
    onSuccess: ({ columnId, taskId }) => {
      handleTaskOpen(taskId);
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
  });

  useEffect(() => {
    if (isFetching || isLoading) setLoading(true);
    if (!isFetching && !isLoading)
      setTimeout(() => {
        setLoading(false);
      }, 200);
  }, [ isFetching, isLoading ]);

  const column = columns[columnId];

  const trpcCtx = trpc.useContext();

  const handleTaskAdd = () => {
    createTask({ columnId });
  };

  const handleTaskOpen = (taskId: string) => {
    setSelectedTaskId(taskId);
    onOpen();
  };

  const handleTaskClose = () => {
    setSelectedTaskId('');
    onClose();
  };

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
              {columns[columnId].taskOrder.map((id, index) => {
                if (selectedUsers.length > 0 && !tasks[id].assigneesIds.some((assigneeId) => selectedUsers.includes(assigneeId))) return null;
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
                        <TaskCard dragging={snapshot.isDragging} task={tasks[id]} onClick={() => handleTaskOpen(id)} arrangement={arrangement} />
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
