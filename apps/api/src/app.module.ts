import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ProjectsModule } from './modules/projects/projects.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './core/config';
import { SecurityModule } from './core/security/security.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), `src/schema.gql`),
      sortSchema: true,
      playground: true,
    }),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    SecurityModule,
    ProjectsModule,
  ],
})
export class AppModule {}
