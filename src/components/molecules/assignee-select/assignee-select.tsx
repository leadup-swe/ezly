import { useCallback } from "react";
import {
  Avatar,
  AvatarGroup,
  Button,
  Checkbox,
  Menu,
  MenuItem,
  Stack,
  SvgIcon,
  Typography,
} from "@mui/material";
import { usePopover } from "@hooks/use-popover";
import { User } from "src/types/user";
import { Edit01 } from "@untitled-ui/icons-react";
import { useProject } from "src/hooks/projects/use-project";

interface Props {
  label: string
  // Same as type as the value received above
  onChange: (id: string) => void
  options: User[]
  // This should accept string[], number[] or boolean[]
  value: string[]
  projectId: string
}

export const AssigneeSelect = ({
  label,
  onChange,
  options,
  value = [],
  projectId,
  ...other
}: Props) => {
  const popover = usePopover<HTMLButtonElement>();
  const { collaborators } = useProject({ projectId });

  const handleValueChange = useCallback(
    (id: string): void => {
      console.log(id);
      onChange(id);
    },
    [ onChange, value ]
  );

  return (
    <>
      <Button
        color="inherit"
        endIcon={
          <SvgIcon>
            <Edit01 />
          </SvgIcon>
        }
        onClick={popover.handleOpen}
        ref={popover.anchorRef}
        {...other}
      >
        {value.length ? (
          <Stack direction="row" alignItems="center">
            <Typography variant="button" textTransform="none" mr={1}>
              {"Assignees"}
            </Typography>
            <AvatarGroup>
              {value.map((id) => {
                const collaborator = collaborators.find((c) => c.id === id);
                return (
                  <Avatar
                    alt={`${collaborator?.firstname} ${collaborator?.lastname}`}
                    src={collaborator?.avatar}
                    key={id}
                    sx={{ width: 32, height: 32 }}
                  />
                );
              })}
            </AvatarGroup>
          </Stack>
        ) : (
          label
        )}
      </Button>
      <Menu
        anchorEl={popover.anchorRef.current}
        onClose={popover.handleClose}
        open={popover.open}
      >
        {options.map((option) => (
          <MenuItem
            key={option.id}
            onClick={() => handleValueChange(option.id)}
          >
            <Stack direction="row" alignItems="center">
              <Checkbox checked={value.includes(option.id)} value={option.id} />
              <Avatar
                alt={`${option.firstname} ${option.lastname}`}
                src={option.avatar}
                sx={{ width: 32, height: 32 }}
              />
              <Typography
                variant="body2"
                ml={1}
              >{`${option.firstname} ${option.lastname}`}</Typography>
              <Typography
                variant="body2"
                color="neutral.400"
                ml={1}
              >{`<${option.email}>`}</Typography>
            </Stack>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
