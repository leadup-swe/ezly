import type { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';
import { SideNavItem } from './side-nav-item';

interface Item {
  disabled?: boolean
  external?: boolean
  icon?: ReactNode
  items?: Item[]
  label?: ReactNode
  path?: string
  title: string
}

const renderItems = ({ depth = 0, items, pathname }: { depth?: number, items: Item[], pathname?: string | null }): JSX.Element[] =>
  items.reduce((acc: JSX.Element[], item) => reduceChildRoutes({ acc, depth, item, pathname }), []);

const reduceChildRoutes = ({ acc, depth, item, pathname }: { acc: JSX.Element[], depth: number, item: Item, pathname?: string | null }): Array<JSX.Element> => {
  const checkPath = !!(item.path && pathname);
  const partialMatch = checkPath ? pathname.includes(item.path as string) : false;
  const exactMatch = checkPath ? pathname === item.path : false;

  if (item.items) {
    acc.push(
      <SideNavItem
        active={partialMatch}
        depth={depth}
        disabled={item.disabled}
        icon={item.icon}
        key={item.title}
        label={item.label}
        open={partialMatch}
        title={item.title}
      >
        <Stack component='ul' spacing={0.5} sx={{ listStyle: 'none', m: 0, p: 0 }}>
          {renderItems({
            depth: depth + 1,
            items: item.items,
            pathname,
          })}
        </Stack>
      </SideNavItem>,
    );
  } else {
    acc.push(
      <SideNavItem
        active={exactMatch}
        depth={depth}
        disabled={item.disabled}
        external={item.external}
        icon={item.icon}
        key={item.title}
        label={item.label}
        path={item.path}
        title={item.title}
      />,
    );
  }

  return acc;
};

interface Props {
  items?: Item[]
  pathname?: string | null
  subheader?: string
  sectionComponent?: ReactNode
}

export const SideNavSection = ({ items = [], pathname, subheader = '', sectionComponent, ...other }: Props) => {
  return (
    <Stack
      component='ul'
      spacing={0.5}
      sx={{
        listStyle: 'none',
        m: 0,
        p: 0,
      }}
      {...other}
    >
      {subheader && (
        <Stack direction='row' alignItems='center' justifyContent='space-between'>
          <Typography fontSize={14} color='var(--nav-section-title-color)'>
            {subheader}
          </Typography>
          {sectionComponent}
        </Stack>
      )}
      {renderItems({ items, pathname })}
    </Stack>
  );
};
