import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

function fetcher<TData, TVariables>(query: string, variables?: TVariables) {
  return async (): Promise<TData> => {
    const res = await fetch(process.env.NEXT_PUBLIC_GQLURL as string, {
    method: "POST",
    ...({"credentials":"include","headers":{"Apollo-Require-Preflight":"true","Content-Type":"application/json"}}),
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();

    if (json.errors) {
      const { message } = json.errors[0];

      throw new Error(message);
    }

    return json.data;
  }
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type CollaboratorAddInput = {
  projectId: Scalars['String'];
  userId: Scalars['String'];
};

export type CollaboratorAddOutput = {
  __typename?: 'CollaboratorAddOutput';
  createdAt: Scalars['DateTime'];
  id: Scalars['String'];
  projectId: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  userId: Scalars['String'];
};

export type CollaboratorRemoveInput = {
  projectId: Scalars['String'];
  userId: Scalars['String'];
};

export type ColumnCreateInput = {
  name: Scalars['String'];
  projectId: Scalars['String'];
};

export type ColumnCreateOutput = {
  __typename?: 'ColumnCreateOutput';
  columnId: Scalars['String'];
};

export type ColumnDeleteInput = {
  columnId: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  collaboratorAdd: CollaboratorAddOutput;
  collaboratorRemove: Scalars['Boolean'];
  columnCreate: ColumnCreateOutput;
  columnDelete: Scalars['Boolean'];
  projectCreate: ProjectCreateOutput;
  projectUpdate: ProjectUpdateOutput;
  taskAssign: TaskAssignOutput;
  taskCreate: TaskCreateOutput;
  taskMove: Scalars['Boolean'];
  taskUnassign: Scalars['Boolean'];
  taskUpdate: TaskUpdateOutput;
};


export type MutationCollaboratorAddArgs = {
  input: CollaboratorAddInput;
};


export type MutationCollaboratorRemoveArgs = {
  input: CollaboratorRemoveInput;
};


export type MutationColumnCreateArgs = {
  input: ColumnCreateInput;
};


export type MutationColumnDeleteArgs = {
  input: ColumnDeleteInput;
};


export type MutationProjectCreateArgs = {
  input: ProjectCreateInput;
};


export type MutationProjectUpdateArgs = {
  input: ProjectUpdateInput;
};


export type MutationTaskAssignArgs = {
  input: TaskAssignInput;
};


export type MutationTaskCreateArgs = {
  input: TaskCreateInput;
};


export type MutationTaskMoveArgs = {
  input: TaskMoveInput;
};


export type MutationTaskUnassignArgs = {
  input: TaskUnassignInput;
};


export type MutationTaskUpdateArgs = {
  input: TaskUpdateInput;
};

export type ProjectCreateInput = {
  description?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  visibility?: InputMaybe<ProjectVisibility>;
};

export type ProjectCreateOutput = {
  __typename?: 'ProjectCreateOutput';
  projectId: Scalars['String'];
};

export type ProjectGetColumnOutput = {
  __typename?: 'ProjectGetColumnOutput';
  id: Scalars['String'];
  name: Scalars['String'];
  taskOrder: Array<Scalars['String']>;
};

export type ProjectGetInput = {
  projectId: Scalars['String'];
};

export type ProjectGetOutput = {
  __typename?: 'ProjectGetOutput';
  collaboratorsIds: Array<Scalars['String']>;
  columns: Array<ProjectGetColumnOutput>;
  columnsOrder: Array<Scalars['String']>;
  tasks: Array<ProjectGetTaskOutput>;
  title: Scalars['String'];
};

export type ProjectGetTaskOutput = {
  __typename?: 'ProjectGetTaskOutput';
  assigneesIds: Array<Scalars['String']>;
  id: Scalars['String'];
  subTaskCount: Scalars['Float'];
  title: Scalars['String'];
};

export type ProjectUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  projectId: Scalars['String'];
  status?: InputMaybe<Status>;
  title?: InputMaybe<Scalars['String']>;
  visibility?: InputMaybe<ProjectVisibility>;
};

export type ProjectUpdateOutput = {
  __typename?: 'ProjectUpdateOutput';
  columnsOrder: Array<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  status: Status;
  title: Scalars['String'];
  updatedAt: Scalars['DateTime'];
  visibility: ProjectVisibility;
};

export enum ProjectVisibility {
  Private = 'PRIVATE',
  Public = 'PUBLIC'
}

export type ProjectsEnrolledOutput = {
  __typename?: 'ProjectsEnrolledOutput';
  id: Scalars['String'];
  title: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  projectGet: ProjectGetOutput;
  projectsEnrolled: Array<ProjectsEnrolledOutput>;
  taskGet: TaskGetOutput;
};


export type QueryProjectGetArgs = {
  input: ProjectGetInput;
};


export type QueryTaskGetArgs = {
  input: TaskGetInput;
};

export enum Status {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Deleted = 'DELETED'
}

export type TaskAssignInput = {
  taskId: Scalars['String'];
  userId: Scalars['String'];
};

export type TaskAssignOutput = {
  __typename?: 'TaskAssignOutput';
  taskId: Scalars['String'];
  userId: Scalars['String'];
};

export type TaskCreateInput = {
  columnId: Scalars['String'];
};

export type TaskCreateOutput = {
  __typename?: 'TaskCreateOutput';
  columnId: Scalars['String'];
  taskId: Scalars['String'];
};

export type TaskGetInput = {
  taskId: Scalars['String'];
};

export type TaskGetOutput = {
  __typename?: 'TaskGetOutput';
  assigneesIds: Array<Scalars['String']>;
  columnId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  deadline?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  status: Status;
  subTasksOrder: Array<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type TaskMoveInput = {
  destinationColumnId: Scalars['String'];
  destinationIndex: Scalars['Float'];
  projectId: Scalars['String'];
  sourceColumnId: Scalars['String'];
  sourceIndex: Scalars['Float'];
};

export type TaskUnassignInput = {
  taskId: Scalars['String'];
  userId: Scalars['String'];
};

export type TaskUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  taskId: Scalars['String'];
  title?: InputMaybe<Scalars['String']>;
};

export type TaskUpdateOutput = {
  __typename?: 'TaskUpdateOutput';
  columnId: Scalars['String'];
  createdAt: Scalars['DateTime'];
  createdBy: Scalars['String'];
  deadline?: Maybe<Scalars['DateTime']>;
  description?: Maybe<Scalars['String']>;
  status: Status;
  subTasksOrder: Array<Scalars['String']>;
  taskId: Scalars['String'];
  title?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type CollaboratorAddMutationVariables = Exact<{
  input: CollaboratorAddInput;
}>;


export type CollaboratorAddMutation = { __typename?: 'Mutation', collaboratorAdd: { __typename?: 'CollaboratorAddOutput', createdAt: any, id: string, projectId: string, updatedAt: any, userId: string } };

export type CollaboratorRemoveMutationVariables = Exact<{
  input: CollaboratorRemoveInput;
}>;


export type CollaboratorRemoveMutation = { __typename?: 'Mutation', collaboratorRemove: boolean };

export type ColumnCreateMutationVariables = Exact<{
  input: ColumnCreateInput;
}>;


export type ColumnCreateMutation = { __typename?: 'Mutation', columnCreate: { __typename?: 'ColumnCreateOutput', columnId: string } };

export type ColumnDeleteMutationVariables = Exact<{
  input: ColumnDeleteInput;
}>;


export type ColumnDeleteMutation = { __typename?: 'Mutation', columnDelete: boolean };

export type ProjectCreateMutationVariables = Exact<{
  input: ProjectCreateInput;
}>;


export type ProjectCreateMutation = { __typename?: 'Mutation', projectCreate: { __typename?: 'ProjectCreateOutput', projectId: string } };

export type ProjectGetQueryVariables = Exact<{
  input: ProjectGetInput;
}>;


export type ProjectGetQuery = { __typename?: 'Query', projectGet: { __typename?: 'ProjectGetOutput', title: string, collaboratorsIds: Array<string>, columnsOrder: Array<string>, columns: Array<{ __typename?: 'ProjectGetColumnOutput', id: string, name: string, taskOrder: Array<string> }>, tasks: Array<{ __typename?: 'ProjectGetTaskOutput', assigneesIds: Array<string>, id: string, subTaskCount: number, title: string }> } };

export type ProjectUpdateMutationVariables = Exact<{
  input: ProjectUpdateInput;
}>;


export type ProjectUpdateMutation = { __typename?: 'Mutation', projectUpdate: { __typename?: 'ProjectUpdateOutput', columnsOrder: Array<string>, createdAt: any, description?: string | null, id: string, status: Status, title: string, updatedAt: any, visibility: ProjectVisibility } };

export type ProjectsEnrolledQueryVariables = Exact<{ [key: string]: never; }>;


export type ProjectsEnrolledQuery = { __typename?: 'Query', projectsEnrolled: Array<{ __typename?: 'ProjectsEnrolledOutput', id: string, title: string }> };

export type TaskAssignMutationVariables = Exact<{
  input: TaskAssignInput;
}>;


export type TaskAssignMutation = { __typename?: 'Mutation', taskAssign: { __typename?: 'TaskAssignOutput', taskId: string, userId: string } };

export type TaskCreateMutationVariables = Exact<{
  input: TaskCreateInput;
}>;


export type TaskCreateMutation = { __typename?: 'Mutation', taskCreate: { __typename?: 'TaskCreateOutput', columnId: string, taskId: string } };

export type TaskGetQueryVariables = Exact<{
  input: TaskGetInput;
}>;


export type TaskGetQuery = { __typename?: 'Query', taskGet: { __typename?: 'TaskGetOutput', assigneesIds: Array<string>, columnId: string, createdAt: any, createdBy: string, deadline?: any | null, description?: string | null, id: string, status: Status, subTasksOrder: Array<string>, title?: string | null, updatedAt: any } };

export type TaskMoveMutationVariables = Exact<{
  input: TaskMoveInput;
}>;


export type TaskMoveMutation = { __typename?: 'Mutation', taskMove: boolean };

export type TaskUnassignMutationVariables = Exact<{
  input: TaskUnassignInput;
}>;


export type TaskUnassignMutation = { __typename?: 'Mutation', taskUnassign: boolean };

export type TaskUpdateMutationVariables = Exact<{
  input: TaskUpdateInput;
}>;


export type TaskUpdateMutation = { __typename?: 'Mutation', taskUpdate: { __typename?: 'TaskUpdateOutput', columnId: string, createdAt: any, createdBy: string, deadline?: any | null, description?: string | null, status: Status, subTasksOrder: Array<string>, taskId: string, title?: string | null, updatedAt: any } };


export const CollaboratorAddDocument = `
    mutation CollaboratorAdd($input: CollaboratorAddInput!) {
  collaboratorAdd(input: $input) {
    createdAt
    id
    projectId
    updatedAt
    userId
  }
}
    `;
export const useCollaboratorAddMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CollaboratorAddMutation, TError, CollaboratorAddMutationVariables, TContext>) =>
    useMutation<CollaboratorAddMutation, TError, CollaboratorAddMutationVariables, TContext>(
      ['CollaboratorAdd'],
      (variables?: CollaboratorAddMutationVariables) => fetcher<CollaboratorAddMutation, CollaboratorAddMutationVariables>(CollaboratorAddDocument, variables)(),
      options
    );
useCollaboratorAddMutation.getKey = () => ['CollaboratorAdd'];

export const CollaboratorRemoveDocument = `
    mutation CollaboratorRemove($input: CollaboratorRemoveInput!) {
  collaboratorRemove(input: $input)
}
    `;
export const useCollaboratorRemoveMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<CollaboratorRemoveMutation, TError, CollaboratorRemoveMutationVariables, TContext>) =>
    useMutation<CollaboratorRemoveMutation, TError, CollaboratorRemoveMutationVariables, TContext>(
      ['CollaboratorRemove'],
      (variables?: CollaboratorRemoveMutationVariables) => fetcher<CollaboratorRemoveMutation, CollaboratorRemoveMutationVariables>(CollaboratorRemoveDocument, variables)(),
      options
    );
useCollaboratorRemoveMutation.getKey = () => ['CollaboratorRemove'];

export const ColumnCreateDocument = `
    mutation ColumnCreate($input: ColumnCreateInput!) {
  columnCreate(input: $input) {
    columnId
  }
}
    `;
export const useColumnCreateMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ColumnCreateMutation, TError, ColumnCreateMutationVariables, TContext>) =>
    useMutation<ColumnCreateMutation, TError, ColumnCreateMutationVariables, TContext>(
      ['ColumnCreate'],
      (variables?: ColumnCreateMutationVariables) => fetcher<ColumnCreateMutation, ColumnCreateMutationVariables>(ColumnCreateDocument, variables)(),
      options
    );
