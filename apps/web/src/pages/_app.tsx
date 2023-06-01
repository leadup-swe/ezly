import { CssBaseline, Fade, ThemeProvider } from '@mui/material';
import { createTheme } from '../theme';
import { AppPropsWithLayout } from '@/types/next';
import '@locales/i18n';
import { useEffect, useState } from 'react';
import { SplashScreen } from '@templates/splash-screen';
import { Toaster } from '@molecules/toaster';
import { OrganizationCtxProvider } from 'src/contexts/organization';
import { trpc } from '../trpc';
import { ClerkProvider } from '@clerk/nextjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TasksCtxProvider } from 'src/contexts/tasks';


const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const [ loading, setLoading ] = useState(true);
  const theme = createTheme({
    colorPreset: 'indigo',
    contrast: 'normal',
    direction: 'ltr',
    paletteMode: 'light',
    responsiveFontSizes: true,
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Fade in={loading} unmountOnExit>
        <div>
          <SplashScreen />
        </div>
      </Fade>
      <ClerkProvider {...pageProps}>
        <OrganizationCtxProvider>
          <TasksCtxProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>

                {!loading && getLayout(<Component {...pageProps} />)}

            </LocalizationProvider>
          </TasksCtxProvider>
        </OrganizationCtxProvider>
      </ClerkProvider>
      <Toaster />
    </ThemeProvider>
  );
};

export default trpc.withTRPC(App);
