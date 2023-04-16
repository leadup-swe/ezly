import { useCallback } from "react";
import type { DropResult } from "react-beautiful-dnd";
import { DragDropContext } from "react-beautiful-dnd";
import { Box, Stack, Typography } from "@mui/material";
import { ColumnCard } from "@organisms/kanban/column-card";
import { ColumnAdd } from "@organisms/kanban/column-add";
import { NextPageWithLayout } from "src/types/next";
import { DashboardLayout } from "src/components/templates/dashboard-layout";
import { useRouter } from "next/router";
import { useProject } from "src/hooks/projects/use-project";

const Page: NextPageWithLayout = () => {
  const r = useRouter();
  const projectId = r.query.id as string;
  const {
    project,
    columnsOrder,
    createColumn,
    moveTask,
    clearColumn,
    deleteColumn,
  } = useProject({ projectId });

  const handleDragEnd = useCallback(
    async ({ source, destination }: DropResult) => {
      if (!destination) return;
      if (
        source.droppableId === destination.droppableId &&
        source.index === destination.index
      )
        return;

      moveTask({
        projectId,
        sourceColumnId: source.droppableId,
        sourceIndex: source.index,
        destinationColumnId: destination.droppableId,
        destinationIndex: destination.index,
      });
    },
    [ projectId ]
  );

  const handleColumnAdd = useCallback(
    async (name?: string) => {
      createColumn({ name: name || `untitled`, projectId });
    },
    [ projectId ]
  );

  const handleColumnClear = useCallback((columnId: string) => {
    clearColumn({ columnId });
  }, []);

  const handleColumnDelete = useCallback((columnId: string) => {
    deleteColumn({ columnId });
  }, []);

  const handleColumnRename = useCallback(
    async (columnId: string, name: string): Promise<void> => {
      return;
    },
    []
  );

  if (project.isLoading || !project.data) return null;

  return (
    <>
      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          overflow: "hidden",
          pt: 8,
        }}
      >
        <Box sx={{ px: 3 }}>
          <Typography variant="h4">{project.data.title}</Typography>
        </Box>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexShrink: 1,
              overflowX: "auto",
              overflowY: "hidden",
              px: 3,
              py: 3,
            }}
          >
            <Stack alignItems="flex-start" direction="row" spacing={3}>
              {columnsOrder.map((id) => (
                <ColumnCard
                  key={id}
                  projectId={projectId}
                  columnId={id}
                  onClear={() => handleColumnClear(id)}
                  onDelete={() => handleColumnDelete(id)}
                  onRename={(name) => handleColumnRename(id, name)}
                />
              ))}
              <ColumnAdd onAdd={handleColumnAdd} />
            </Stack>
          </Box>
        </DragDropContext>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

export default Page;
