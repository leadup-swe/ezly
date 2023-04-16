import { forwardRef } from "react";
import EyeIcon from "@untitled-ui/icons-react/build/esm/Eye";
import FileCheck03Icon from "@untitled-ui/icons-react/build/esm/FileCheck03";
import ListIcon from "@untitled-ui/icons-react/build/esm/List";
import MessageDotsCircleIcon from "@untitled-ui/icons-react/build/esm/MessageDotsCircle";
import {
  Avatar,
  AvatarGroup,
  Box,
  Card,
  CardMedia,
  Chip,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { useDisclosure } from "src/hooks/use-disclosure";
import { TaskModal } from "../task-modal";

// const useAssignees = (assigneesIds?: string[]): Member[] => {
//   return useSelector((state: RootState) => {
//     const { members } = state.kanban;

//     if (!assigneesIds) {
//       return [];
//     }

//     return assigneesIds.map((assigneeId: string) => members.byId[assigneeId]).filter((assignee) => !!assignee);
//   });
// };

interface Props {
  name: string
  dragging?: boolean
  taskId: string
}

export const TaskCard = forwardRef<HTMLDivElement, Props>(
  ({ name, dragging, taskId, ...other }, ref) => {
    const { open, mounted, onClose, onOpen } = useDisclosure({ delay: 120 });
    const hasAssignees = false;
    const hasAttachments = false;
    const hasChecklists = false;
    const hasComments = false;
    const hasLabels = false;
    const isSubscribed = false;

    return (
      <>
        <Card
          elevation={dragging ? 8 : 1}
          onClick={onOpen}
          ref={ref}
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "dark"
                ? "neutral.800"
                : "background.paper",
            ...(dragging && {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark"
                  ? "neutral.800"
                  : "background.paper",
            }),
            p: 3,
            userSelect: "none",
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? "neutral.700" : "neutral.50",
            },
            "&.MuiPaper-elevation1": {
              boxShadow: 1,
            },
          }}
          {...other}
        >
          {hasAttachments && (
            <CardMedia
              image=""
              sx={{
                borderRadius: 1.5,
                height: 120,
                mb: 1,
              }}
            />
          )}
          <Typography variant="subtitle1">{name}</Typography>
          {hasLabels && (
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                flexWrap: "wrap",
                m: -1,
                mt: 1,
              }}
            >
              {[].map((label) => (
                <Chip key={label} label={label} size="small" sx={{ m: 1 }} />
              ))}
            </Box>
          )}
          <Stack
            alignItems="center"
            direction="row"
            justifyContent="space-between"
            spacing={2}
          >
            <Stack
              alignItems="center"
              direction="row"
              spacing={2}
              sx={{ mt: 2 }}
            >
              {isSubscribed && (
                <SvgIcon color="action">
                  <EyeIcon />
                </SvgIcon>
              )}
              {hasAttachments && (
                <SvgIcon color="action">
                  <FileCheck03Icon />
                </SvgIcon>
              )}
              {hasChecklists && (
                <SvgIcon color="action">
                  <ListIcon />
                </SvgIcon>
              )}
              {hasComments && (
                <SvgIcon color="action">
                  <MessageDotsCircleIcon />
                </SvgIcon>
              )}
            </Stack>
            {hasAssignees && (
              <AvatarGroup max={3}>
                {[].map((assignee: any) => (
                  <Avatar
                    key={assignee.id}
                    src={assignee.avatar || undefined}
                  />
                ))}
              </AvatarGroup>
            )}
          </Stack>
        </Card>

        {mounted && (
          <TaskModal
            mounted={mounted}
            open={open}
            onClose={onClose}
            taskId={taskId}
          />
        )}
      </>
    );
  }
);

TaskCard.displayName = "TaskCard";
