import { Avatar, Box, Checkbox, IconButton, Menu, MenuItem, Stack, SvgIcon, Tooltip } from '@mui/material';
import { usePopover } from '@hooks/use-popover';
import { useProject } from 'src/hooks/projects/use-project';
import { UserListItem } from '../user-list-item';
import { useCallback, useContext } from 'react';
import { Edit01 } from '@untitled-ui/icons-react';
import { TasksCtx } from 'src/contexts/tasks';

interface Props {
  projectId: string
}

export const ProjectCollaboratorSelect = ({ projectId, ...other }: Props) => {
  const popover = usePopover<HTMLButtonElement>();
  const { collaborators, organizationMembers, addCollaborator, removeCollaborator } = useProject({ projectId });
  const { toggleUserFilter, selectedUsers } = useContext(TasksCtx);

  const handleChange = useCallback(
    (id: string) => {
      if (collaborators.some((c) => c.id === id)) {
        removeCollaborator({ projectId, userId: id });
      } else {
        addCollaborator({ projectId, userId: id });
      }
    },
    [ projectId, collaborators ],
  );

  return (
    <>
      <Stack direction='row' alignItems='center'>
        {collaborators.map((c) => {
          const fullname =
            (c.firstname ? c.firstname : '') +
            (c.firstname ? ' ' : '') +
            (c.lastname ? c.lastname : !c.firstname && !c.lastname && c.email ? c.email : 'Anonymous');
          return (
            <IconButton sx={{ p: '4px' }} onClick={() => toggleUserFilter(c.id)} key={c.id}>
              <Tooltip title={fullname}>
                <Avatar
                  src={c.avatar}
                  key={`usr-${c.id}`}
                  sx={(theme) => ({
                    outline: selectedUsers.includes(c.id) ? `3px solid ${theme.palette.primary.main}` : undefined,
                  })}
                />
              </Tooltip>
            </IconButton>
          );
        })}

        <Box>
          <IconButton size='large' onClick={popover.handleOpen} ref={popover.anchorRef} {...other} sx={{ mt: 1, px: 1, ml: 1 }}>
            <SvgIcon>
              <Edit01 />
            </SvgIcon>
          </IconButton>
        </Box>
      </Stack>
      <Menu anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open}>
        {organizationMembers?.map((m) => (
          <MenuItem key={`opt-${m.id}`} onClick={() => handleChange(m.publicUserData?.userId as string)}>
            <Stack direction='row' alignItems='center'>
              <Checkbox checked={collaborators.some((c) => c.id === m.publicUserData?.userId)} />
              {m.publicUserData && (
                <UserListItem
                  user={{
                    id: m.publicUserData.userId,
                    avatar: m.publicUserData.profileImageUrl,
                    email: m.publicUserData.identifier,
                    firstname: m.publicUserData.firstName,
                    lastname: m.publicUserData.lastName,
                  }}
                  showEmail
                />
              )}
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
