import { ChangeEvent } from "react";
import { useCallback, useState } from "react";
import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import {
  Box,
  Button,
  Card,
  Dialog,
  Stack,
  SvgIcon,
  TextField,
  Typography,
} from "@mui/material";
import { useDisclosure } from "src/hooks/use-disclosure";
import { Block, BlockNoteEditor } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { defaultPadding } from "src/constants/default-padding";
import "@blocknote/core/style.css";

interface Props {
  onAdd?: (name?: string) => void
}

export const TaskAdd = ({ onAdd, ...other }: Props) => {
  const [ name, setName ] = useState<string>("");
  const { open, onOpen, onClose } = useDisclosure();
  const [ blocks, setBlocks ] = useState<Block[]>([]);

  const editor: BlockNoteEditor | null = useBlockNote({
    onEditorContentChange(editor) {
      setBlocks(editor.topLevelBlocks);
    },
  });

  console.log(blocks);
  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      setName(event.target.value);
    },
    []
  );

  const handleAddConfirm = useCallback(async (): Promise<void> => {
    onAdd?.(name);
  }, [ onAdd ]);

  return (
    <Card
      sx={{
        backgroundColor: (theme) =>
          theme.palette.mode === "dark" ? "neutral.800" : "background.paper",
      }}
      {...other}
    >
      <Stack
        alignItems="center"
        direction="row"
        onClick={onOpen}
        spacing={1}
        sx={{
          cursor: "pointer",
          p: 2,
          userSelect: "none",
        }}
      >
        <SvgIcon color="action">
          <PlusIcon />
        </SvgIcon>
        <Typography color="text.secondary" variant="subtitle1">
          {"Add Task\r"}
        </Typography>
      </Stack>
      <Dialog maxWidth="sm" open={open} onClose={onClose} fullWidth>
        <Box p={defaultPadding}>
          <Typography variant="caption">{"Task name"}</Typography>

          <TextField fullWidth label="Write a task name" sx={{ mt: `4px` }} />
          <Box mt={2}>
            <Typography variant="caption">{"Description"}</Typography>
            <Box
              mt="4px"
              overflow="hidden"
              sx={{
                py: 1,
                borderRadius: 1,
                border: (theme) => `1px solid #E5E7EB`,
                minHeight: `200px`,
              }}
              onClick={() => ref.current?.focus()}
            >
              <BlockNoteView editor={editor} />
            </Box>
          </Box>
          <Stack direction="row" justifyContent="flex-end">
            <Button>{"Save"}</Button>
          </Stack>
        </Box>
      </Dialog>
    </Card>
  );
};
