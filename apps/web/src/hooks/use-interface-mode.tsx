import { useContext } from 'react';
import { OrganizationCtx } from 'src/contexts/organization';

export const useInterfaceMode = () => {
  const { preferences, toggleMode } = useContext(OrganizationCtx);
  return { mode: preferences.mode, toggleMode };
};
