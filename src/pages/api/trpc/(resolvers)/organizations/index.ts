import { trpcServer } from '../../(core)/trpc-server';
import { createOrganization } from './create-organization';

export const organizations = trpcServer.router({
  createOrganization,
});
