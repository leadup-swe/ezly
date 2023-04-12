import type { ReactNode } from 'react';
import { List } from '@mui/material';

interface PropertyListProps {
  children: ReactNode
}

export const PropertyList = ({ children }: PropertyListProps) => {
  return <List disablePadding>{children}</List>;
};
