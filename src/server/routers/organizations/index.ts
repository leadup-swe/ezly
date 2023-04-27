import { router } from '../../trpc';
import { createOrganization } from './create-organization';

export const organizations = router({
  createOrganization,
});
