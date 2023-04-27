import { Box, Stack } from '@mui/material';
import { useCallback } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { ColumnAdd } from './column-add';
import { ColumnCard } from './column-card';
import { useProject } from 'src/hooks/projects/use-project';

interface Props {
  projectId: string
  arrangement: `kanban` | `list`
}

export const Board = ({ projectId, arrangement }: Props) => {
  const { columnsOrder, createColumn, moveTask, clearColumn, deleteColumn } = useProject({ projectId });

  const handleDragEnd = useCallback(
    async ({ source, destination }: DropResult) => {
      if (!destination) return;
      if (source.droppableId === destination.droppableId && source.index === destination.index) return;

      moveTask({
        projectId,
        sourceColumnId: source.droppableId,
        sourceIndex: source.index,
        destinationColumnId: destination.droppableId,
        destinationIndex: destination.index,
      });
    },
    [ projectId ],
  );

  const handleColumnAdd = useCallback(
    async (name?: string) => {
      createColumn({ name: name || `untitled`, projectId });
    },
    [ projectId ],
  );

  const handleColumnClear = useCallback((columnId: string) => {
    clearColumn({ columnId });
  }, []);

  const handleColumnDelete = useCallback((columnId: string) => {
    deleteColumn({ columnId });
  }, []);

  const handleColumnRename = useCallback(async (columnId: string, name: string): Promise<void> => {
    return;
  }, []);

  const kanban = arrangement === `kanban`;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          flexShrink: 1,
          overflowX: 'auto',
          overflowY: 'hidden',
          px: 3,
          py: 3,
        }}
      >
        <Stack alignItems='flex-start' direction={arrangement === `kanban` ? 'row' : `column`} flex={1} spacing={kanban ? 1 : 0}>
          {columnsOrder.map((id) => (
            <ColumnCard
              key={id}
              projectId={projectId}
              columnId={id}
              onClear={() => handleColumnClear(id)}
              onDelete={() => handleColumnDelete(id)}
              onRename={(name) => handleColumnRename(id, name)}
              arrangement={arrangement}
            />
          ))}
          <ColumnAdd onAdd={handleColumnAdd} />
        </Stack>
      </Box>
    </DragDropContext>
  );
};