useColumnCreateMutation.getKey = () => ['ColumnCreate'];

export const ColumnDeleteDocument = `
    mutation ColumnDelete($input: ColumnDeleteInput!) {
  columnDelete(input: $input)
}
    `;
export const useColumnDeleteMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ColumnDeleteMutation, TError, ColumnDeleteMutationVariables, TContext>) =>
    useMutation<ColumnDeleteMutation, TError, ColumnDeleteMutationVariables, TContext>(
      ['ColumnDelete'],
      (variables?: ColumnDeleteMutationVariables) => fetcher<ColumnDeleteMutation, ColumnDeleteMutationVariables>(ColumnDeleteDocument, variables)(),
      options
    );
useColumnDeleteMutation.getKey = () => ['ColumnDelete'];

export const ProjectCreateDocument = `
    mutation ProjectCreate($input: ProjectCreateInput!) {
  projectCreate(input: $input) {
    projectId
  }
}
    `;
export const useProjectCreateMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ProjectCreateMutation, TError, ProjectCreateMutationVariables, TContext>) =>
    useMutation<ProjectCreateMutation, TError, ProjectCreateMutationVariables, TContext>(
      ['ProjectCreate'],
      (variables?: ProjectCreateMutationVariables) => fetcher<ProjectCreateMutation, ProjectCreateMutationVariables>(ProjectCreateDocument, variables)(),
      options
    );
