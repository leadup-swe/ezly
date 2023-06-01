import { ServiceFactory } from 'src/core/factories/service.factory';
import { ProjectCreateService } from './project-create/project-create.service';
import { Injectable } from '@nestjs/common';
import { TaskCreateService } from './task-create';
import { ColumnCreateService } from './column-create';
import { ColumnDeleteService } from './column-delete/column-delete.service';
import { ProjectsEnrolledService } from './projects-enrolled/projects-enrolled.service';
import { ProjectGetService } from './project-get/project-get.service';
import { TaskGetService } from './task-get/task-get.service';
import { CollaboratorAddService } from './collaborator-add/collaborator-add.service';
import { CollaboratorRemoveService } from './collaborator-remove';
import { TaskAssignService } from './task-assign';
import { TaskUnassignService } from './task-unassign';
import { ProjectUpdateService } from './project-update';
import { TaskUpdateService } from './task-update';
import { TaskMoveService } from './task-move';

type AvailableServices =
  | CollaboratorAddService
  | CollaboratorRemoveService
  | ColumnCreateService
  | ColumnDeleteService
  | ProjectCreateService
  | ProjectGetService
  | ProjectUpdateService
  | ProjectsEnrolledService
  | TaskAssignService
  | TaskCreateService
  | TaskGetService
  | TaskMoveService
  | TaskUnassignService
  | TaskUpdateService;

@Injectable()
export class ProjectsServiceFactory extends ServiceFactory<AvailableServices> {}
