import { createContext, useCallback, useState } from 'react';

export const TasksCtx = createContext({
  selectedUsers: [] as string[],
  toggleUserFilter: (id: string) => {},
  clearFilters: () => {},
});

export const TasksCtxProvider = ({ children }: { children: React.ReactNode }) => {
  const [ selectedUsers, setSelectedUsers ] = useState<string[]>([]);

  const clearFilters = useCallback(() => setSelectedUsers([]), []);

  const addUserFilter = useCallback((id: string) => {
    setSelectedUsers((s) => [ ...s, id ]);
  }, []);

  const removeUserFilter = useCallback((id: string) => {
    setSelectedUsers((s) => s.filter((u) => u !== id));
  }, []);

  const toggleUserFilter = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      removeUserFilter(userId);
    } else {
      addUserFilter(userId);
    }
  };

  return <TasksCtx.Provider value={{ selectedUsers, toggleUserFilter, clearFilters }}>{children}</TasksCtx.Provider>;
};
