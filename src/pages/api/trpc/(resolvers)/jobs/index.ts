import { newJob } from './new';
import { trpcServer } from '@api/core/trpc-server';

export const jobs = trpcServer.router({
  newJob,
});
