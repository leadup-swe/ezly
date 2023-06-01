import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectCreateOutput {
  @Field()
  projectId: string;
}
