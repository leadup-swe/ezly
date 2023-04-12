import type { FC } from 'react';
import CheckIcon from '@untitled-ui/icons-react/build/esm/Check';
import { Avatar, Button, Card, Stack, SvgIcon, Typography } from '@mui/material';

export const JobPreview: FC = () => (
  <Stack spacing={2}>
    <div>
      <Avatar
        sx={{
          backgroundColor: 'success.main',
          color: 'success.contrastText',
          height: 40,
          width: 40,
        }}
      >
        <SvgIcon>
          <CheckIcon />
        </SvgIcon>
      </Avatar>
      <Typography variant='h6' sx={{ mt: 2 }}>
        {"All done!\r"}
      </Typography>
      <Typography color='text.secondary' variant='body2'>
        {"Here’s a preview of your newly created job\r"}
      </Typography>
    </div>
    <Card variant='outlined'>
      <Stack
        alignItems='center'
        direction='row'
        flexWrap='wrap'
        justifyContent='space-between'
        sx={{
          px: 2,
          py: 1.5,
        }}
      >
        <div>
          <Typography variant='subtitle1'>{"Senior Backend Engineer"}</Typography>
          <Typography color='text.secondary' variant='caption'>
            {"Remote possible • $150k - $210K\r"}
          </Typography>
        </div>
        <Stack alignItems='center' direction='row' spacing={2}>
          <Typography color='text.secondary' variant='caption'>
            {"1 minute ago\r"}
          </Typography>
          <Button size='small'>{"Apply"}</Button>
        </Stack>
      </Stack>
    </Card>
  </Stack>
);
