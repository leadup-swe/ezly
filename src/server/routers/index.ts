import { users } from './users';
import { organizations } from './organizations';
import { jobs } from './jobs';
import { projects } from './projects';
import { router } from '../trpc';

export const trpcRouter = router({
  users,
  organizations,
  jobs,
  projects,
});
export type TRPCRouter = typeof trpcRouter;