useProjectCreateMutation.getKey = () => ['ProjectCreate'];

export const ProjectGetDocument = `
    query ProjectGet($input: ProjectGetInput!) {
  projectGet(input: $input) {
    title
    collaboratorsIds
    columnsOrder
    columns {
      id
      name
      taskOrder
    }
    tasks {
      assigneesIds
      id
      subTaskCount
      title
    }
  }
}
    `;
export const useProjectGetQuery = <
      TData = ProjectGetQuery,
      TError = unknown
    >(
      variables: ProjectGetQueryVariables,
      options?: UseQueryOptions<ProjectGetQuery, TError, TData>
    ) =>
    useQuery<ProjectGetQuery, TError, TData>(
      ['ProjectGet', variables],
      fetcher<ProjectGetQuery, ProjectGetQueryVariables>(ProjectGetDocument, variables),
      options
    );

useProjectGetQuery.getKey = (variables: ProjectGetQueryVariables) => ['ProjectGet', variables];
;

export const ProjectUpdateDocument = `
    mutation ProjectUpdate($input: ProjectUpdateInput!) {
  projectUpdate(input: $input) {
    columnsOrder
    createdAt
    description
    id
    status
    title
    updatedAt
    visibility
  }
}
    `;
export const useProjectUpdateMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<ProjectUpdateMutation, TError, ProjectUpdateMutationVariables, TContext>) =>
    useMutation<ProjectUpdateMutation, TError, ProjectUpdateMutationVariables, TContext>(
      ['ProjectUpdate'],
      (variables?: ProjectUpdateMutationVariables) => fetcher<ProjectUpdateMutation, ProjectUpdateMutationVariables>(ProjectUpdateDocument, variables)(),
      options
    );
