import { useQueryClient } from '@tanstack/react-query';
import { jobs } from './jobs';
import { projects } from './projects';

const useClient = () => {
  const queryClient = useQueryClient();
  return queryClient;
};

export const api = {
  projects,
  jobs,
  useClient,
};
