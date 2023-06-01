import {
  useCollaboratorAddMutation,
  useCollaboratorRemoveMutation,
  useColumnCreateMutation,
  useColumnDeleteMutation,
  useProjectCreateMutation,
  useProjectUpdateMutation,
  useProjectsEnrolledQuery,
  useTaskAssignMutation,
  useTaskGetQuery,
  useTaskMoveMutation,
  useTaskUnassignMutation,
  useTaskUpdateMutation,
} from '../gql-gen';
import { useProjectGetQuery, useTaskCreateMutation } from './../gql-gen';

export const projects = {
  collaboratorAdd: { useMutation: useCollaboratorAddMutation, getKey: useCollaboratorAddMutation.getKey },
  collaboratorRemove: { useMutation: useCollaboratorRemoveMutation, getKey: useCollaboratorRemoveMutation.getKey },
  columnCreate: { useMutation: useColumnCreateMutation, getKey: useColumnCreateMutation.getKey },
  columnDelete: { useMutation: useColumnDeleteMutation, getKey: useColumnDeleteMutation.getKey },
  projectCreate: { useMutation: useProjectCreateMutation, getKey: useProjectCreateMutation.getKey },
  projectGet: { useQuery: useProjectGetQuery, getKey: useProjectGetQuery.getKey },
  projectUpdate: { useMutation: useProjectUpdateMutation, getKey: useProjectUpdateMutation.getKey },
  projectsEnrolled: { useQuery: useProjectsEnrolledQuery, getKey: useProjectsEnrolledQuery.getKey },
  taskAssign: { useMutation: useTaskAssignMutation, getKey: useTaskAssignMutation.getKey },
  taskCreate: { useMutation: useTaskCreateMutation, getKey: useTaskCreateMutation.getKey },
  taskGet: { useQuery: useTaskGetQuery, getKey: useTaskGetQuery.getKey },
  taskMove: { useMutation: useTaskMoveMutation, getKey: useTaskMoveMutation.getKey },
  taskUnassign: { useMutation: useTaskUnassignMutation, getKey: useTaskUnassignMutation.getKey },
  taskUpdate: { useMutation: useTaskUpdateMutation, getKey: useTaskUpdateMutation.getKey },
};