useProjectUpdateMutation.getKey = () => ['ProjectUpdate'];

export const ProjectsEnrolledDocument = `
    query ProjectsEnrolled {
  projectsEnrolled {
    id
    title
  }
}
    `;
export const useProjectsEnrolledQuery = <
      TData = ProjectsEnrolledQuery,
      TError = unknown
    >(
      variables?: ProjectsEnrolledQueryVariables,
      options?: UseQueryOptions<ProjectsEnrolledQuery, TError, TData>
    ) =>
    useQuery<ProjectsEnrolledQuery, TError, TData>(
      variables === undefined ? ['ProjectsEnrolled'] : ['ProjectsEnrolled', variables],
      fetcher<ProjectsEnrolledQuery, ProjectsEnrolledQueryVariables>(ProjectsEnrolledDocument, variables),
      options
    );

useProjectsEnrolledQuery.getKey = (variables?: ProjectsEnrolledQueryVariables) => variables === undefined ? ['ProjectsEnrolled'] : ['ProjectsEnrolled', variables];
;

export const TaskAssignDocument = `
    mutation TaskAssign($input: TaskAssignInput!) {
  taskAssign(input: $input) {
    taskId
    userId
  }
}
    `;
export const useTaskAssignMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<TaskAssignMutation, TError, TaskAssignMutationVariables, TContext>) =>
    useMutation<TaskAssignMutation, TError, TaskAssignMutationVariables, TContext>(
      ['TaskAssign'],
      (variables?: TaskAssignMutationVariables) => fetcher<TaskAssignMutation, TaskAssignMutationVariables>(TaskAssignDocument, variables)(),
      options
    );
