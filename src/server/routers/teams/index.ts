import { updateTeam } from './update-team';
import { removeTeamMember } from './remove-team-member';
import { addTeamMember } from './add-team-member';
import { createTeam } from './create-team';
import { deleteTeam } from './delete-team';
import { router } from 'src/server/trpc';

export const teamResolvers = router({
  createTeam,
  updateTeam,
  deleteTeam,
  addTeamMember,
  removeTeamMember,
});
