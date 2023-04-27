import { hello } from './hello';
import { updateProjectName } from './update-project-name';
import { unassignTask } from './unassign-task';
import { assignTask } from './assign-task';
import { clearColumn } from './clear-column';
import { updateTask } from './update-task';
import { getTask } from './get-task';
import { moveTask } from './move-task';
import { createTask } from './create-task';
import { getProject } from './get-project';
import { enrolledProjects } from './enrolled-projects';
import { createColumn } from './create-column';
import { updateProject } from './update-project';
import { addCollaborators } from './add-collaborators';
import { removeCollaborator } from './remove-collaborator';
import { addCollaborator } from './add-collaborator';
import { createProject } from './create-project';
import { router } from 'src/server/trpc';
import { deleteColumn } from './delete-column';

export const projects = router({
  createProject,
  updateProject,
  addCollaborator,
  removeCollaborator,
  addCollaborators,
  createColumn,
  enrolledProjects,
  getProject,
  createTask,
  moveTask,
  getTask,
  updateTask,
  clearColumn,
  deleteColumn,
  assignTask,
  unassignTask,
  updateProjectName,
  hello,
});
