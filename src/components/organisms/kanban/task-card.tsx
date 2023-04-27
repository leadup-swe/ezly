import { forwardRef, useContext } from 'react';
import { Avatar, AvatarGroup, Card, Stack, Tooltip, Typography } from '@mui/material';
import { GetProjectOutput } from 'src/server/routers/projects/get-project';
import { OrganizationCtx } from 'src/contexts/organization';

interface Props {
  task?: GetProjectOutput['tasks'][0]
  dragging?: boolean
  arrangement: `kanban` | `list`
  onClick: (id: string) => void
}

export const TaskCard = forwardRef<HTMLDivElement, Props>(({ task, dragging, arrangement, onClick, ...other }, ref) => {
  const { members } = useContext(OrganizationCtx);

  const hasAttachments = false;
  const hasChecklists = false;
  const hasComments = false;
  const isSubscribed = false;
  const kanban = arrangement === `kanban`;

  return (
    <Card
      elevation={dragging ? 8 : kanban ? 1 : 0}
      onClick={onClick as any}
      ref={ref}
      sx={(theme) => ({
        borderRadius: kanban ? 2 : 0,
        borderTop: kanban ? 0 : 1,
        borderBottom: kanban ? 0 : 1,
        borderColor: kanban ? 'transparent' : 'divider',
        backgroundColor: kanban ? 'background.paper' : 'transparent',
        ...(dragging && {
          backgroundColor: theme.palette.mode === 'dark' ? 'neutral.800' : 'background.paper',
        }),
        px: kanban ? 3 : 2,
        py: kanban ? 3 : 1,
        userSelect: 'none',
        '&:hover': {
          backgroundColor: theme.palette.mode === 'dark' ? 'neutral.700' : 'neutral.50',
        },
        '&.MuiPaper-elevation1': {
          boxShadow: 1,
        },
      })}
      {...other}
    >
      <Stack direction={kanban ? `column` : `row`} alignItems={kanban ? `flex-start` : `center`} justifyContent='space-between' spacing={2}>
        <Typography variant='subtitle1'>{task?.title}</Typography>
        {task?.assigneesIds && (
          <AvatarGroup max={3}>
            {task?.assigneesIds.map((id: any) => {
              const user = members?.find((m) => m.publicUserData?.userId === id)?.publicUserData;
              const fullname =
                (user?.firstName ? user.firstName : '') +
                (user?.firstName ? ' ' : '') +
                (user?.lastName ? user?.lastName : !user?.firstName && !user?.lastName && user?.identifier ? user.identifier : 'Anonymous');
              return (
                <Tooltip title={fullname} key={user?.userId}>
                  <Avatar key={id} src={user?.profileImageUrl} />
                </Tooltip>
              );
            })}
          </AvatarGroup>
        )}
      </Stack>
    </Card>
  );
});

TaskCard.displayName = 'TaskCard';
