import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ProjectsEnrolledOutput {
  @Field()
  id: string;

  @Field()
  title: string;
}
