import { useCallback } from 'react';
import { Box, Button, Checkbox, Menu, MenuItem, Stack, Typography } from '@mui/material';
import { usePopover } from '@hooks/use-popover';
import { User } from 'src/types/user';
import { useProject } from 'src/hooks/projects/use-project';
import { UserListItem } from '../user-list-item';

interface Props {
  label: string
  onChange: (id: string) => void
  options: User[]
  value: string[]
  projectId: string
}

export const AssigneeSelect = ({ label, onChange, options, value = [], projectId, ...other }: Props) => {
  const popover = usePopover<HTMLButtonElement>();
  const { collaborators } = useProject({ projectId });

  const handleValueChange = useCallback(
    (id: string) => {
      onChange(id);
    },
    [ onChange, value ],
  );

  return (
    <>
      <Box>
        <Stack>
          <Typography variant='button' textTransform='capitalize'>
            {'Assignees'}
          </Typography>
        </Stack>
        <Button
          color={value.length ? `inherit` : `primary`}
          variant={value.length ? `text` : `outlined`}
          onClick={popover.handleOpen}
          ref={popover.anchorRef}
          {...other}
          sx={{ mt: 1, px: 1, ml: -1 }}
        >
          {value.length ? (
            <Stack direction='column' spacing={1} alignItems='flex-start'>
              {value.map((id) => {
                const user = collaborators.find((c) => c.id === id) as User;
                return <UserListItem user={user} trimName={26} key={`usr-${user.id}`} />;
              })}
            </Stack>
          ) : (
            `Select Assignees`
          )}
        </Button>
      </Box>
      <Menu anchorEl={popover.anchorRef.current} onClose={popover.handleClose} open={popover.open}>
        {options.map((option) => (
          <MenuItem onClick={() => handleValueChange(option.id)} key={`opt-${option.id}`}>
            <Stack direction='row' alignItems='center'>
              <Checkbox checked={value.includes(option.id)} value={option.id} />
              <UserListItem user={option} showEmail />
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
