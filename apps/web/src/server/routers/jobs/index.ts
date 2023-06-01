import { newJob } from './new';
import { router } from 'src/server/trpc';

export const jobs = router({
  newJob,
});
