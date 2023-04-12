import { useContext } from 'react';
import { PreferencesCtx } from '@contexts/preferences';

export const useInterfaceMode = () => {
  const { preferences, toggleMode } = useContext(PreferencesCtx);
  return { mode: preferences.mode, toggleMode };
};
