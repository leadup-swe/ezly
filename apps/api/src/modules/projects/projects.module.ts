import { Module } from '@nestjs/common';
import { CoreModule } from 'src/core/core.module';
import { ProjectsResolvers } from './projects.resolvers';
import { ProjectsServiceFactory } from './services';

@Module({
  imports: [CoreModule],
  providers: [ProjectsResolvers, ProjectsServiceFactory],
})
export class ProjectsModule {}
