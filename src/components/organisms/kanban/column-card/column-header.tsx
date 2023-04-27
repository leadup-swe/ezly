import type { ChangeEvent, KeyboardEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import DotsHorizontalIcon from '@untitled-ui/icons-react/build/esm/DotsHorizontal';
import { Chip, IconButton, Menu, MenuItem, Stack, SvgIcon, Typography } from '@mui/material';
import { usePopover } from '@hooks/use-popover';

interface Props {
  tasksCount: number
  name: string
  arrangement: `kanban` | `list`
  onClear?: () => void
  onDelete?: () => void
  onRename?: (name: string) => void
}

export const ColumnHeader = ({ tasksCount, name, arrangement, onClear, onDelete, onRename }: Props) => {
  const popover = usePopover<HTMLButtonElement>();
  const [ nameCopy, setNameCopy ] = useState<string>(name);

  const handleNameReset = useCallback(() => {
    setNameCopy(name);
  }, [ name ]);

  useEffect(
    () => {
      handleNameReset();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ name ],
  );

  const handleNameBlur = useCallback(() => {
    if (!nameCopy) {
      setNameCopy(name);
      return;
    }

    if (nameCopy === name) {
      return;
    }

    onRename?.(nameCopy);
  }, [ nameCopy, name, onRename ]);

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setNameCopy(event.target.value);
  }, []);

  const handleNameKeyUp = useCallback(
    (event: KeyboardEvent<HTMLInputElement>): void => {
      if (event.code === 'Enter') {
        if (nameCopy && nameCopy !== name) {
          onRename?.(nameCopy);
        }
      }
    },
    [ nameCopy, name, onRename ],
  );

  const handleClear = useCallback((): void => {
    popover.handleClose();
    onClear?.();
  }, [ popover, onClear ]);

  const handleDelete = useCallback((): void => {
    popover.handleClose();
    onDelete?.();
  }, [ popover, onDelete ]);

  const kanban = arrangement === 'kanban';

  return (
    <>
      <Stack
        alignItems='center'
        direction='row'
        justifyContent='space-between'
        spacing={2}
        sx={{
          pr: 2,
          py: 1,
          backgroundColor: kanban ? 'neutral' : 'neutral.100',
        }}
      >
        <Typography variant='subtitle2' px={2}>
          {nameCopy}
        </Typography>
        <Stack alignItems='center' direction='row' spacing={2}>
          <Chip label={tasksCount} />
          <IconButton edge='end' onClick={popover.handleOpen} ref={popover.anchorRef}>
            <SvgIcon>
              <DotsHorizontalIcon />
            </SvgIcon>
          </IconButton>
        </Stack>
      </Stack>
      <Menu
        anchorEl={popover.anchorRef.current}
        anchorOrigin={{
          horizontal: 'center',
          vertical: 'bottom',
        }}
        keepMounted
        onClose={popover.handleClose}
        open={popover.open}
      >
        <MenuItem onClick={handleClear}>{'Clear'}</MenuItem>
        <MenuItem onClick={handleDelete}>{'Delete'}</MenuItem>
      </Menu>
    </>
  );
};
