import type { ReactNode } from 'react';
import type { Theme } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { styled } from '@mui/material/styles';
import type { NavColor } from '@/types/settings';
import { SIDE_NAV_WIDTH, useSections } from './config';
import { MobileNav } from './mobile-nav';
import { SideNav } from './side-nav';
import { useMobileNav } from './use-mobile-nav';
import { defaultPadding } from 'src/constants/default-padding';

const VerticalLayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const VerticalLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
  paddingTop: defaultPadding,
});

interface Props {
  children?: ReactNode
  navColor?: NavColor
}

export const DashboardLayout = ({ children, navColor }: Props) => {
  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));
  const mobileNav = useMobileNav();
  const sections = useSections();

  return (
    <>
      {lgUp && <SideNav color='blend-in' sections={sections} />}
      {!lgUp && <MobileNav color={navColor} onClose={mobileNav.handleClose} open={mobileNav.open} sections={sections} />}
      <VerticalLayoutRoot>
        <VerticalLayoutContainer>{children}</VerticalLayoutContainer>
      </VerticalLayoutRoot>
    </>
  );
};
