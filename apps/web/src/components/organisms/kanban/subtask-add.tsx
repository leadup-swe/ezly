import { Button, Card, InputBase, Stack, Typography } from '@mui/material';
import { useRef, useState } from 'react';

export const SubtaskAdd = () => {
  const [ adding, setAdding ] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    if (adding) return;
    setAdding(true);
  };

  const handleCancel = () => {
    setAdding(false);
  };

  const handleSave = () => {
    setAdding(false);
    console.log(inputRef.current?.value);
  };

  return (
    <Card sx={{ backgroundColor: `neutral.100`, borderRadius: 1 }} elevation={1}>
      <Stack
        alignItems='center'
        direction='row'
        onClick={handleClick}
        spacing={1}
        sx={{ cursor: 'pointer', height: `55px`, px: 2, userSelect: 'none' }}
        flex={1}
      >
        {adding ? (
          <Stack direction='row' spacing={1} flex={1}>
            <InputBase size='small' placeholder='Subtask name' autoFocus fullWidth inputProps={{ style: { padding: 0 } }} inputRef={inputRef} />
            <Button variant='contained' color='primary' size='small' onClick={handleSave}>
              {'Save'}
            </Button>
            <Button variant='outlined' size='small' onClick={handleCancel}>
              {'Cancel'}
            </Button>
          </Stack>
        ) : (
          <Typography color='text.secondary' variant='subtitle2'>
            {'Add Subtask...'}
          </Typography>
        )}
      </Stack>
    </Card>
  );
};
