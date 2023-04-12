import type { ChangeEvent, FC, FormEvent } from 'react';
import { useCallback, useState } from 'react';
import { Avatar, Box, Button, OutlinedInput, Stack } from '@mui/material';

interface TaskCommentAddProps {
  avatar?: string
  onAdd?: (message: string) => void
}

export const TaskCommentAdd: FC<TaskCommentAddProps> = (props) => {
  const { avatar, onAdd, ...other } = props;
  const [ message, setMessage ] = useState<string>('');

  const handleMessageChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setMessage(event.target.value);
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault();

      if (!message) {
        return;
      }

      onAdd?.(message);
      setMessage('');
    },
    [ message, onAdd ],
  );

  return (
    <Stack alignItems='flex-start' direction='row' spacing={2} {...other}>
      <Avatar src={avatar} />
      <Box component='form' onSubmit={handleSubmit} sx={{ flexGrow: 1 }}>
        <OutlinedInput fullWidth multiline onChange={handleMessageChange} placeholder='Write a comment...' rows={3} size='small' value={message} />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            mt: 3,
          }}
        >
          <Button size='small' type='submit' variant='contained'>
            {'Comment\r'}
          </Button>
        </Box>
      </Box>
    </Stack>
  );
};
