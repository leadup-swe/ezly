import type { FC } from 'react';
import CreditCard01Icon from '@untitled-ui/icons-react/build/esm/CreditCard01';
import Settings04Icon from '@untitled-ui/icons-react/build/esm/Settings04';
import { Box, Divider, ListItemButton, ListItemIcon, ListItemText, Popover, SvgIcon, Typography } from '@mui/material';
import { useMockedUser } from '@hooks/use-mocked-user';
import { paths } from '../../../paths';
import Link from 'next/link';
import { useRouter } from 'next/router';

interface AccountPopoverProps {
  anchorEl: null | Element
  onClose?: () => void
  open?: boolean
}

export const AccountPopover: FC<AccountPopoverProps> = (props) => {
  const { anchorEl, onClose, open, ...other } = props;
  const r = useRouter();
  const user = useMockedUser();

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{
        horizontal: 'center',
        vertical: 'bottom',
      }}
      disableScrollLock
      onClose={onClose}
      open={!!open}
      PaperProps={{ sx: { width: 200 } }}
      {...other}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant='body1'>{user.name}</Typography>
        <Typography color='text.secondary' variant='body2'>
          {'demo@devias.io'}
        </Typography>
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}>
        <ListItemButton
          component={Link}
          href={paths.dashboard.account}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize='small'>
              <Settings04Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography variant='body1'>{'Settings'}</Typography>} />
        </ListItemButton>
        <ListItemButton
          component={Link}
          href={paths.dashboard.home}
          onClick={onClose}
          sx={{
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <ListItemIcon>
            <SvgIcon fontSize='small'>
              <CreditCard01Icon />
            </SvgIcon>
          </ListItemIcon>
          <ListItemText primary={<Typography variant='body1'>{'Billing'}</Typography>} />
        </ListItemButton>
      </Box>
    </Popover>
  );
};
