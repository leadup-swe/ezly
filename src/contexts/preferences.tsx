import { createContext, ReactNode, useCallback, useState } from 'react';

const initialValues = {
  mode: `client`,
};

export type TPreferences = typeof initialValues;

export const PreferencesCtx = createContext<{
  preferences: TPreferences
  toggleMode: () => void
}>({ preferences: initialValues, toggleMode: () => null });

export const PreferencesCtxProvider = ({ children }: { children: ReactNode }) => {
  const [ value, setValue ] = useState(initialValues);

  const toggleMode = useCallback(() => {
    console.log();
  }, [ value.mode ]);

  return <PreferencesCtx.Provider value={{ preferences: value, toggleMode }}>{children}</PreferencesCtx.Provider>;
};