useTaskAssignMutation.getKey = () => ['TaskAssign'];

export const TaskCreateDocument = `
    mutation TaskCreate($input: TaskCreateInput!) {
  taskCreate(input: $input) {
    columnId
    taskId
  }
}
    `;
export const useTaskCreateMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<TaskCreateMutation, TError, TaskCreateMutationVariables, TContext>) =>
    useMutation<TaskCreateMutation, TError, TaskCreateMutationVariables, TContext>(
      ['TaskCreate'],
      (variables?: TaskCreateMutationVariables) => fetcher<TaskCreateMutation, TaskCreateMutationVariables>(TaskCreateDocument, variables)(),
      options
    );
useTaskCreateMutation.getKey = () => ['TaskCreate'];

export const TaskGetDocument = `
    query TaskGet($input: TaskGetInput!) {
  taskGet(input: $input) {
    assigneesIds
    columnId
    createdAt
    createdBy
    deadline
    description
    id
    status
    subTasksOrder
    title
    updatedAt
  }
}
    `;
export const useTaskGetQuery = <
      TData = TaskGetQuery,
      TError = unknown
    >(
      variables: TaskGetQueryVariables,
      options?: UseQueryOptions<TaskGetQuery, TError, TData>
    ) =>
    useQuery<TaskGetQuery, TError, TData>(
      ['TaskGet', variables],
      fetcher<TaskGetQuery, TaskGetQueryVariables>(TaskGetDocument, variables),
      options
    );

useTaskGetQuery.getKey = (variables: TaskGetQueryVariables) => ['TaskGet', variables];
;

export const TaskMoveDocument = `
    mutation TaskMove($input: TaskMoveInput!) {
  taskMove(input: $input)
}
    `;
export const useTaskMoveMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<TaskMoveMutation, TError, TaskMoveMutationVariables, TContext>) =>
    useMutation<TaskMoveMutation, TError, TaskMoveMutationVariables, TContext>(
      ['TaskMove'],
      (variables?: TaskMoveMutationVariables) => fetcher<TaskMoveMutation, TaskMoveMutationVariables>(TaskMoveDocument, variables)(),
      options
    );
useTaskMoveMutation.getKey = () => ['TaskMove'];

export const TaskUnassignDocument = `
    mutation TaskUnassign($input: TaskUnassignInput!) {
  taskUnassign(input: $input)
}
    `;
export const useTaskUnassignMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<TaskUnassignMutation, TError, TaskUnassignMutationVariables, TContext>) =>
    useMutation<TaskUnassignMutation, TError, TaskUnassignMutationVariables, TContext>(
      ['TaskUnassign'],
      (variables?: TaskUnassignMutationVariables) => fetcher<TaskUnassignMutation, TaskUnassignMutationVariables>(TaskUnassignDocument, variables)(),
      options
    );
useTaskUnassignMutation.getKey = () => ['TaskUnassign'];

export const TaskUpdateDocument = `
    mutation TaskUpdate($input: TaskUpdateInput!) {
  taskUpdate(input: $input) {
    columnId
    createdAt
    createdBy
    deadline
    description
    status
    subTasksOrder
    taskId
    title
    updatedAt
  }
}
    `;
export const useTaskUpdateMutation = <
      TError = unknown,
      TContext = unknown
    >(options?: UseMutationOptions<TaskUpdateMutation, TError, TaskUpdateMutationVariables, TContext>) =>
    useMutation<TaskUpdateMutation, TError, TaskUpdateMutationVariables, TContext>(
      ['TaskUpdate'],
      (variables?: TaskUpdateMutationVariables) => fetcher<TaskUpdateMutation, TaskUpdateMutationVariables>(TaskUpdateDocument, variables)(),
      options
    );
useTaskUpdateMutation.getKey = () => ['TaskUpdate'];
