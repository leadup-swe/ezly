import { TaskUnassignInput } from './services/task-unassign/task-unassign.input';
import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { ProjectsServiceFactory } from './services';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/core/security/guards/gql-auth.guard';
import { GqlCtx } from 'src/core/decorators/gql-context.decorator';
import { TGqlCtx } from 'src/types';
import { ProjectCreateService, ProjectCreateOutput, ProjectCreateInput } from './services/project-create';
import { TaskCreateInput, TaskCreateOutput, TaskCreateService } from './services/task-create';
import { ColumnCreateInput, ColumnCreateOutput, ColumnCreateService } from './services/column-create';
import { ColumnDeleteService, ColumnDeleteInput } from './services/column-delete';
import { ProjectsEnrolledOutput, ProjectsEnrolledService } from './services/projects-enrolled';
import { ProjectGetInput, ProjectGetOutput, ProjectGetService } from './services/project-get';
import { TaskGetOutput, TaskGetInput, TaskGetService } from './services/task-get';
import { CollaboratorAddOutput, CollaboratorAddInput, CollaboratorAddService } from './services/collaborator-add';
import { CollaboratorRemoveInput, CollaboratorRemoveService } from './services/collaborator-remove';
import { TaskAssignInput, TaskAssignOutput, TaskAssignService } from './services/task-assign';
import { TaskUnassignService } from './services/task-unassign';
import { ProjectUpdateOutput } from './services/project-update';
import { ProjectUpdateService } from './services/project-update';
import { ProjectUpdateInput } from './services/project-update';
import { TaskUpdateInput, TaskUpdateOutput, TaskUpdateService } from './services/task-update';
import { TaskMoveInput, TaskMoveService } from './services/task-move';

@Resolver()
export class ProjectsResolvers {
  constructor(private readonly serviceFactory: ProjectsServiceFactory) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => CollaboratorAddOutput)
  async collaboratorAdd(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => CollaboratorAddInput }) input: CollaboratorAddInput) {
    return (await this.serviceFactory.create(CollaboratorAddService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async collaboratorRemove(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => CollaboratorRemoveInput }) input: CollaboratorRemoveInput) {
    return (await this.serviceFactory.create(CollaboratorRemoveService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ColumnCreateOutput)
  async columnCreate(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => ColumnCreateInput }) input: ColumnCreateInput) {
    return (await this.serviceFactory.create(ColumnCreateService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async columnDelete(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => ColumnDeleteInput }) input: ColumnDeleteInput) {
    return (await this.serviceFactory.create(ColumnDeleteService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProjectCreateOutput)
  async projectCreate(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => ProjectCreateInput }) input: ProjectCreateInput) {
    return (await this.serviceFactory.create(ProjectCreateService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => ProjectGetOutput)
  async projectGet(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => ProjectGetInput }) input: ProjectGetInput) {
    return (await this.serviceFactory.create(ProjectGetService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => ProjectUpdateOutput)
  async projectUpdate(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => ProjectUpdateInput }) input: ProjectUpdateInput) {
    return (await this.serviceFactory.create(ProjectUpdateService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [ProjectsEnrolledOutput])
  async projectsEnrolled(@GqlCtx() ctx: TGqlCtx) {
    return (await this.serviceFactory.create(ProjectsEnrolledService)).handle(ctx);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TaskAssignOutput)
  async taskAssign(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => TaskAssignInput }) input: TaskAssignInput) {
    return (await this.serviceFactory.create(TaskAssignService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TaskCreateOutput)
  async taskCreate(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => TaskCreateInput }) input: TaskCreateInput) {
    return (await this.serviceFactory.create(TaskCreateService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => TaskGetOutput)
  async taskGet(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => TaskGetInput }) input: TaskGetInput) {
    return (await this.serviceFactory.create(TaskGetService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async taskMove(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => TaskMoveInput }) input: TaskMoveInput) {
    return (await this.serviceFactory.create(TaskMoveService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async taskUnassign(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => TaskUnassignInput }) input: TaskUnassignInput) {
    return (await this.serviceFactory.create(TaskUnassignService)).handle(ctx, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => TaskUpdateOutput)
  async taskUpdate(@GqlCtx() ctx: TGqlCtx, @Args(`input`, { type: () => TaskUpdateInput }) input: TaskUpdateInput) {
    return (await this.serviceFactory.create(TaskUpdateService)).handle(ctx, input);
  }
}
