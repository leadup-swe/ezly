import { Card, Stack, Typography } from '@mui/material';

interface Props {
  onClick: () => void
  arrangement: `kanban` | `list`
}

export const TaskAdd = ({ onClick, arrangement, ...other }: Props) => {
  const kanban = arrangement === `kanban`;

  return (
    <Card
      sx={{
        backgroundColor: kanban ? 'background.paper' : `neutral`,
        borderRadius: kanban ? 2 : 0,
      }}
      elevation={kanban ? 1 : 0}
      {...other}
    >
      <Stack alignItems='center' direction='row' onClick={onClick} spacing={1} sx={{ cursor: 'pointer', p: 2, userSelect: 'none' }}>
        <Typography color='text.secondary' variant='subtitle2'>
          {'Add Task...'}
        </Typography>
      </Stack>
    </Card>
  );
};
