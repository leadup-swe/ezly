import type { ListItemProps } from '@mui/material';
import { Box, ListItem, ListItemText, Typography } from '@mui/material';

type Direction = 'horizontal' | 'vertical';

interface PropertyListItemProps extends ListItemProps {
  align?: Direction
  label: string
  value?: string
}

export const PropertyListItem = ({ align = `vertical`, children, disableGutters, value, label, ...other }: PropertyListItemProps) => {
  return (
    <ListItem
      sx={{
        px: disableGutters ? 0 : 3,
        py: 1.5,
      }}
      {...other}
    >
      <ListItemText
        disableTypography
        primary={
          <Typography sx={{ minWidth: align === 'vertical' ? 'inherit' : 180 }} variant='subtitle2'>
            {label}
          </Typography>
        }
        secondary={
          <Box
            sx={{
              flex: 1,
              mt: align === 'vertical' ? 0.5 : 0,
            }}
          >
            {children || (
              <Typography color='text.secondary' variant='body2'>
                {value}
              </Typography>
            )}
          </Box>
        }
        sx={{
          display: 'flex',
          flexDirection: align === 'vertical' ? 'column' : 'row',
          my: 0,
        }}
      />
    </ListItem>
  );
};
