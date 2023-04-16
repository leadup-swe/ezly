import PlusIcon from "@untitled-ui/icons-react/build/esm/Plus";
import { Card, Stack, SvgIcon, Typography } from "@mui/material";
import { useDisclosure } from "src/hooks/use-disclosure";
import "@blocknote/core/style.css";
import { TaskModal } from "../task-modal";

interface Props {
  columnId: string
}
export const TaskAdd = ({ columnId, ...other }: Props) => {
  const { open, mounted, onOpen, onClose } = useDisclosure({ delay: 120 });

  return (
    <>
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
          sx={{ cursor: "pointer", p: 2, userSelect: "none" }}
        >
          <SvgIcon color="action">
            <PlusIcon />
          </SvgIcon>
          <Typography color="text.secondary" variant="subtitle1">
            {"Add Task"}
          </Typography>
        </Stack>
      </Card>
      {mounted && (
        <TaskModal
          mounted={mounted}
          open={open}
          onClose={onClose}
          columnId={columnId}
        />
      )}
    </>
  );
};
