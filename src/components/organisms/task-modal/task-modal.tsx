import { Block } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import {
  Dialog,
  Box,
  Typography,
  TextField,
  Stack,
  Button,
} from "@mui/material";
import { useRouter } from "next/router";
import { defaultPadding } from "src/constants/default-padding";
import { useProject } from "src/hooks/projects/use-project";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "src/trpc";

interface NewTaskProps {
  columnId: string
  taskId?: never
}

interface EditTaskProps {
  columnId?: never
  taskId: string
}

type Props = {
  open: boolean
  mounted: boolean
  onClose: () => void
} & (NewTaskProps | EditTaskProps);

interface FormValues {
  title: string
}

export const TaskModal = ({
  open,
  mounted,
  onClose,
  columnId,
  taskId,
}: Props) => {
  const r = useRouter();
  const projectId = r.query.id as string;
  const { createTask, updateTask } = useProject({ projectId });
  const task = trpc.projects.getTask.useQuery(
    { taskId: taskId as string },
    { enabled: !!taskId && mounted, staleTime: Infinity }
  );

  const [ blocks, setBlocks ] = useState<Block[]>([]);
  const { handleSubmit, register } = useForm<FormValues>({
    defaultValues: { title: task.data?.title },
  });

  useEffect(() => {
    if (task.data?.description && open) {
      editor?.replaceBlocks([ blocks[0] ], JSON.parse(task.data.description));
    }
  }, [ task.dataUpdatedAt, open ]);

  const editor = useBlockNote({
    onEditorContentChange(editor) {
      setBlocks(editor.topLevelBlocks);
    },
  });

  const handleSave = ({ title }: FormValues) => {
    if (taskId) {
      updateTask({ taskId, title, description: JSON.stringify(blocks) });
    }

    if (columnId) {
      createTask({ title, columnId, description: JSON.stringify(blocks) });
    }

    onClose();
  };

  if (taskId && !task.data) return null;

  return (
    <Dialog maxWidth="md" open={open} onClose={onClose} fullWidth>
      <Box p={defaultPadding}>
        <TextField
          fullWidth
          label="Task"
          sx={{ mt: `4px` }}
          {...register(`title`)}
          defaultValue={task.data?.title}
        />
        <Box mt={2}>
          <Typography variant="caption">{"Description"}</Typography>
          <Box
            mt="4px"
            overflow="hidden"
            sx={{
              py: 1,
              borderRadius: 1,
              border: `1px solid #E5E7EB`,
              minHeight: `200px`,
            }}
          >
            <BlockNoteView editor={editor} />
          </Box>
        </Box>
        <Stack direction="row" justifyContent="flex-end" mt={defaultPadding}>
          <Button variant="contained" onClick={handleSubmit(handleSave)}>
            {"Save"}
          </Button>
          <Button variant="outlined" sx={{ ml: `12px` }} onClick={onClose}>
            {"Cancel"}
          </Button>
        </Stack>
      </Box>
    </Dialog>
  );
};
