import { Block } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import {
  Dialog,
  Box,
  Stack,
  Button,
  IconButton,
  SvgIcon,
  Container,
} from "@mui/material";
import { useRouter } from "next/router";
import { defaultPadding } from "src/constants/default-padding";
import { useProject } from "src/hooks/projects/use-project";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { trpc } from "src/trpc";
import { ArrowLeft } from "@untitled-ui/icons-react";
import { TitleInput } from "src/components/atoms/title-input";
import { MultiSelect } from "src/components/molecules/multi-select";
import { AssigneeSelect } from "src/components/molecules/assignee-select";

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
  const { createTask, updateTask, collaborators, assignTask } = useProject({
    projectId,
  });
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

  const handleAssigneeChange = (id: string) => {
    assignTask({ taskId: taskId as string, userId: id });
  };

  if (taskId && !task.data) return null;

  return (
    <Dialog maxWidth="md" open={open} onClose={onClose} fullScreen>
      <Stack direction="row" p={defaultPadding}>
        <IconButton size="small" onClick={onClose}>
          <SvgIcon fontSize="small">
            <ArrowLeft />
          </SvgIcon>
        </IconButton>
      </Stack>
      <Stack flex={1} justifyContent="center">
        <Container maxWidth="lg">
          <Stack direction="column">
            <TitleInput
              placeholder="Title"
              defaultValue={task.data?.title}
              fullWidth
              {...register(`title`)}
            />
            <Stack direction="row" ml={-2}>
              <MultiSelect
                options={[ { label: `To-do`, value: `id` } ]}
                label="Status"
              />
              <AssigneeSelect
                projectId={projectId}
                options={collaborators}
                label="Select assignees"
                onChange={handleAssigneeChange}
                value={task.data ? task.data.assignees.map((a) => a.id) : []}
              />
            </Stack>
          </Stack>

          <Box mt={2}>
            {/* <Typography variant="caption">{"Description"}</Typography> */}
            <Box
              mt="4px"
              sx={{
                minHeight: `50vh`,
                ml: -6,
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
        </Container>
      </Stack>
    </Dialog>
  );
};
