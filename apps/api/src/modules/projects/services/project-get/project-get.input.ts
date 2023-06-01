import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ProjectGetInput {
  @Field()
  projectId: string;
}
