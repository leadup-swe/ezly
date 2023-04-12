import { updateTeam } from './update-team';
import { removeTeamMember } from './remove-team-member';
import { addTeamMember } from './add-team-member';
import { createTeam } from './create-team';
import { deleteTeam } from './delete-team';
import { trpcServer } from '@api/core/trpc-server';

export const teamResolvers = trpcServer.router({
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
});
