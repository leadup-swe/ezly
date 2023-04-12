import type { ChangeEvent } from 'react';
import { useCallback, useState } from 'react';
import PlusIcon from '@untitled-ui/icons-react/build/esm/Plus';
import { Box, Button, Card, OutlinedInput, Stack, SvgIcon, Typography } from '@mui/material';

interface Props {
  onAdd?: (name?: string) => void
}

export const TaskAdd = ({ onAdd, ...other }: Props) => {
  const [ isAdding, setIsAdding ] = useState<boolean>(false);
  const [ name, setName ] = useState<string>('');

  const handleNameChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  }, []);

  const handleAddInit = useCallback((): void => {
    setIsAdding(true);
  }, []);

  const handleAddCancel = useCallback((): void => {
    setIsAdding(false);
    setName('');
  }, []);

  const handleAddConfirm = useCallback(async (): Promise<void> => {
    onAdd?.(name);
    setIsAdding(false);
    setName('');
  }, [ name, onAdd ]);

  return (
    <Card
      sx={{
        backgroundColor: (theme) => (theme.palette.mode === 'dark' ? 'neutral.800' : 'background.paper'),
      }}
      {...other}
    >
      {isAdding ? (
        <Box sx={{ p: 2 }}>
          <OutlinedInput
            autoFocus
            fullWidth
            placeholder='My new task'
            name='name'
            onChange={handleNameChange}
            sx={{
              '& .MuiInputBase-input': {
                px: 2,
                py: 1,
              },
            }}
            value={name}
          />
          <Stack alignItems='center' direction='row' spacing={2} sx={{ mt: 2 }}>
            <Button
              onClick={handleAddConfirm}
              size='small'
              startIcon={
                <SvgIcon>
                  <PlusIcon />
                </SvgIcon>
              }
              variant='contained'
            >
              {'Add Task\r'}
            </Button>
            <Button color='inherit' onClick={handleAddCancel} size='small'>
              {'Cancel\r'}
            </Button>
          </Stack>
        </Box>
      ) : (
        <Stack
          alignItems='center'
          direction='row'
          onClick={handleAddInit}
          spacing={1}
          sx={{
            cursor: 'pointer',
            p: 2,
            userSelect: 'none',
          }}
        >
          <SvgIcon color='action'>
            <PlusIcon />
          </SvgIcon>
          <Typography color='text.secondary' variant='subtitle1'>
            {'Add Task\r'}
          </Typography>
        </Stack>
      )}
    </Card>
  );
};
