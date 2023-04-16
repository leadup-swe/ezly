import { Draggable, Droppable } from "react-beautiful-dnd";
import { Box } from "@mui/material";
import { TaskAdd } from "../task-add";
import { ColumnHeader } from "./column-header";
import { useProject } from "src/hooks/projects/use-project";
import { TaskCard } from "../task-card";

interface Props {
  projectId: string
  columnId: string
  onClear?: () => void
  onDelete?: () => void
  onRename?: (name: string) => void
}

export const ColumnCard = ({
  projectId,
  columnId,
  onClear,
  onDelete,
  onRename,
  ...other
}: Props) => {
  const { columns, tasks } = useProject({ projectId });

  const column = columns[columnId];
  if (!column || !columns || !tasks) return null;
  const tasksCount = column.taskOrder.length;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        maxHeight: "100%",
        overflowX: "hidden",
        overflowY: "hidden",
        width: { xs: 300, sm: 380 },
      }}
      {...other}
    >
      <ColumnHeader
        name={column.name}
        onClear={onClear}
        onDelete={onDelete}
        onRename={onRename}
        tasksCount={tasksCount}
      />
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "neutral.900" : "neutral.100",
          borderRadius: 2.5,
        }}
      >
        <Droppable droppableId={columnId} type="task">
          {(droppableProvider): JSX.Element => (
            <Box
              ref={droppableProvider.innerRef}
              sx={{
                flexGrow: 1,
                minHeight: 80,
                overflowY: "auto",
                px: 3,
                pt: 1.5,
              }}
            >
              {columns[columnId].taskOrder.map((id, index) => (
                <Draggable key={id} draggableId={id} index={index}>
                  {(draggableProvided, snapshot): JSX.Element => (
                    <Box
                      ref={draggableProvided.innerRef}
                      style={{ ...draggableProvided.draggableProps.style }}
                      sx={{ outline: "none", py: 1.5 }}
                      {...draggableProvided.draggableProps}
                      {...draggableProvided.dragHandleProps}
                    >
                      <TaskCard
                        dragging={snapshot.isDragging}
                        name={tasks[id].title}
                        taskId={id}
                      />
                    </Box>
                  )}
                </Draggable>
              ))}
              {droppableProvider.placeholder}
            </Box>
          )}
        </Droppable>
        <Box sx={{ pt: 1.5, pb: 3, px: 3 }}>
          <TaskAdd columnId={columnId} />
        </Box>
      </Box>
    </Box>
  );
};
